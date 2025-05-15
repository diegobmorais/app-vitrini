<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'zipcode',
        'for_delivery',
    ];
    protected $casts = [
        'for_delivery' => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
