<?php

namespace App\Services;

use App\Models\Service;
use App\Models\AvailabilityRule;
use App\Models\TimeSlot;
use App\Models\SlotOverride;
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

        DB::transaction(function () use ($period, $rules, $service, &$created) {
            foreach ($period as $day) {
                $dow = (int) $day->dayOfWeek;

                foreach ($rules[$dow] ?? [] as $rule) {                    
                    $step = $rule['slot_duration'];
                    $duration = $step;
                    // dd($duration);
                    $cursor = Carbon::parse($day->toDateString() . ' ' . $rule['start_time']);
                    $end    = Carbon::parse($day->toDateString() . ' ' . $rule['end_time']);

                    while ($cursor->copy()->addMinutes($duration) <= $end) {
                        $slotStart = $cursor->copy();
                        $slotEnd   = $slotStart->copy()->addMinutes($duration);

                        // Verifica se há bloqueios
                        $blocked = SlotOverride::where('service_id', $service->id)
                            ->whereDate('slot_date', $day->toDateString())
                            ->where('start_time', '<', $slotEnd->format('H:i:s'))
                            ->where('end_time', '>', $slotStart->format('H:i:s'))
                            ->where('action', 'blocked')
                            ->exists();
                      
                        // Upsert do slot
                        TimeSlot::updateOrCreate(
                            [
                                'service_id' => $service->id,
                                'slot_date'  => $day->toDateString(),
                                'start_time' => $slotStart->format('H:i:s'),
                            ],
                            [
                                'end_time' => $slotEnd->format('H:i:s'),
                                'status'   => $blocked ? 'blocked' : 'open',
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
