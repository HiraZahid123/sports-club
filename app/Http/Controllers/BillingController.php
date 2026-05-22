<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    /**
     * Display the manager's billing overview.
     */
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;
        
        $subscriptions = Subscription::where('club_id', $clubId)
            ->with(['user', 'payments'])
            ->get();

        $totalRevenue = Payment::whereHas('subscription', function($q) use ($clubId) {
            $q->where('club_id', $clubId);
        })->sum('amount');

        return Inertia::render('Manager/Billing/Index', [
            'subscriptions' => $subscriptions,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    /**
     * Display the parent's billing and payment page.
     */
    public function parentBilling(Request $request)
    {
        $subscriptions = $request->user()->subscriptions()->with('payments')->get();
        
        // Also get children subscriptions
        $childrenIds = $request->user()->children()->pluck('athlete_id');
        $childrenSubscriptions = Subscription::whereIn('user_id', $childrenIds)->with(['user', 'payments'])->get();

        return Inertia::render('Parent/Billing/Index', [
            'mySubscriptions' => $subscriptions,
            'childrenSubscriptions' => $childrenSubscriptions,
        ]);
    }

    /**
     * Log a manual payment.
     */
    public function logPayment(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        Payment::create([
            'subscription_id' => $subscription->id,
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'notes' => $validated['notes'],
            'status' => 'completed',
        ]);

        $subscription->update([
            'status' => 'active',
            'last_payment_at' => $validated['payment_date'],
            'next_payment_at' => now()->addMonth(), // Assuming monthly
        ]);

        return back()->with('status', 'payment-logged');
    }

    /**
     * Create a Stripe Checkout Session for a subscription.
     */
    public function createCheckoutSession(Request $request, Subscription $subscription, \App\Services\StripeService $stripeService)
    {
        $user = $request->user();

        // Validate that the subscription belongs to the logged-in parent or one of their children
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

    /**
     * Handle the successful checkout callback.
     */
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

        // Validate that the subscription belongs to the logged-in parent or one of their children
        $user = $request->user();
        $isOwned = $subscription->user_id === $user->id || 
                   $user->children()->where('users.id', $subscription->user_id)->exists();

        if (!$isOwned) {
            abort(403, 'Unauthorized access to subscription.');
        }

        // Check for duplicate payment using session ID as transaction_id
        $duplicate = Payment::where('transaction_id', $sessionId)->exists();
        if ($duplicate) {
            return redirect()->route('parent.billing')->with('status', 'payment-already-processed');
        }

        // Log the payment
        Payment::create([
            'subscription_id' => $subscription->id,
            'amount' => $subscription->amount,
            'payment_date' => now(),
            'payment_method' => 'stripe',
            'status' => 'completed',
            'transaction_id' => $sessionId,
            'notes' => 'Stripe Checkout completed for ' . ($subscription->user->name ?? 'member'),
        ]);

        // Update subscription status to active, last payment date, and next payment date (1 month from now)
        $subscription->update([
            'status' => 'active',
            'last_payment_at' => now(),
            'next_payment_at' => now()->addMonth(),
        ]);

        return redirect()->route('parent.billing')
            ->with('success', 'Your subscription payment was processed successfully!')
            ->with('status', 'payment-success');
    }
}
