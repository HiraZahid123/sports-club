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
            ->select(DB::raw('SUM(amount) as total'), DB::raw("DATE_FORMAT(payment_date, '%b %Y') as month"))
            ->groupBy('month')
            ->orderBy('payment_date', 'desc')
            ->limit(6)
            ->get();

        // Coach List with compensation data
        $coaches = User::role('Coach')
            ->where('club_id', $clubId)
            ->with([
                'coachProfile',
                'trainingGroups.athletes',
                'trainingGroups.schedules'
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
            'amount' => 'required|numeric|min:1',
            'payout_date' => 'required|date',
            'payment_type' => 'required|string|in:Monthly Salary,Hourly Rate,Per Session,Commission,Bonus,Per Athlete,Fixed Amount',
            'notes' => 'nullable|string',
        ]);

        CoachPayout::create([
            ...$validated,
            'club_id' => $request->user()->club_id,
            'status' => 'paid',
        ]);

        return back()->with('status', 'payout-recorded');
    }
}
