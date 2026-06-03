<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingGroup extends Model
{
    protected $fillable = [
        'club_id',
        'name',
        'description',
        'monthly_price',
        'capacity',
        'skill_level',
        'age_range',
    ];

    /**
     * Get the club that owns the training group.
     */
    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Get the users (athletes and coaches) assigned to the group.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'training_group_user')
            ->withPivot('role_in_group')
            ->withTimestamps();
    }

    /**
     * Get only the athletes in this group.
     */
    public function athletes()
    {
        return $this->users()->wherePivot('role_in_group', 'Athlete');
    }

    /**
     * Get only the coaches in this group.
     */
    public function coaches()
    {
        return $this->users()->wherePivot('role_in_group', 'Coach');
    }

    /**
     * Get the weekly schedule slots for this group.
     */
    public function schedules()
    {
        return $this->hasMany(GroupSchedule::class, 'training_group_id')
            ->orderByRaw("FIELD(day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')")
            ->orderBy('start_time');
    }
}
