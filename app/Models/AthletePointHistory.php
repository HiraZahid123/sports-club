<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AthletePointHistory extends Model
{
    protected $table = 'athlete_point_histories';

    protected $fillable = [
        'athlete_id',
        'club_id',
        'points',
        'period_start_date',
        'period_end_date',
    ];

    protected $casts = [
        'points'            => 'integer',
        'period_start_date' => 'date',
        'period_end_date'   => 'date',
    ];

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }
}
