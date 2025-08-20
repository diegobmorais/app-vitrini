<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailabilityException;
use App\Models\AvailabilityRule;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function slots(Request $request)
    {
        $start = Carbon::parse($request->query('start_date'));
        $end   = Carbon::parse($request->query('end_date'));

        $services = Service::all();
        $rules = AvailabilityRule::all();
        $exceptions = AvailabilityException::whereBetween('date', [$start->toDateString(), $end->toDateString()])->get();
        $appointments = Appointment::whereBetween('scheduled_at', [$start->toDateString(), $end->toDateString()])
            ->get();

        $slots = $this->generateSlotsForAllServices($services, $rules, $exceptions, $appointments, $start, $end);

        return response()->json($slots);
    }

    protected function generateSlotsForAllServices($services, $rules, $exceptions, $appointments, Carbon $start, Carbon $end)
    {
        $allSlots = [];

        foreach ($services as $service) {
            $serviceSlots = $this->generateSlotsForService($service, $rules, $exceptions, $appointments, $start, $end);
            $allSlots = array_merge($allSlots, $serviceSlots);
        }

        return $allSlots;
    }

    protected function generateSlotsForService($service, $rules, $exceptions, $appointments, Carbon $start, Carbon $end)
    {
        $slots = [];
        $serviceRules = $rules->where('service_id', $service->id);

        // Agrupa exceções por data
        $exceptionsByDate = $exceptions->where('service_id', $service->id)
            ->groupBy(fn($ex) => $ex->date);

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $daySlots = $this->generateSlotsForDay(
                $service,
                $date,
                $serviceRules,
                $exceptionsByDate->get($date->toDateString(), collect()),
                $appointments
            );

            $slots = array_merge($slots, $daySlots);
        }

        return $slots;
    }

    protected function generateSlotsForDay($service, Carbon $date, $rules, $exceptions, $appointments)
    {
        $slots = [];

        // Filtra regras válidas para o dia
        $dayRules = $rules->filter(function ($rule) use ($date) {
            $fromOk = empty($rule->valid_from) || $date->toDateString() >= $rule->valid_from;
            $toOk   = empty($rule->valid_to)   || $date->toDateString() <= $rule->valid_to;
            $dowOk  = (int)$rule->day_of_week === $date->dayOfWeek;
            return $fromOk && $toOk && $dowOk;
        });

        // 1️⃣ Gera slots a partir das regras
        foreach ($dayRules as $rule) {
            $slots = array_merge($slots, $this->generateSlotsFromRule($service, $date, $rule));
        }

        // 2️⃣ Aplica exceções: block remove, extra adiciona
        $slots = $this->applyExceptions($slots, $date, $exceptions, $service);

        // 3️⃣ Marca slots ocupados pelos appointments
        $slots = $this->markOccupiedSlots($slots, $appointments, $date, $service);

        return $slots;
    }

    protected function generateSlotsFromRule($service, Carbon $date, $rule)
    {
        $slots = [];
        $duration = (int)($rule->slot_duration ?? 30);

        // Normaliza o horário de início e fim da regra
        $startTime = Carbon::parse($date->format('Y-m-d') . ' ' . $rule->start_time)
            ->minute(floor(Carbon::parse($rule->start_time)->minute / $duration) * $duration);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $rule->end_time);

        for ($t = $startTime->copy(); $t->lt($endTime); $t->addMinutes($duration)) {
            $slots[] = [
                'id' => implode('-', [$service->id, str_replace('-', '', $date->toDateString()), str_replace(':', '', $t->format('H:i'))]),
                'title' => $service->name,
                'start' => $t->format('Y-m-d\TH:i:00'),
                'end' => $t->copy()->addMinutes($duration)->format('Y-m-d\TH:i:00'),
                'allDay' => false,
                'extendedProps' => [
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'available' => true,
                ],
            ];
        }

        return $slots;
    }


    protected function applyExceptions(array $slots, Carbon $date, $exceptions, $service)
    {
        $collection = collect($slots);

        // 1️⃣ Remove slots bloqueados
        foreach ($exceptions->where('type', 'block') as $ex) {
            $startBlock = Carbon::parse($date->format('Y-m-d') . ' ' . $ex->start_time);
            $endBlock   = Carbon::parse($date->format('Y-m-d') . ' ' . $ex->end_time);

            $collection = $collection->reject(function ($slot) use ($startBlock, $endBlock) {
                $slotStart = Carbon::parse($slot['start']);
                return $slotStart->gte($startBlock) && $slotStart->lt($endBlock);
            });
        }

        // 2️⃣ Adiciona slots extras
        foreach ($exceptions->where('type', 'extra') as $ex) {
            $duration   = 30; // Pode ajustar se quiser dinamicamente
            $startExtra = Carbon::parse($date->format('Y-m-d') . ' ' . $ex->start_time);
            $endExtra   = Carbon::parse($date->format('Y-m-d') . ' ' . $ex->end_time);

            for ($t = $startExtra->copy(); $t->lt($endExtra); $t->addMinutes($duration)) {
                // Evita duplicidade
                if (!$collection->first(fn($s) => $s['start'] === $t->format('Y-m-d\TH:i:00'))) {
                    $collection->push([
                        'id'    => implode('-', [$service->id, str_replace('-', '', $date->toDateString()), str_replace(':', '', $t->format('H:i'))]),
                        'title' => $service->name,
                        'start' => $t->format('Y-m-d\TH:i:00'),
                        'end'   => $t->copy()->addMinutes($duration)->format('Y-m-d\TH:i:00'),
                        'allDay' => false,
                        'extendedProps' => [
                            'service_id'   => $service->id,
                            'service_name' => $service->name,
                            'available'    => true,
                        ],
                    ]);
                }
            }
        }

        return $collection->values()->all();
    }

    protected function markOccupiedSlots(array $slots, $appointments, Carbon $date, $service)
    {
        $collection = collect($slots);

        $serviceAppointments = $appointments->where('service_id', $service->id)
            ->where('date', $date->toDateString())
            ->where('is_available', false);

        foreach ($serviceAppointments as $app) {
            $appStart = Carbon::parse($date->format('Y-m-d') . ' ' . $app->start_time);
            $appEnd   = Carbon::parse($date->format('Y-m-d') . ' ' . $app->end_time);

            $collection = $collection->map(function ($slot) use ($appStart, $appEnd) {
                $slotStart = Carbon::parse($slot['start']);
                $slotEnd   = Carbon::parse($slot['end']);

                if ($slotStart->lt($appEnd) && $slotEnd->gt($appStart)) {
                    $slot['extendedProps']['available'] = false;
                }

                return $slot;
            });
        }

        return $collection->values()->all();
    }


    public function storeRule(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required',
            'end_time' => 'required',
            'slot_duration' => 'integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date',
        ]);

        $rule = AvailabilityRule::create($data);

        return response()->json($rule, 201);
    }

    public function storeException(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'type' => 'required|in:block,extra',
        ]);

        $exception = AvailabilityException::create($data);

        return response()->json($exception, 201);
    }

    public function getAvailabilityRules(Request $request)
    {
        $query = AvailabilityRule::query();

        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        return response()->json($query->get());
    }

    public function getAvailabilityExceptions(Request $request)
    {
        $query = AvailabilityException::query();

        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        return response()->json($query->get());
    }

    public function getAvailableSlots(Request $request)
    {
        $serviceId = $request->input('service_id');
        $today = Carbon::today();
        $endDate = $today->copy()->addDays(7);

        $availableSlots = [];

        // Busca regras de disponibilidade
        $rules = AvailabilityRule::where('service_id', $serviceId)
            ->where(function ($q) use ($today, $endDate) {
                $q->whereBetween('valid_from', [$today, $endDate])
                    ->orWhereNull('valid_from');
            })
            ->get();

        // Busca exceções (bloqueios ou horários extras)
        $exceptions = AvailabilityException::where('service_id', $serviceId)
            ->whereBetween('date', [$today, $endDate])
            ->get();

        // Gera slots baseados nas regras
        for ($date = $today; $date->lte($endDate); $date->addDay()) {
            $dayOfWeek = $date->dayOfWeek;
            $rule = $rules->firstWhere('day_of_week', $dayOfWeek);

            if (!$rule) continue;

            $start = Carbon::parse($rule->start_time);
            $end = Carbon::parse($rule->end_time);
            $slotDuration = $rule->slot_duration ?? 30;

            while ($start->lt($end)) {
                $slotTime = $start->format('H:i');
                $isBlocked = $exceptions->first(function ($ex) use ($date, $slotTime) {
                    return $ex->date === $date->format('Y-m-d') &&
                        $slotTime >= $ex->start_time &&
                        $slotTime < $ex->end_time;
                });

                if (!$isBlocked) {
                    $availableSlots[] = [
                        'date' => $date->format('Y-m-d'),
                        'start_time' => $slotTime,
                        'end_time' => $start->copy()->addMinutes($slotDuration)->format('H:i'),
                    ];
                }

                $start->addMinutes($slotDuration);
            }
        }

        return response()->json($availableSlots);
    }
}
