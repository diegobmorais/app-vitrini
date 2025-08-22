<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class AvailabilitySlotController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $slots = TimeSlot::query()
            ->where('service_id', $request->service_id)
            ->whereBetween('slot_date', [$request->start_date, $request->end_date])
            ->where('status', 'open')
            ->orderBy('slot_date')
            ->orderBy('start_time')
            ->get()
            ->groupBy('slot_date')
            ->map(function ($daySlots) {
                return [
                    'date' => $daySlots->first()->slot_date,
                    'slots' => $daySlots->map(fn($s) => [
                        'id'    => $s->id,
                        'start' => substr($s->start_time, 0, 5),
                        'end'   => substr($s->end_time, 0, 5),
                    ])->values(),
                ];
            })->values();

        return response()->json([
            'service' => Service::select('id', 'name')->find($request->service_id),
            'days' => $slots,
        ]);
    }
}
