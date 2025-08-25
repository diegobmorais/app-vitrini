<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function getSlots(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'service_ids' => 'nullable|array'
        ]);

        $query = TimeSlot::with('service', 'appointment')
            ->whereBetween('slot_date', [$request->start_date, $request->end_date]);

        if ($request->service_ids) {
            $query->whereIn('service_id', $request->service_ids);
        }

        $slots = $query->get()->map(function ($slot) {
            return [
                'title' => $slot->status === 'booked' ? 'Reservado' : 'Disponível',
                'start' => $slot->slot_date . 'T' . $slot->start_time,
                'end' => $slot->slot_date . 'T' . $slot->end_time,
                'service_id' => $slot->service_id,
                'slot_id' => $slot->id,
                'is_booked' => $slot->status === 'booked',
                'extendedProps' => [
                    'slot' => $slot
                ]
            ];
        });

        return response()->json($slots);
    }

    // Reservar um slot
    public function bookSlot(Request $request)
    {
        $request->validate([
            'slot_id' => 'required|exists:time_slots,id',
            'user_id' => 'required|exists:users,id',
            'pet_name' => 'nullable|string'
        ]);

        $slot = TimeSlot::findOrFail($request->slot_id);

        if ($slot->status === 'booked') {
            return response()->json(['error' => 'Slot já reservado'], 422);
        }

        $slot->status = 'booked';
        $slot->save();

        $appointment = Appointment::create([
            'service_id' => $slot->service_id,
            'slot_id' => $slot->id,
            'user_id' => $request->user_id,
            'pet_name' => $request->pet_name ?? null,
            'status' => 'pending'
        ]);

        return response()->json($appointment);
    }

    // Bloquear um slot
    public function blockSlot(Request $request)
    {
        $request->validate([
            'slot_id' => 'required|exists:time_slots,id'
        ]);

        $slot = TimeSlot::findOrFail($request->slot_id);

        if ($slot->status === 'booked') {
            return response()->json(['error' => 'Não é possível bloquear um slot reservado'], 422);
        }

        $slot->status = 'blocked';
        $slot->save();

        return response()->json(['message' => 'Slot bloqueado com sucesso']);
    }
    // Desbloquear um slot
    public function unblockSlot(Request $request)
    {
        $request->validate([
            'slot_id' => 'required|exists:time_slots,id'
        ]);

        $slot = TimeSlot::findOrFail($request->slot_id);

        if ($slot->status !== 'blocked' || $slot->status === 'booked') {
            return response()->json(['error' => 'O slot não está bloqueado'], 422);
        }

        $slot->status = 'available';
        $slot->save();

        return response()->json(['message' => 'Slot desbloqueado com sucesso']);
    }
}
