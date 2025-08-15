<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';
    protected $fillable = [
        'user_id',
        'service_id',
        'pet_name',
        'scheduled_at',
        'transport_option',
        'notes',
        'status',
    ];
    protected $casts = [
        'scheduled_at' => 'datetime',
    ];
}
