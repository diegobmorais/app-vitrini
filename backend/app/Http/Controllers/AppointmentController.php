<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

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
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_at' => 'required|date',
            'pet_name' => 'nullable|string',
            'transport_option' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create($data);

        return response()->json($appointment, 201);
    }
}
