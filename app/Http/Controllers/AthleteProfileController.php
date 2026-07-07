<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\StripeService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AthleteProfileController extends Controller
{
    /**
     * Join an additional group/plan for the athlete and redirect to Stripe checkout.
     */
    public function joinGroup(Request $request, StripeService $stripeService)
    {
        $user = $request->user();
        $clubId = $user->club_id;

        $validated = $request->validate([
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle'        => 'required|in:monthly,yearly',
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);
        
        // Ensure plan belongs to same club as athlete
        if ($plan->club_id !== $clubId) {
            abort(403, 'Unauthorized plan access.');
        }

        // Check if athlete is already subscribed to this group
        $existing = Subscription::where('user_id', $user->id)
            ->where('training_group_id', $plan->training_group_id)
            ->whereIn('status', ['active', 'unpaid', 'overdue'])
            ->first();

        if ($existing) {
            return back()->with('error', 'You are already registered/subscribed to this training group.');
        }

        $amount = $validated['billing_cycle'] === 'yearly' ? $plan->yearly_price : $plan->monthly_price;
        $startsAt = Carbon::now();
        $endsAt = $validated['billing_cycle'] === 'yearly'
            ? $startsAt->copy()->addYear()
            : $startsAt->copy()->addMonth();

        $subscription = Subscription::create([
            'user_id'              => $user->id,
            'club_id'              => $clubId,
            'training_group_id'    => $plan->training_group_id,
            'subscription_plan_id' => $plan->id,
            'plan_name'            => $plan->name,
            'amount'               => $amount,
            'billing_cycle'        => $validated['billing_cycle'],
            'status'               => 'unpaid',
            'starts_at'            => $startsAt,
            'ends_at'              => $endsAt,
            'next_payment_at'      => $startsAt,
        ]);

        try {
            $successUrl = route('athlete.billing.success') . '?session_id={CHECKOUT_SESSION_ID}';
            $cancelUrl = route('profile.edit');
            $session = $stripeService->createCheckoutSession($subscription, $successUrl, $cancelUrl);
            
            return Inertia::location($session->url);
        } catch (\Exception $e) {
            $subscription->delete();
            return back()->with('error', 'Stripe checkout session failed: ' . $e->getMessage());
        }
    }
}
