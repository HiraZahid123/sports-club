<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\TrainingGroup;
use App\Models\Payment;
use App\Models\Club;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AthleteProfileGroupAndInvoiceTest extends TestCase
{
    use DatabaseMigrations;

    private $club;
    private $athleteRole;
    private $athlete;
    private $group1;
    private $group2;
    private $plan1;
    private $plan2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->athleteRole = Role::firstOrCreate(['name' => 'Athlete']);

        $this->club = Club::create([
            'name' => 'Athlete Test Club',
            'slug' => 'athlete-test-club',
            'email' => 'athlete-test@club.com',
        ]);

        $this->athlete = User::factory()->create(['club_id' => $this->club->id]);
        $this->athlete->assignRole('Athlete');

        // Setup groups
        $this->group1 = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Taekwondo Beginners',
            'monthly_price' => 40,
        ]);

        $this->group2 = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Taekwondo Advanced',
            'monthly_price' => 60,
        ]);

        // Setup plans
        $this->plan1 = SubscriptionPlan::create([
            'club_id' => $this->club->id,
            'training_group_id' => $this->group1->id,
            'name' => 'Beginners Monthly',
            'monthly_price' => 40,
            'yearly_price' => 400,
            'is_active' => true,
        ]);

        $this->plan2 = SubscriptionPlan::create([
            'club_id' => $this->club->id,
            'training_group_id' => $this->group2->id,
            'name' => 'Advanced Monthly',
            'monthly_price' => 60,
            'yearly_price' => 600,
            'is_active' => true,
        ]);

        config(['services.stripe.secret' => 'sk_test_dummy']);
    }

    public function test_athlete_can_view_own_subscriptions_and_available_plans_on_profile(): void
    {
        // Subscribe to plan1
        Subscription::create([
            'user_id' => $this->athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $this->group1->id,
            'subscription_plan_id' => $this->plan1->id,
            'plan_name' => $this->plan1->name,
            'amount' => 40,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $response = $this->actingAs($this->athlete)
            ->get(route('profile.edit'));

        $response->assertStatus(200);
        
        // Assert the page is rendered with correct props
        $response->assertInertia(fn ($page) => $page
            ->component('Profile/Edit')
            ->has('mySubscriptions', 1)
            ->has('availablePlans', 1) // plan2 should be available, plan1 excluded because active
        );
    }

    public function test_athlete_can_request_to_join_additional_group(): void
    {
        // Mock StripeService
        $stripeMock = $this->mock(\App\Services\StripeService::class);
        $mockSession = (object) ['url' => 'https://checkout.stripe.com/pay/test_athlete_session'];
        
        $stripeMock->shouldReceive('createCheckoutSession')
            ->once()
            ->andReturn($mockSession);

        $response = $this->actingAs($this->athlete)
            ->post(route('athlete.profile.join-group'), [
                'subscription_plan_id' => $this->plan2->id,
                'billing_cycle' => 'monthly',
            ], ['X-Inertia' => 'true']);

        $response->assertStatus(409); // Inertia location redirect status is 409
        $response->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/pay/test_athlete_session');

        // Assert unpaid subscription is created
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $this->athlete->id,
            'subscription_plan_id' => $this->plan2->id,
            'status' => 'unpaid',
            'billing_cycle' => 'monthly',
            'amount' => 60,
        ]);
    }

    public function test_athlete_cannot_join_group_they_are_already_active_in(): void
    {
        Subscription::create([
            'user_id' => $this->athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $this->group2->id,
            'subscription_plan_id' => $this->plan2->id,
            'plan_name' => $this->plan2->name,
            'amount' => 60,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $response = $this->actingAs($this->athlete)
            ->from(route('profile.edit'))
            ->post(route('athlete.profile.join-group'), [
                'subscription_plan_id' => $this->plan2->id,
                'billing_cycle' => 'monthly',
            ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHas('error', 'You are already registered/subscribed to this training group.');
    }

    public function test_athlete_can_download_completed_payment_invoice(): void
    {
        $subscription = Subscription::create([
            'user_id' => $this->athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $this->group1->id,
            'subscription_plan_id' => $this->plan1->id,
            'plan_name' => $this->plan1->name,
            'amount' => 40,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $payment = Payment::create([
            'subscription_id' => $subscription->id,
            'amount' => 40,
            'payment_date' => now(),
            'payment_method' => 'stripe',
            'status' => 'completed',
            'transaction_id' => 'ch_test_123',
        ]);

        $response = $this->actingAs($this->athlete)
            ->get(route('invoices.download', $payment->id));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_athlete_cannot_download_other_users_invoice(): void
    {
        $otherAthlete = User::factory()->create(['club_id' => $this->club->id]);
        $otherAthlete->assignRole('Athlete');

        $subscription = Subscription::create([
            'user_id' => $otherAthlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $this->group1->id,
            'subscription_plan_id' => $this->plan1->id,
            'plan_name' => $this->plan1->name,
            'amount' => 40,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $payment = Payment::create([
            'subscription_id' => $subscription->id,
            'amount' => 40,
            'payment_date' => now(),
            'payment_method' => 'stripe',
            'status' => 'completed',
            'transaction_id' => 'ch_test_123',
        ]);

        $response = $this->actingAs($this->athlete)
            ->get(route('invoices.download', $payment->id));

        $response->assertStatus(403);
    }
}
