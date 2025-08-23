<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';
    protected $fillable = [
        'user_id',
        'service_id',
        'slot_id',
        'pet_name',      
        'transport_option',
        'notes',
        'status',
        'is_available'
    ];  
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
