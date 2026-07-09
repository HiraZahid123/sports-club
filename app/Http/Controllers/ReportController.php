<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\CoachPayout;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display the financial reports for the manager.
     */
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;
        
        // Revenue by month (last 6 months)
        $revenueData = Payment::whereHas('subscription', function($q) use ($clubId) {
                $q->where('club_id', $clubId);
            })
            ->select(DB::raw('SUM(amount) as total'), DB::raw("DATE_FORMAT(payment_date, '%Y-%m') as month_key"), DB::raw("DATE_FORMAT(payment_date, '%b %Y') as month"))
            ->groupBy('month_key', 'month')
            ->orderBy('payment_date', 'desc')
            ->limit(6)
            ->get();

        // Coach Payouts by month (last 6 months)
        $payoutsData = CoachPayout::where('club_id', $clubId)
            ->where('status', 'paid')
            ->select(DB::raw('SUM(amount) as total'), DB::raw("DATE_FORMAT(payout_date, '%Y-%m') as month_key"))
            ->groupBy('month_key')
            ->get()
            ->keyBy('month_key');

        // Consolidate monthly income and payouts
        $financials = $revenueData->map(function ($item) use ($payoutsData) {
            $monthKey = $item->month_key;
            $payout = $payoutsData->get($monthKey);
            $payoutTotal = $payout ? (float) $payout->total : 0.0;
            return [
                'month' => $item->month,
                'income' => (float) $item->total,
                'payouts' => $payoutTotal,
                'net' => (float) $item->total - $payoutTotal,
            ];
        });

        // Coach List with compensation data
        $coaches = User::role('Coach')
            ->where('club_id', $clubId)
            ->with([
                'coachProfile',
                'trainingGroups.athletes',
                'trainingGroups.schedules',
                'coachPayouts' => function($q) {
                    $q->orderBy('payout_date', 'desc');
                }
            ])
            ->get();

        // Recent Payouts
        $recentPayouts = CoachPayout::where('club_id', $clubId)
            ->with('user')
            ->orderBy('payout_date', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Manager/Reports/Index', [
            'revenueData' => $revenueData,
            'financials' => $financials,
            'coaches' => $coaches,
            'recentPayouts' => $recentPayouts,
        ]);
    }

    /**
     * Record a payout to a coach.
     */
    public function storePayout(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01',
            'tip' => 'nullable|numeric|min:0',
            'payout_date' => 'required|date',
            'payment_type' => 'required|string|in:Monthly Salary,Hourly Rate,Per Session,Commission,Bonus,Per Athlete,Fixed Amount',
            'notes' => 'nullable|string',
        ]);

        $baseAmount = (float) $validated['amount'];
        $tipAmount = (float) ($validated['tip'] ?? 0.00);

        CoachPayout::create([
            'user_id' => $validated['user_id'],
            'amount' => $baseAmount + $tipAmount,
            'tip' => $tipAmount,
            'payout_date' => $validated['payout_date'],
            'payment_type' => $validated['payment_type'],
            'notes' => $validated['notes'],
            'club_id' => $request->user()->club_id,
            'status' => 'paid',
        ]);

        return back()->with('status', 'payout-recorded');
    }

    /**
     * Update the coach's payment settings.
     */
    public function updatePaymentSettings(Request $request, User $user)
    {
        if ($user->club_id !== $request->user()->club_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'payment_option' => 'required|string|in:athlete,hourly,manual',
            'payment_rate'   => 'required|numeric|min:0',
        ]);

        $user->coachProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'payment_option' => $validated['payment_option'],
                'payment_rate'   => $validated['payment_rate'],
                'hourly_rate'    => $validated['payment_option'] === 'hourly' ? $validated['payment_rate'] : ($user->coachProfile->hourly_rate ?? 0.00),
            ]
        );

        return back()->with('status', 'payment-settings-updated');
    }
}
