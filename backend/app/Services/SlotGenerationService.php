<?php

namespace App\Services;

use App\Models\Service;
use App\Models\AvailabilityRule;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class SlotGenerationService
{
    public function generateForRange(int $serviceId, string $startDate, string $endDate): int
    {
        $service = Service::findOrFail($serviceId);
        $rules = AvailabilityRule::where('service_id', $serviceId)
            ->where('is_active', true)
            ->get()
            ->groupBy('day_of_week')
            ->toArray();
        $period = CarbonPeriod::create($startDate, $endDate);
        $created = 0;

        if (empty($rules)) {
            throw new \Exception("Nenhuma regra de disponibilidade encontrada para este serviço.");
        }

        $existSlots = TimeSlot::where('service_id', $serviceId)
            ->whereBetween('slot_date', [$startDate, $endDate])
            ->exists();
        
        if ($existSlots) {
            throw new \Exception("Já existem horários registrados para este serviço nesta data.");
        }

        DB::transaction(function () use ($period, $rules, $service, &$created) {
            foreach ($period as $day) {
                $dow = (int) $day->dayOfWeek;

                foreach ($rules[$dow] ?? [] as $rule) {
                    $step = $rule['slot_duration'];
                    $duration = $step;

                    $cursor = Carbon::parse($day->toDateString() . ' ' . $rule['start_time']);
                    $end    = Carbon::parse($day->toDateString() . ' ' . $rule['end_time']);

                    while ($cursor->copy()->addMinutes($duration) <= $end) {
                        $slotStart = $cursor->copy();
                        $slotEnd   = $slotStart->copy()->addMinutes($duration);

                        // Upsert do slot
                        TimeSlot::updateOrCreate(
                            [
                                'service_id' => $service->id,
                                'slot_date'  => $day->toDateString(),
                                'start_time' => $slotStart->format('H:i:s'),
                            ],
                            [
                                'end_time' => $slotEnd->format('H:i:s'),
                                'status'   => 'open',
                            ]
                        );

                        $created++;
                        $cursor->addMinutes($step);
                    }
                }
            }
        });

        return $created;
    }
}
