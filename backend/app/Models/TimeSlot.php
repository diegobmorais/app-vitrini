<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    protected $table = 'time_slots';
    protected $fillable = [     
        'service_id',       
        'slot_date',
        'start_time',
        'end_time',
        'status',
    ];
}
