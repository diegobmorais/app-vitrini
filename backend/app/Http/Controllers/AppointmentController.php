<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::query();

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $appointments = $query->with('service', 'user', 'time_slot')
            ->orderBy('slot_id', 'asc')
            ->paginate(10);


        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'pet_name' => 'nullable|string',
            'transport_option' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        $data['user_id'] = $request->user()->id;

        $slot =  TimeSlot::where('slot_date', $request->start_date)
            ->where('start_time', $request->start_time)
            ->where('service_id', $request->service_id)
            ->first();

        $data['slot_id'] = $slot->id;

        if (!$slot) {
            return response()->json([
                'error' => 'Horário não encontrado.'
            ], 404);
        }
        if ($slot->status === 'booked') {
            return response()->json([
                'error' => 'Horário já reservado.'
            ], 422);
        }

        $appointment = Appointment::create($data);

        $slot->status = 'booked';
        $slot->save();

        return response()->json([
            'message' => 'Agendamento realizado com sucesso',
            'data' => $appointment
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->status = $data['status'];
        $appointment->save();

        return response()->json([
            'message' => 'Status atualizado com sucesso',
            'data' => $appointment
        ], 200);
    }
}
