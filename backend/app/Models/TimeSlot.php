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
    public function appointment()
    {
        return $this->hasMany(Appointment::class, 'slot_id');
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
