<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'total',
        'discount',
        'payment_method',
        'status',
        'observation',
    ];
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class);
    }
}
