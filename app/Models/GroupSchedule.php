<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupSchedule extends Model
{
    protected $fillable = [
        'training_group_id',
        'day_of_week',
        'start_time',
        'end_time',
        'location',
        'notes',
        'facility_id',
    ];

    public function group()
    {
        return $this->belongsTo(TrainingGroup::class, 'training_group_id');
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
