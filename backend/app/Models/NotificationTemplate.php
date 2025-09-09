<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'type',
        'message',
        'enable_email',
        'enable_sms',
    ];
}
