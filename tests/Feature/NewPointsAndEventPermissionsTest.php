<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Club;
use App\Models\TrainingGroup;
use App\Models\TrainingAttendance;
use App\Models\AthleteProfile;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\AthletePointHistory;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class NewPointsAndEventPermissionsTest extends TestCase
{
    use DatabaseMigrations;

    private $club;
    private $manager;
    private $athlete;
    private $group;
    private $athleteRole;
    private $managerRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->athleteRole = Role::firstOrCreate(['name' => 'Athlete']);
        $this->managerRole = Role::firstOrCreate(['name' => 'Manager']);

        $this->club = Club::create([
            'name' => 'TKD Academy',
            'slug' => 'tkd-academy',
            'email' => 'academy@tkd.com',
            'settings' => [
                'regular_training_points' => 8,
            ]
        ]);

        $this->manager = User::factory()->create(['club_id' => $this->club->id]);
        $this->manager->assignRole('Manager');

        $this->athlete = User::factory()->create(['club_id' => $this->club->id]);
        $this->athlete->assignRole('Athlete');

        AthleteProfile::firstOrCreate([
            'user_id' => $this->athlete->id,
        ], [
            'belt_rank' => '10. WHITE',
            'event_points' => 0,
        ]);

        $this->group = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Vip Group',
            'monthly_price' => 50,
        ]);

        $this->athlete->trainingGroups()->attach($this->group->id, ['role_in_group' => 'Athlete']);
    }

    public function test_default_regular_training_points_is_read_from_club_settings(): void
    {
        // Manager loads attendance page -> points should default to 8 (configured in setUp)
        $this->actingAs($this->manager);
        
        $response = $this->get(route('manager.attendance.index', ['group_id' => $this->group->id]));
        $response->assertStatus(200);
        $response->assertSee('8'); // check default points visible on page props
    }

    public function test_reset_points_system_archives_legacy_points(): void
    {
        // 1. Give athlete initial points
        $profile = $this->athlete->athleteProfile;
        $profile->update(['event_points' => 150]);

        // 2. Perform points reset
        $this->actingAs($this->manager);
        $response = $this->post(route('manager.points.reset'));
        $response->assertRedirect();

        // 3. Profile points should be 0
        $profile->refresh();
        $this->assertEquals(0, $profile->event_points);

        // 4. Archive history should contain 150 points
        $history = AthletePointHistory::where('athlete_id', $this->athlete->id)->first();
        $this->assertNotNull($history);
        $this->assertEquals(150, $history->points);
    }

    public function test_event_category_selection_and_points_award(): void
    {
        // 1. Create a category
        $category = EventCategory::create([
            'club_id' => $this->club->id,
            'name' => 'Category A',
            'points' => 50,
        ]);

        // 2. Create event with category
        $event = Event::create([
            'club_id' => $this->club->id,
            'created_by' => $this->manager->id,
            'name' => 'Elite Sparring Tourney',
            'start_date' => now()->format('Y-m-d'),
            'points' => 50,
            'event_category_id' => $category->id,
        ]);

        // Link group to event
        $event->groups()->attach($this->group->id, ['can_join' => true]);

        // 3. Register athlete to event and set status to attended
        $registration = $event->registrations()->create([
            'user_id' => $this->athlete->id,
            'status' => 'attended',
            'registered_at' => now(),
        ]);

        // 4. Sync profile points
        TrainingAttendance::syncProfilePoints($this->athlete->id);

        $profile = $this->athlete->athleteProfile->refresh();
        $this->assertEquals(50, $profile->event_points);
    }

    public function test_event_see_vs_join_permissions(): void
    {
        // 1. Create event with can_join = false for Vip Group
        $event = Event::create([
            'club_id' => $this->club->id,
            'created_by' => $this->manager->id,
            'name' => 'Closed Exhibition Event',
            'start_date' => now()->format('Y-m-d'),
            'points' => 10,
        ]);

        // Group can see, but cannot join
        $event->groups()->attach($this->group->id, ['can_join' => false]);

        // 2. Try to join event as Athlete -> should fail with 403
        $this->actingAs($this->athlete);
        $response = $this->post(route('athlete.events.join', $event->id));
        $response->assertStatus(403);
    }

    public function test_attended_event_automatically_goes_to_athlete_week_plan_and_dashboard(): void
    {
        // 1. Create event
        $event = Event::create([
            'club_id' => $this->club->id,
            'created_by' => $this->manager->id,
            'name' => 'Weekly Special Event',
            'start_date' => '2026-08-05', // Wednesday
            'points' => 10,
        ]);

        // 2. Register athlete to event and set status to attended
        $event->registrations()->create([
            'user_id' => $this->athlete->id,
            'status' => 'attended',
            'registered_at' => now(),
        ]);

        $this->actingAs($this->athlete);

        // Check Schedule Route
        $response = $this->get(route('athlete.schedule'));
        $response->assertStatus(200);
        
        $scheduleProps = $response->original->getData()['page']['props']['schedules'];
        $eventSlot = collect($scheduleProps)->firstWhere('is_event', true);
        $this->assertNotNull($eventSlot);
        $this->assertEquals('Weekly Special Event', $eventSlot['event_name']);
        $this->assertEquals('Wednesday', $eventSlot['day_of_week']);
        $this->assertEquals('00:00:00', $eventSlot['start_time']);

        // Check Dashboard Route
        $responseDashboard = $this->get(route('athlete.dashboard'));
        $responseDashboard->assertStatus(200);

        $upcomingSchedulesProps = $responseDashboard->original->getData()['page']['props']['upcomingSchedules'];
        $dashboardEventSlot = collect($upcomingSchedulesProps)->firstWhere('is_event', true);
        $this->assertNotNull($dashboardEventSlot);
        $this->assertEquals('Event: Weekly Special Event', $dashboardEventSlot['group']['name']);
        $this->assertEquals('Wednesday', $dashboardEventSlot['day_of_week']);
    }
}
