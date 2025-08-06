<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    public $fillable = ['name', 'description'];
    public $timestamps = true;

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
