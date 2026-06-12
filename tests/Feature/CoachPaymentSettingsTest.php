<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Club;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CoachPaymentSettingsTest extends TestCase
{
    use RefreshDatabase;

    private $club;
    private $managerRole;
    private $coachRole;
    private $manager;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        $this->managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $this->coachRole = Role::firstOrCreate(['name' => 'Coach']);

        // Create club
        $this->club = Club::create([
            'name' => 'Test Club',
            'slug' => 'test-club',
            'email' => 'test@club.com',
        ]);

        // Create manager
        $this->manager = User::factory()->create(['club_id' => $this->club->id]);
        $this->manager->assignRole('Manager');
    }

    public function test_manager_can_update_coach_payment_settings(): void
    {
        $coach = User::factory()->create(['club_id' => $this->club->id]);
        $coach->assignRole('Coach');

        $response = $this
            ->actingAs($this->manager)
            ->post(route('manager.coaches.payment-settings', $coach->id), [
                'payment_option' => 'athlete',
                'payment_rate'   => 12.50,
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $coach->refresh();
        $this->assertNotNull($coach->coachProfile);
        $this->assertEquals('athlete', $coach->coachProfile->payment_option);
        $this->assertEquals(12.50, $coach->coachProfile->payment_rate);
    }

    public function test_manager_cannot_update_coach_settings_for_different_club(): void
    {
        $otherClub = Club::create([
            'name' => 'Other Club',
            'slug' => 'other-club',
            'email' => 'other@club.com',
        ]);

        $otherCoach = User::factory()->create(['club_id' => $otherClub->id]);
        $otherCoach->assignRole('Coach');

        $response = $this
            ->actingAs($this->manager)
            ->post(route('manager.coaches.payment-settings', $otherCoach->id), [
                'payment_option' => 'hourly',
                'payment_rate'   => 25.00,
            ]);

        $response->assertStatus(403);
    }

    public function test_payment_settings_validation(): void
    {
        $coach = User::factory()->create(['club_id' => $this->club->id]);
        $coach->assignRole('Coach');

        // Test invalid option
        $response = $this
            ->actingAs($this->manager)
            ->post(route('manager.coaches.payment-settings', $coach->id), [
                'payment_option' => 'invalid_option',
                'payment_rate'   => 12.50,
            ]);

        $response->assertSessionHasErrors(['payment_option']);

        // Test invalid rate (negative number)
        $response = $this
            ->actingAs($this->manager)
            ->post(route('manager.coaches.payment-settings', $coach->id), [
                'payment_option' => 'hourly',
                'payment_rate'   => -5.00,
            ]);

        $response->assertSessionHasErrors(['payment_rate']);
    }
}
