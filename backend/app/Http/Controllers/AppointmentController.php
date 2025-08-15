<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //dd
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'       => 'required|exists:services,id',
            'pet_name'         => 'required|string|max:255',
            'scheduled_at'     => 'required|date_format:"Y-m-d H:i:s"',
            'transport_option' => 'required|string|max:50',
            'notes'            => 'nullable|string',
        ]);

        AvailabilitySlot::where('id', $request->slot_id)
            ->update(['is_booked' => 0]);

        $appointment = Appointment::create([
            'user_id'         => Auth::id(),
            'service_id'      => $validated['service_id'],
            'pet_name'        => $validated['pet_name'],
            'scheduled_at'    => $validated['scheduled_at'],
            'transport_option' => $validated['transport_option'],
            'notes'           => $validated['notes'] ?? null,
            'status'          => 'pending',
        ]);

        return response()->json([
            'message'     => 'Appointment created successfully',
            'appointment' => $appointment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
