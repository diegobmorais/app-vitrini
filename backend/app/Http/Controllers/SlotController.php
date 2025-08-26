<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Services\SlotGenerationService;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    private $generationSlotService;
    public function __construct(SlotGenerationService $generationSlotService)
    {
        $this->generationSlotService = $generationSlotService;
    }
    public function generateSlot(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        try {
            $result = $this->generationSlotService->generateForRange(
                $data['service_id'],
                $data['start_date'],
                $data['end_date'],
            );

            return response()->json([
                'status' => 'success',
                'message' => "Gerados {$result} horários com sucesso!",
                'slots_criados' => $result
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'warning',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function toggleSlot(Request $request, $id)
    {
        $data = $request->validate([
            'action' => 'required|in:block,unblock',
        ]);

        $slot = TimeSlot::findOrFail($id);
        if ($slot->status === 'booked') {
            return response()->json(['error' => 'Não é possível alterar um slot já reservado.'], 422);
        }

        $slot->status = $data['action'] === 'block' ? 'blocked' : 'available';
        $slot->save();

        return response()->json([
            'message' => "Status do horário atualizado com sucesso!"
        ]);
    }
}
