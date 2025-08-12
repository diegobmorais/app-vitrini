<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'subtotal',
        'discount',
        'shipping',
        'tax',
        'total',
        'status',
        'shipping_address',
        'payment_meta'
    ];
    protected $casts = [
        'shipping_address' => 'array',
        'payment_meta' => 'array',
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
