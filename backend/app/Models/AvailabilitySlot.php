<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilitySlot extends Model
{
    protected $table = 'availability_slots';

    protected $fillable = [
        'service_id',
        'date',
        'start_time',
        'end_time',
        'is_booked',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
