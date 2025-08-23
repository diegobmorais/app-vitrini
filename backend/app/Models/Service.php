<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
    protected $appends = ['image_url'];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }   

    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }  

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class);
    }
}
