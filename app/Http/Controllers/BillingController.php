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
}
