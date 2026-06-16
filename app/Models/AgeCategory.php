<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgeCategory extends Model
{
    protected $fillable = [
        'club_id',
        'name',
        'min_age',
        'max_age',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function trainingGroups()
    {
        return $this->hasMany(TrainingGroup::class);
    }
}
