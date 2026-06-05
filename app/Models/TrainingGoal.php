<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingGoal extends Model
{
    protected $fillable = [
        'athlete_id',
        'coach_id',
        'title',
        'description',
        'category',
        'status',
        'target_date',
    ];

    protected $casts = [
        'target_date' => 'date:Y-m-d',
    ];

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}
