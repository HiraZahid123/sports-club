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
        $profile = AthleteProfile::firstOrCreate(['user_id' => $athleteId]);

        // Sum event registration points
        $eventPoints = EventRegistration::where('user_id', $athleteId)
            ->where('status', 'attended')
            ->whereHas('event')
            ->get()
            ->sum(function ($reg) {
                return $reg->event->points ?? 0;
            });

        // Sum training attendance points (present status)
        $trainingPoints = self::where('athlete_id', $athleteId)
            ->where('status', 'present')
            ->sum(DB::raw('base_points + extra_points'));

        // Update the athlete profile
        $profile->update([
            'event_points' => $eventPoints + $trainingPoints + ($profile->manual_points_adjustment ?? 0),
        ]);
    }
}
