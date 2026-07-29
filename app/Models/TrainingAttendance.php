<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TrainingAttendance extends Model
{
    protected $table = 'training_attendances';

    protected $fillable = [
        'training_group_id',
        'athlete_id',
        'attendance_date',
        'status',
        'base_points',
        'extra_points',
        'created_by',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'base_points'      => 'integer',
        'extra_points'    => 'integer',
    ];

    protected static function booted()
    {
        static::saved(function ($attendance) {
            static::syncProfilePoints($attendance->athlete_id);
        });

        static::deleted(function ($attendance) {
            static::syncProfilePoints($attendance->athlete_id);
        });
    }

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }

    public function trainingGroup()
    {
        return $this->belongsTo(TrainingGroup::class, 'training_group_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Recalculates and synchronizes the total points for a given athlete.
     * This sums event registration points (where status is attended) and
     * training attendance points (where status is present).
     */
    public static function syncProfilePoints(int $athleteId): void
    {
        $user = User::findOrFail($athleteId);
        $profile = AthleteProfile::firstOrCreate(['user_id' => $athleteId]);
        $club = $user->club;
        $periodStart = $club && isset($club->settings['points_period_start'])
            ? $club->settings['points_period_start']
            : null;

        // Sum event registration points since period start
        $eventQuery = EventRegistration::where('user_id', $athleteId)
            ->where('status', 'attended')
            ->whereHas('event');

        if ($periodStart) {
            $eventQuery->whereHas('event', function ($q) use ($periodStart) {
                $q->where('start_date', '>=', $periodStart);
            });
        }

        $eventPoints = $eventQuery->get()->sum(function ($reg) {
            return $reg->event->points ?? 0;
        });

        // Sum training attendance points (present status) since period start
        $trainingQuery = self::where('athlete_id', $athleteId)
            ->where('status', 'present');

        if ($periodStart) {
            $trainingQuery->where('attendance_date', '>=', $periodStart);
        }

        $trainingPoints = $trainingQuery->sum(DB::raw('base_points + extra_points'));

        // Update the athlete profile
        $profile->update([
            'event_points' => $eventPoints + $trainingPoints + ($profile->manual_points_adjustment ?? 0),
        ]);
    }

}
