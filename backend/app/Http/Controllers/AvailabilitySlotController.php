<?php

namespace App\Http\Controllers;

use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;

class AvailabilitySlotController extends Controller
{
    public function getAvailableSlots(Request $request)
    {

        $slots = AvailabilitySlot::all();

        return response()->json($slots);
    }

    public function createSlots(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'interval_minutes' => 'nullable|integer|min:15|max:120',
            'mode' => 'required|in:single,multiple'
        ]);

        $slots = [];

        if ($request->mode === 'single') {        
            $exists = AvailabilitySlot::where('service_id', $request->service_id)
                ->where('date', $request->date)
                ->where('start_time', $request->start_time)
                ->where('end_time', $request->end_time)
                ->exists();

            if (!$exists) {
                $slots[] = [
                    'service_id' => $request->service_id,
                    'date' => $request->date,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'is_booked' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        } else {         
            if (!$request->filled('interval_minutes')) {
                return response()->json(['message' => 'Intervalo é obrigatório no modo múltiplo'], 422);
            }

            $startTime = strtotime($request->start_time);
            $endTime = strtotime($request->end_time);
            $intervalSeconds = $request->interval_minutes * 60;

            while ($startTime < $endTime) {
                $slotStart = date('H:i', $startTime);
                $slotEnd = date('H:i', $startTime + $intervalSeconds);
          
                $exists = AvailabilitySlot::where('service_id', $request->service_id)
                    ->where('date', $request->date)
                    ->where('start_time', $slotStart)
                    ->where('end_time', $slotEnd)
                    ->exists();

                if (!$exists) {
                    $slots[] = [
                        'service_id' => $request->service_id,
                        'date' => $request->date,
                        'start_time' => $slotStart,
                        'end_time' => $slotEnd,
                        'is_booked' => false,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }

                $startTime += $intervalSeconds;
            }
        }

        if (!empty($slots)) {
            AvailabilitySlot::insert($slots);
        }

        return response()->json([
            'message' => count($slots) . ' slots criados com sucesso',
            'created_count' => count($slots),
            'slots' => $slots
        ]);
    }

    public function bookSlot($slotId)
    {
        $slot = AvailabilitySlot::findOrFail($slotId);
        $slot->update(['is_booked' => true]);
        return response()->json($slot);
    }

    public function unbookSlot($slotId)
    {
        $slot = AvailabilitySlot::findOrFail($slotId);
        $slot->update(['is_booked' => false]);
        return response()->json($slot);
    }
    public function freeTime($slotId)
    {  
        $slot = AvailabilitySlot::where('service_id', $slotId)
        ->where('is_booked', true)
        ->get();
     
        return response()->json($slot);
    }
}
