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

        $rules = AvailabilityRule::where('service_id', $service_id)->get();
        $exceptions = AvailabilityException::where('service_id', $service_id)
            ->whereBetween('date', [$start, $end])
            ->get();
        $appointments = Appointment::where('service_id', $service_id)
            ->whereBetween('scheduled_at', [$start->startOfDay(), $end->endOfDay()])
            ->get();

        $availableSlots = [];

        $period = CarbonPeriod::create($start, $end);
        foreach ($period as $date) {
            $dayOfWeek = $date->dayOfWeek; 

            foreach ($rules as $rule) {
                if ($rule->day_of_week != $dayOfWeek) continue;

                $slotStart = Carbon::parse($rule->start_time);
                $slotEnd = Carbon::parse($rule->end_time);

                while ($slotStart < $slotEnd) {
                    $slotTime = $date->copy()->setTimeFrom($slotStart);

                    // Checar exceções
                    $blocked = $exceptions->where('type', 'block')->where('date', $date->toDateString())->filter(function ($ex) use ($slotTime) {
                        if ($ex->start_time && $ex->end_time) {
                            return $slotTime->between(Carbon::parse($ex->start_time), Carbon::parse($ex->end_time));
                        }
                        return true;
                    })->count();

                    if ($blocked) {
                        $slotStart->addMinutes($rule->slot_duration);
                        continue;
                    }

                    // Checar se já está agendado
                    $alreadyBooked = $appointments->filter(function ($a) use ($slotTime) {
                        return Carbon::parse($a->scheduled_at)->eq($slotTime);
                    })->count();

                    if (!$alreadyBooked) {
                        $availableSlots[] = $slotTime->toDateTimeString();
                    }

                    $slotStart->addMinutes($rule->slot_duration);
                }
            }

            // Adicionar horários extras
            $extras = $exceptions->where('type', 'extra')->where('date', $date->toDateString());
            foreach ($extras as $extra) {
                $startExtra = Carbon::parse($extra->start_time);
                $endExtra = Carbon::parse($extra->end_time);

                while ($startExtra < $endExtra) {
                    $slotTime = $date->copy()->setTimeFrom($startExtra);
                    if (!$appointments->where('scheduled_at', $slotTime->toDateTimeString())->count()) {
                        $availableSlots[] = $slotTime->toDateTimeString();
                    }
                    $startExtra->addMinutes(30);
                }
            }
        }

        sort($availableSlots);

        return response()->json($availableSlots);
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
}
