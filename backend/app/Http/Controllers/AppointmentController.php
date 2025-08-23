<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Ramsey\Uuid\Type\Time;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::query();

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('scheduled_at', [$request->start_date, $request->end_date]);
        }

        $appointments = $query->with('service', 'user')
            ->orderBy('scheduled_at')->pluck('scheduled_at');

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

        $slotId =  TimeSlot::where('slot_date', $request->start_date)
            ->where('start_time', $request->start_time)
            ->where('service_id', $request->service_id)
            ->value('id');

        $data['slot_id'] = $slotId;

        $appointment = Appointment::create($data);

        return response()->json([
            'message' => 'Agendamento realizado com sucesso',
            'data' => $appointment
        ], 201);
    }
}
