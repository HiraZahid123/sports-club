<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Club;
use App\Models\TrainingGroup;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ParentStripePaymentTest extends TestCase
{
    use RefreshDatabase;

    private $club;
    private $parentRole;
    private $athleteRole;
    private $parent;
    private $athlete;
    private $subscription;
    private $stripeServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->parentRole = Role::firstOrCreate(['name' => 'Parent']);
        $this->athleteRole = Role::firstOrCreate(['name' => 'Athlete']);

        $this->club = Club::create([
            'name' => 'Test Club',
            'slug' => 'test-club',
            'email' => 'test@club.com',
        ]);

        $this->parent = User::factory()->create(['club_id' => $this->club->id]);
        $this->parent->assignRole('Parent');

        $this->athlete = User::factory()->create(['club_id' => $this->club->id]);
        $this->athlete->assignRole('Athlete');

        // Link parent and child
        $this->athlete->parents()->attach($this->parent->id, ['relationship' => 'Father']);

        $group = TrainingGroup::create([
            'club_id' => $this->club->id,
            'name' => 'Group A',
            'monthly_price' => 50,
        ]);

        $this->subscription = Subscription::create([
            'user_id' => $this->athlete->id,
            'club_id' => $this->club->id,
            'training_group_id' => $group->id,
            'plan_name' => 'Standard Monthly',
            'amount' => 50,
            'status' => 'overdue',
            'starts_at' => now(),
        ]);
        
        config(['services.stripe.secret' => 'sk_test_dummy']);

        // Mock the StripeService class
        $this->stripeServiceMock = $this->mock(\App\Services\StripeService::class);
    }

    public function test_parent_can_create_checkout_session_for_child_subscription(): void
    {
        $mockSession = (object) ['url' => 'https://checkout.stripe.com/pay/test_session_id'];
        
        $this->stripeServiceMock->shouldReceive('createCheckoutSession')
            ->once()
            ->with(\Mockery::on(fn($sub) => $sub->id === $this->subscription->id), \Mockery::any(), \Mockery::any())
            ->andReturn($mockSession);

        $response = $this->actingAs($this->parent)
            ->post(route('parent.billing.checkout', $this->subscription->id), [], ['X-Inertia' => 'true']);

        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/pay/test_session_id');
    }

    public function test_parent_cannot_create_checkout_session_for_unowned_subscription(): void
    {
        $otherUser = User::factory()->create(['club_id' => $this->club->id]);
        $otherUser->assignRole('Athlete');

        $otherSubscription = Subscription::create([
            'user_id' => $otherUser->id,
            'club_id' => $this->club->id,
            'plan_name' => 'Standard Monthly',
            'amount' => 50,
            'status' => 'overdue',
            'starts_at' => now(),
        ]);

        $response = $this->actingAs($this->parent)
            ->post(route('parent.billing.checkout', $otherSubscription->id));

        $response->assertStatus(403);
    }

    public function test_payment_success_callback_logs_payment_and_activates_subscription(): void
    {
        $mockSession = (object) [
            'payment_status' => 'paid',
            'metadata' => (object) [
                'subscription_id' => $this->subscription->id
            ]
        ];

        $this->stripeServiceMock->shouldReceive('retrieveCheckoutSession')
            ->once()
            ->with('cs_test_123')
            ->andReturn($mockSession);

        $response = $this->actingAs($this->parent)
            ->get(route('parent.billing.success', ['session_id' => 'cs_test_123']));

        $response->assertRedirect(route('parent.billing'));
        $response->assertSessionHas('success');
        $response->assertSessionHas('status', 'payment-success');

        $this->subscription->refresh();
        $this->assertEquals('active', $this->subscription->status);
        $this->assertNotNull($this->subscription->last_payment_at);
        $this->assertNotNull($this->subscription->next_payment_at);

        $this->assertDatabaseHas('payments', [
            'subscription_id' => $this->subscription->id,
            'amount' => 50,
            'payment_method' => 'stripe',
            'status' => 'completed',
            'transaction_id' => 'cs_test_123',
        ]);
    }

    public function test_duplicate_payment_success_callback_is_ignored(): void
    {
        Payment::create([
            'subscription_id' => $this->subscription->id,
            'amount' => 50,
            'payment_date' => now(),
            'payment_method' => 'stripe',
            'status' => 'completed',
            'transaction_id' => 'cs_test_123',
        ]);

        $mockSession = (object) [
            'payment_status' => 'paid',
            'metadata' => (object) [
                'subscription_id' => $this->subscription->id
            ]
        ];

        $this->stripeServiceMock->shouldReceive('retrieveCheckoutSession')
            ->once()
            ->with('cs_test_123')
            ->andReturn($mockSession);

        $response = $this->actingAs($this->parent)
            ->get(route('parent.billing.success', ['session_id' => 'cs_test_123']));

        $response->assertRedirect(route('parent.billing'));
        $response->assertSessionHas('status', 'payment-already-processed');

        $this->assertEquals(1, Payment::where('transaction_id', 'cs_test_123')->count());
    }

    protected function tearDown(): void
    {
        \Mockery::close();
        parent::tearDown();
    }
}
