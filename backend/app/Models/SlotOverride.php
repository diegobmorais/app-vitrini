<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SlotOverride extends Model
{
    protected $table = 'slots_overrides';
    protected $fillable = [
        'service_id',
        'slot_date',
        'start_time',
        'end_time',
        'action',
        'reason',
    ];
}
