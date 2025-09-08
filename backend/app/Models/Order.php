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
    protected $appends = ['items_count'];
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function getItemsCountAttribute()
    {
        return $this->items()->sum('quantity');
    }
}
