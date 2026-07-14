<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Club;
use App\Models\TrainingGroup;
use App\Models\TrainingAttendance;
use App\Models\AthleteProfile;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PointsAndAttendanceTest extends TestCase
{
    use DatabaseMigrations;

    private $club;
    private $athleteRole;
    private $athlete;
    private $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->athleteRole = Role::firstOrCreate(['name' => 'Athlete']);

        $this->club = Club::create([
            'name' => 'Taekwondo Club',
            'slug' => 'tkd-club',
            'email' => 'tkd@club.com',
        ]);

        $this->athlete = User::factory()->create(['club_id' => $this->club->id]);
        $this->athlete->assignRole('Athlete');

        // Ensure athlete profile is created
        AthleteProfile::firstOrCreate([
            'user_id' => $this->athlete->id,
        ], [
            'belt_rank' => '10. WHITE',
            'event_points' => 0,
        ]);

        $this->group = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Beginners',
            'monthly_price' => 45,
        ]);
    }

    public function test_training_attendance_updates_athlete_points(): void
    {
        // 1. Initial points should be 0
        $profile = $this->athlete->athleteProfile;
        $this->assertEquals(0, $profile->event_points);

        // 2. Log a present training attendance with 5 points earned
        TrainingAttendance::create([
            'training_group_id' => $this->group->id,
            'athlete_id' => $this->athlete->id,
            'attendance_date' => now()->format('Y-m-d'),
            'status' => 'present',
            'base_points' => 5,
            'extra_points' => 0,
        ]);

        // 3. Verify points updated to 5
        $profile->refresh();
        $this->assertEquals(5, $profile->event_points);

        // 4. Log an absent training attendance (should not add points)
        TrainingAttendance::create([
            'training_group_id' => $this->group->id,
            'athlete_id' => $this->athlete->id,
            'attendance_date' => now()->subDay()->format('Y-m-d'),
            'status' => 'absent',
            'base_points' => 5,
            'extra_points' => 0,
        ]);

        $profile->refresh();
        $this->assertEquals(5, $profile->event_points);
    }
}
