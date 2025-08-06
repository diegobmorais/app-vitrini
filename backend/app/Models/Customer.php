<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{   
    protected $table = 'users';
    protected static function booted()
    {
        static::addGlobalScope('customers', function (Builder $builder) {
            $builder->where('role_id', 2); 
        });
    }
  
    public function orders()
    {
        // return $this->hasMany(Order::class, 'user_id');
    }
}
