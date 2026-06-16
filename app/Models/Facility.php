<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $fillable = [
        'club_id',
        'name',
        'type',
        'capacity',
        'notes',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function schedules()
    {
        return $this->hasMany(GroupSchedule::class);
    }
}
