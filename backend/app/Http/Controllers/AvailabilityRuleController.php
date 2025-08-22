<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityRule;
use Illuminate\Http\Request;

class AvailabilityRuleController extends Controller
{
    /**
     * Lista todas as regras de um serviço.
     */
    public function index($serviceId)
    {
        $rules = AvailabilityRule::where('service_id', $serviceId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json($rules);
    }

    /**
     * Cria uma nova regra de disponibilidade.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'   => 'required|exists:services,id',
            'day_of_week'  => 'required|integer|min:0|max:6',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'slot_duration'     => 'nullable|integer|min:5|max:480',
            'is_active'    => 'boolean',
        ]);

        $rule = AvailabilityRule::create($validated);

        return response()->json([
            'message' => 'Regra criada com sucesso!',
            'data'    => $rule
        ], 201);
    }

    /**
     * Atualiza uma regra existente.
     */
    public function update(Request $request, $id)
    {
        $rule = AvailabilityRule::findOrFail($id);

        $validated = $request->validate([
            'day_of_week'  => 'required|integer|min:0|max:6',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'slot_duration'     => 'nullable|integer|min:5|max:480',
            'is_active'    => 'boolean',
        ]);

        $rule->update($validated);

        return response()->json([
            'message' => 'Regra atualizada com sucesso!',
            'data'    => $rule
        ]);
    }

    /**
     * Remove uma regra existente.
     */
    public function destroy($id)
    {
        $rule = AvailabilityRule::findOrFail($id);
        $rule->delete();

        return response()->json([
            'message' => 'Regra removida com sucesso!'
        ]);
    }
}
