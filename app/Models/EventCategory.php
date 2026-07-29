<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    protected $fillable = [
        'club_id',
        'name',
        'points',
    ];

    protected $casts = [
        'points' => 'integer',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
