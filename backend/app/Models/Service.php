<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{   
    protected $fillable = [
        'name',
        'description',        
        'price',        
        'category_id',        
        'slug',
        'images'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
