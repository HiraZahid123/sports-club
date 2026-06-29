<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\TrainingGroup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;

        $subscriptions = Subscription::where('club_id', $clubId)
            ->with(['user', 'payments', 'trainingGroup', 'plan'])
            ->latest()
            ->get();

        $plans = SubscriptionPlan::where('club_id', $clubId)
            ->with('trainingGroup:id,name')
            ->orderBy('name')
            ->get();

        $groups = TrainingGroup::where('club_id', $clubId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $members = User::where('club_id', $clubId)
            ->whereHas('roles', function ($q) {
                $q->whereIn('name', ['Athlete', 'Parent', 'Coach']);
            })
            ->orderBy('name')
            ->get(['id', 'name']);

        $totalRevenue = Payment::whereHas('subscription', function ($q) use ($clubId) {
            $q->where('club_id', $clubId);
        })->sum('amount');

        return Inertia::render('Manager/Billing/Index', [
            'subscriptions' => $subscriptions,
            'plans'         => $plans,
            'groups'        => $groups,
            'members'       => $members,
            'totalRevenue'  => $totalRevenue,
        ]);
    }

    public function storeSubscription(Request $request)
    {
        $clubId = $request->user()->club_id;

        $validated = $request->validate([
            'user_id'              => 'required|exists:users,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle'        => 'required|in:monthly,yearly',
            'starts_at'            => 'required|date',
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['subscription_plan_id']);
        abort_if($plan->club_id !== $clubId, 403);

        $amount  = $validated['billing_cycle'] === 'yearly' ? $plan->yearly_price : $plan->monthly_price;
        $startsAt = Carbon::parse($validated['starts_at']);
        $endsAt  = $validated['billing_cycle'] === 'yearly'
            ? $startsAt->copy()->addYear()
            : $startsAt->copy()->addMonth();

        Subscription::create([
            'user_id'              => $validated['user_id'],
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

        return back()->with('status', 'subscription-created');
    }

    public function destroySubscription(Request $request, Subscription $subscription)
    {
        abort_if($subscription->club_id !== $request->user()->club_id, 403);
        $subscription->delete();

        return back()->with('status', 'subscription-deleted');
    }

    public function logPayment(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'amount'       => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'notes'        => 'nullable|string',
        ]);

        Payment::create([
            'subscription_id' => $subscription->id,
            'amount'          => $validated['amount'],
            'payment_date'    => $validated['payment_date'],
            'notes'           => $validated['notes'],
            'status'          => 'completed',
        ]);

        $nextPayment = $subscription->billing_cycle === 'yearly'
            ? now()->addYear()
            : now()->addMonth();

        $subscription->update([
            'status'          => 'active',
            'last_payment_at' => $validated['payment_date'],
            'next_payment_at' => $nextPayment,
        ]);

        return back()->with('status', 'payment-logged');
    }

    public function parentBilling(Request $request)
    {
        $subscriptions = $request->user()->subscriptions()->with('payments')->get();

        $childrenIds = $request->user()->children()->pluck('athlete_id');
        $childrenSubscriptions = Subscription::whereIn('user_id', $childrenIds)
            ->with(['user', 'payments'])
            ->get();

        return Inertia::render('Parent/Billing/Index', [
            'mySubscriptions'       => $subscriptions,
            'childrenSubscriptions' => $childrenSubscriptions,
        ]);
    }

    public function createCheckoutSession(Request $request, Subscription $subscription, \App\Services\StripeService $stripeService)
    {
        $user = $request->user();

        $isOwned = $subscription->user_id === $user->id ||
                   $user->children()->where('users.id', $subscription->user_id)->exists();

        if (!$isOwned) {
            abort(403, 'Unauthorized access to subscription.');
        }

        try {
            $checkoutSession = $stripeService->createCheckoutSession($subscription);
            return Inertia::location($checkoutSession->url);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create checkout session: ' . $e->getMessage());
        }
    }

    public function paymentSuccess(Request $request, \App\Services\StripeService $stripeService)
    {
        $sessionId = $request->query('session_id');
        if (!$sessionId) {
            return redirect()->route('parent.billing')->with('error', 'Missing checkout session ID.');
        }

        try {
            $session = $stripeService->retrieveCheckoutSession($sessionId);
        } catch (\Exception $e) {
            return redirect()->route('parent.billing')->with('error', 'Failed to retrieve checkout session details.');
        }

        if ($session->payment_status !== 'paid') {
            return redirect()->route('parent.billing')->with('error', 'Payment has not been completed.');
        }

        $subscriptionId = $session->metadata->subscription_id ?? null;
        if (!$subscriptionId) {
            return redirect()->route('parent.billing')->with('error', 'Invalid payment metadata.');
        }

        $subscription = Subscription::with('user')->find($subscriptionId);
        if (!$subscription) {
            return redirect()->route('parent.billing')->with('error', 'Subscription not found.');
        }

        $user = $request->user();
        $isOwned = $subscription->user_id === $user->id ||
                   $user->children()->where('users.id', $subscription->user_id)->exists();

        if (!$isOwned) {
            abort(403, 'Unauthorized access to subscription.');
        }

        $duplicate = Payment::where('transaction_id', $sessionId)->exists();
        if ($duplicate) {
            return redirect()->route('parent.billing')->with('status', 'payment-already-processed');
        }

        Payment::create([
            'subscription_id' => $subscription->id,
            'amount'          => $subscription->amount,
            'payment_date'    => now(),
            'payment_method'  => 'stripe',
            'status'          => 'completed',
            'transaction_id'  => $sessionId,
            'notes'           => 'Stripe Checkout completed for ' . ($subscription->user->name ?? 'member'),
        ]);

        $subscription->update([
            'status'          => 'active',
            'last_payment_at' => now(),
            'next_payment_at' => now()->addMonth(),
        ]);

        return redirect()->route('parent.billing')
            ->with('success', 'Your subscription payment was processed successfully!')
            ->with('status', 'payment-success');
    }
}
