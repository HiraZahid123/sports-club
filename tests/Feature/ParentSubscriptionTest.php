<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Club;
use App\Models\TrainingGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ParentSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private $club;
    private $parentRole;
    private $athleteRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        $this->parentRole = Role::firstOrCreate(['name' => 'Parent']);
        $this->athleteRole = Role::firstOrCreate(['name' => 'Athlete']);

        // Create club
        $this->club = Club::create([
            'name' => 'Test Club',
            'slug' => 'test-club',
            'email' => 'test@club.com',
        ]);
    }

    public function test_parent_with_no_children_is_considered_paid(): void
    {
        $parent = User::factory()->create(['club_id' => $this->club->id]);
        $parent->assignRole('Parent');

        $this->assertTrue($parent->isPaid());
    }

    public function test_parent_with_paid_children_is_considered_paid(): void
    {
        $parent = User::factory()->create(['club_id' => $this->club->id]);
        $parent->assignRole('Parent');

        $athlete = User::factory()->create(['club_id' => $this->club->id]);
        $athlete->assignRole('Athlete');

        // Link athlete to parent
        $athlete->parents()->attach($parent->id, ['relationship' => 'Father']);

        $group = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Group A',
            'monthly_price' => 50,
        ]);

        Subscription::create([
            'user_id' => $athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $group->id,
            'plan_name' => 'Standard Monthly',
            'amount' => 50,
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $this->assertTrue($parent->isPaid());
    }

    public function test_parent_with_overdue_children_is_not_considered_paid(): void
    {
        $parent = User::factory()->create(['club_id' => $this->club->id]);
        $parent->assignRole('Parent');

        $athlete = User::factory()->create(['club_id' => $this->club->id]);
        $athlete->assignRole('Athlete');

        // Link athlete to parent
        $athlete->parents()->attach($parent->id, ['relationship' => 'Father']);

        $group = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Group A',
            'monthly_price' => 50,
        ]);

        Subscription::create([
            'user_id' => $athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $group->id,
            'plan_name' => 'Standard Monthly',
            'amount' => 50,
            'status' => 'overdue',
            'starts_at' => now(),
        ]);

        $this->assertFalse($parent->isPaid());
    }
}
