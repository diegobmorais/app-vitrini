<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'company_name',
        'cnpj',
        'contact_name',
        'email',
        'phone',
        'website',
        'notes',      
        'status',
        'address',
        'city',
        'state',
        'zipcode',
    ];
    protected $casts = [
        'status' => 'boolean',
    ];
}
