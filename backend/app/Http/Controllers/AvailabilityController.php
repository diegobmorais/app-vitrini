<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailabilityException;
use App\Models\AvailabilityRule;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $service_id = $request->service_id;
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);

        $rulesQuery = AvailabilityRule::query();
        $exceptionsQuery = AvailabilityException::query();
        $appointmentsQuery = Appointment::query();

        if ($service_id) {
            $rulesQuery->where('service_id', $service_id);
            $exceptionsQuery->where('service_id', $service_id);
            $appointmentsQuery->where('service_id', $service_id);
        }

        $rules = $rulesQuery->get();
        $exceptions = $exceptionsQuery->whereBetween('date', [$start, $end])->get();
        $appointments = $appointmentsQuery->whereBetween('scheduled_at', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])->get();

        $events = [];

        $period = CarbonPeriod::create($start, $end);
        foreach ($period as $date) {
            $dayOfWeek = $date->dayOfWeek;

            foreach ($rules as $rule) {
                if ($rule->day_of_week != $dayOfWeek) continue;

                $slotStart = Carbon::parse($rule->start_time);
                $slotEnd = Carbon::parse($rule->end_time);

                while ($slotStart < $slotEnd) {
                    $slotTime = $date->copy()->setTimeFrom($slotStart);

                    $slotDateTime = $date->copy()
                        ->hour($slotStart->hour)
                        ->minute($slotStart->minute)
                        ->second($slotStart->second);

                    // Exceções bloqueadas
                    $blocked = $exceptions->where('type', 'block')
                        ->where('date', $date->toDateString())
                        ->filter(fn($ex) => $slotTime->between(Carbon::parse($ex->start_time), Carbon::parse($ex->end_time)))
                        ->count();

                    if ($blocked) {
                        $slotStart->addMinutes($rule->slot_duration);
                        continue;
                    }

                    // Já agendado?
                    $alreadyBooked = $appointments->filter(fn($a) => Carbon::parse($a->scheduled_at)->eq($slotTime))->count();

                    $events[] = [
                        'id' => uniqid(),
                        'title' => $alreadyBooked ? 'Reservado' : 'Disponível',
                        'start' => $slotDateTime->toDateTimeString(),
                        'end'   => $slotDateTime->copy()->addMinutes($rule->slot_duration)->toDateTimeString(),
                        'backgroundColor' => $alreadyBooked ? '#F87171' : '#34D399',
                        'borderColor'     => $alreadyBooked ? '#F87171' : '#34D399',
                        'extendedProps'   => [
                            'service_id' => $rule->service_id,
                            'is_booked' => $alreadyBooked,
                        ]
                    ];

                    $slotStart->addMinutes($rule->slot_duration);
                }
            }

            // Horários extras
            $extras = $exceptions->where('type', 'extra')->where('date', $date->toDateString());
            foreach ($extras as $extra) {
                $startExtra = Carbon::parse($extra->start_time);
                $endExtra = Carbon::parse($extra->end_time);

                while ($startExtra < $endExtra) {
                    $slotTime = $date->copy()->setTimeFrom($startExtra);

                    $slotDateTime = $date->copy()
                        ->hour($slotStart->hour)
                        ->minute($slotStart->minute)
                        ->second($slotStart->second);

                    $alreadyBooked = $appointments->where('scheduled_at', $slotTime->toDateTimeString())->count();

                    $events[] = [
                        'id' => uniqid(),
                        'title' => $alreadyBooked ? 'Reservado' : 'Disponível',
                        'start' => $slotDateTime->toDateTimeString(),
                        'end'   => $slotDateTime->copy()->addMinutes(30)->toDateTimeString(),
                        'backgroundColor' => $alreadyBooked ? '#F87171' : '#34D399',
                        'borderColor'     => $alreadyBooked ? '#F87171' : '#34D399',
                        'extendedProps'   => [
                            'service_id' => $extra->service_id,
                            'is_booked' => $alreadyBooked,
                        ]
                    ];

                    $startExtra->addMinutes(30);
                }
            }
        }

        return response()->json($events);
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
    public function getAvailability(Request $request)
    {
        $serviceId = $request->service_id;
        $date = Carbon::parse($request->start)->setTimezone('America/Sao_Paulo');

        $dayOfWeek = $date->dayOfWeek;
        $rules = AvailabilityRule::where('service_id', $serviceId)
            ->where('day_of_week', $dayOfWeek)
            ->get();
       
        // 2️⃣ Buscar exceções para essa data
        $exceptions = AvailabilityException::where('service_id', $serviceId)
            ->where('date', $date->toDateString())
            ->get();

        // 3️⃣ Buscar agendamentos já existentes
        $appointments = Appointment::where('service_id', $serviceId)
            ->whereDate('scheduled_at', $date->toDateString())
            ->get();

        $events = [];

        // 4️⃣ Gerar slots a partir das regras
        foreach ($rules as $rule) {
            $startTime = Carbon::parse($rule->start_time)->setTimezone('America/Sao_Paulo');
            $endTime = Carbon::parse($rule->end_time)->setTimezone('America/Sao_Paulo');
            $slotDuration = $rule->slot_duration ?: 30;

            while ($startTime < $endTime) {
                $slotStart = $date->copy()->setTimeFrom($startTime);
                $slotEnd = $slotStart->copy()->addMinutes($slotDuration);

                // Checar se já está agendado
                $alreadyBooked = $appointments->filter(function ($a) use ($slotStart) {
                    return Carbon::parse($a->scheduled_at)->eq($slotStart);
                })->isNotEmpty();

                // Checar se há bloqueio na exception
                $isBlocked = $exceptions->where('type', 'block')
                    ->filter(function ($ex) use ($slotStart, $slotEnd) {
                        $exStart = Carbon::parse($ex->start_time);
                        $exEnd = Carbon::parse($ex->end_time);
                        return $slotStart->between($exStart, $exEnd) || $slotEnd->between($exStart, $exEnd);
                    })->isNotEmpty();

                if (!$alreadyBooked && !$isBlocked) {
                    $events[] = [
                        'id' => uniqid(),
                        'title' => 'Disponível',
                        'start' => $slotStart->toDateTimeString(),
                        'end' => $slotEnd->toDateTimeString(),
                        'backgroundColor' => '#34D399',
                        'borderColor' => '#34D399',
                        'classNames' => ['available'],
                        'extendedProps' => [
                            'service_id' => $serviceId,
                            'is_booked' => false,
                            'type' => 'slot'
                        ]
                    ];
                }

                $startTime->addMinutes($slotDuration);
            }
        }

        // 5️⃣ Adicionar slots unitários ou extras da exception
        foreach ($exceptions as $ex) {
            if ($ex->type === 'extra') {
                $slotStart = Carbon::parse($ex->start_time);
                $slotEnd = Carbon::parse($ex->end_time);

                // Checar agendamento
                $alreadyBooked = $appointments->filter(function ($a) use ($slotStart) {
                    return Carbon::parse($a->scheduled_at)->eq($slotStart);
                })->isNotEmpty();

                if (!$alreadyBooked) {
                    $events[] = [
                        'id' => uniqid(),
                        'title' => 'Disponível',
                        'start' => $slotStart->toDateTimeString(),
                        'end' => $slotEnd->toDateTimeString(),
                        'backgroundColor' => '#34D399',
                        'borderColor' => '#34D399',
                        'classNames' => ['available'],
                        'extendedProps' => [
                            'service_id' => $serviceId,
                            'is_booked' => false,
                            'type' => 'slot'
                        ]
                    ];
                }
            }
        }

        return response()->json($events);
    }
}
