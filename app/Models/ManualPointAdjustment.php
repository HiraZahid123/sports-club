<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualPointAdjustment extends Model
{
    protected $fillable = [
        'athlete_id',
        'adjusted_by',
        'points',
        'comment',
        'date',
    ];

    protected $casts = [
        'points' => 'integer',
        'date'   => 'date',
    ];

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }

    public function adjustedBy()
    {
        return $this->belongsTo(User::class, 'adjusted_by');
    }
}
