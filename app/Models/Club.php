<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'address',
        'phone',
        'email',
        'logo_path',
        'description',
        'settings',
        'is_active',
        'join_code',
        'sport_type',
        'founding_date',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'founding_date' => 'date',
    ];

    public function ageCategories()
    {
        return $this->hasMany(AgeCategory::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }

    /**
     * Get the users (members/staff) for the club.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function invitations()
    {
        return $this->hasMany(\App\Models\ClubInvitation::class);
    }

    public function eventCategories()
    {
        return $this->hasMany(EventCategory::class);
    }

    public function athletePointHistories()
    {
        return $this->hasMany(AthletePointHistory::class);
    }

    /**
     * Resets points for all athletes in the club and archives their final score.
     */
    public function resetPointsSystem(string $resetDate): void
    {
        $athletes = $this->users()->role('Athlete')->with('athleteProfile')->get();
        $startPeriod = $this->settings['points_period_start'] ?? ($this->created_at ? $this->created_at->toDateString() : now()->toDateString());

        foreach ($athletes as $athlete) {
            $profile = $athlete->athleteProfile;
            $currentPoints = $profile ? $profile->event_points : 0;

            if ($currentPoints > 0) {
                AthletePointHistory::create([
                    'athlete_id'        => $athlete->id,
                    'club_id'           => $this->id,
                    'points'            => $currentPoints,
                    'period_start_date' => $startPeriod,
                    'period_end_date'   => $resetDate,
                ]);
            }

            if ($profile) {
                $profile->update([
                    'manual_points_adjustment' => 0,
                    'event_points'             => 0,
                ]);
            }
        }

        $settings = $this->settings ?? [];
        $settings['points_period_start'] = $resetDate;
        $settings['points_reset_date']   = null; // Clear auto-trigger date
        $this->update(['settings' => $settings]);

        // Re-sync after resetting settings to ensure profile points are computed from new period
        foreach ($athletes as $athlete) {
            TrainingAttendance::syncProfilePoints($athlete->id);
        }
    }
}

