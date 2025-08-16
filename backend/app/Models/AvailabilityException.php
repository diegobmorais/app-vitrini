<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityException extends Model
{
    protected $fillable = [
        'service_id',
        'date',
        'start_time',
        'end_time',
        'type'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
