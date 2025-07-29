<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{   
    use HasFactory;
    protected $fillable = [
        'name',
        'description',        
        'price',
        'slug',
        'image',
        'status'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
