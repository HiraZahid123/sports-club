<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

Route::get('/clear-cache', function () {
    Artisan::call('view:clear');
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('cache:clear');
    return 'All Laravel caches cleared successfully!';
});

// Public API: validate a club joining code
Route::get('/api/clubs/validate-code', function (\Illuminate\Http\Request $request) {
    $club = \App\Models\Club::where('join_code', strtoupper($request->input('code', '')))
        ->where('is_active', true)
        ->first();

    if (!$club) {
        return response()->json(['error' => 'Not found'], 404);
    }

    $groups = \App\Models\TrainingGroup::where('club_id', $club->id)->get(['id', 'name']);
    $plans = \App\Models\SubscriptionPlan::where('club_id', $club->id)
        ->where('is_active', true)
        ->get(['id', 'training_group_id', 'name', 'monthly_price', 'yearly_price', 'description']);

    return response()->json([
        'club' => ['id' => $club->id, 'name' => $club->name, 'join_code' => $club->join_code],
        'groups' => $groups,
        'plans' => $plans,
    ]);
});

Route::get('/register/success', [\App\Http\Controllers\Auth\RegisterJoinController::class, 'registerPaymentSuccess'])->name('register.payment.success');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Manager Routes
Route::middleware(['auth', 'verified', 'role:Manager|Super Admin'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('/dashboard', function () {
        $clubId = auth()->user()->club_id;

        // Transition active subscriptions to overdue if next_payment_at has passed
        \App\Models\Subscription::where('club_id', $clubId)
            ->where('status', 'active')
            ->whereNotNull('next_payment_at')
            ->where('next_payment_at', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        $monthlyRevenue = \App\Models\Payment::whereHas('subscription', function($q) use ($clubId) {
            $q->where('club_id', $clubId);
        })->whereMonth('payment_date', now()->month)->sum('amount');

        $monthlyPayouts = \App\Models\CoachPayout::where('club_id', $clubId)
            ->whereMonth('payout_date', now()->month)
            ->where('status', 'paid')
            ->sum('amount');

        $totalMembers = \App\Models\User::where('club_id', $clubId)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Athlete');
            })->count();
        $activeGroups = \App\Models\TrainingGroup::where('club_id', $clubId)->count();
        $monthlyNetRevenue = $monthlyRevenue - $monthlyPayouts;
        $overdueCount = \App\Models\Subscription::where('club_id', $clubId)->where('status', 'overdue')->count();

        // ── Month-over-month comparisons (for the dashboard trend badges) ──
        $startOfMonth = now()->startOfMonth();
        $startOfLastMonth = now()->copy()->subMonthNoOverflow()->startOfMonth();
        $endOfLastMonth = $startOfMonth->copy()->subSecond();

        $totalMembersLastMonth = \App\Models\User::where('club_id', $clubId)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Athlete');
            })->where('created_at', '<', $startOfMonth)->count();

        $activeGroupsLastMonth = \App\Models\TrainingGroup::where('club_id', $clubId)
            ->where('created_at', '<', $startOfMonth)->count();

        $lastMonthRevenue = \App\Models\Payment::whereHas('subscription', function($q) use ($clubId) {
            $q->where('club_id', $clubId);
        })->whereBetween('payment_date', [$startOfLastMonth, $endOfLastMonth])->sum('amount');

        $lastMonthPayouts = \App\Models\CoachPayout::where('club_id', $clubId)
            ->whereBetween('payout_date', [$startOfLastMonth, $endOfLastMonth])
            ->where('status', 'paid')
            ->sum('amount');

        $lastMonthNetRevenue = $lastMonthRevenue - $lastMonthPayouts;

        // Overdue subscriptions already flagged before this month began ("carried over")
        $overdueCarriedOver = \App\Models\Subscription::where('club_id', $clubId)
            ->where('status', 'overdue')
            ->where('updated_at', '<', $startOfMonth)
            ->count();

        $pctChange = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }
            return (int) round((($current - $previous) / abs($previous)) * 100);
        };

        $stats = [
            'totalMembers' => $totalMembers,
            'activeGroups' => $activeGroups,
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyPayouts' => $monthlyPayouts,
            'monthlyNetRevenue' => $monthlyNetRevenue,
            'overdueCount' => $overdueCount,
            'totalMembersChange' => $pctChange($totalMembers, $totalMembersLastMonth),
            'activeGroupsChange' => $activeGroups - $activeGroupsLastMonth,
            'monthlyNetRevenueChange' => $pctChange($monthlyNetRevenue, $lastMonthNetRevenue),
            'overdueChange' => $overdueCount - $overdueCarriedOver,
        ];

        // Dynamic recent activity
        $recentUsers = \App\Models\User::where('club_id', $clubId)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'initial' => strtoupper(substr($user->name, 0, 1)),
                    'name' => $user->name,
                    'profile_photo' => $user->profile_photo,
                    'action' => 'joined the club',
                    'time' => $user->created_at ? $user->created_at->diffForHumans() : 'some time ago',
                    'timestamp' => $user->created_at ? $user->created_at->timestamp : 0,
                    'color' => 'bg-blue-100 text-blue-700',
                ];
            });

        $recentPayments = \App\Models\Payment::whereHas('subscription', function($q) use ($clubId) {
                $q->where('club_id', $clubId);
            })
            ->with('subscription.user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                $userName = $payment->subscription->user->name ?? 'Unknown Athlete';
                return [
                    'initial' => strtoupper(substr($userName, 0, 1)),
                    'name' => $userName,
                    'profile_photo' => $payment->subscription->user->profile_photo ?? null,
                    'action' => "payment recorded — €{$payment->amount}",
                    'time' => $payment->created_at ? $payment->created_at->diffForHumans() : 'some time ago',
                    'timestamp' => $payment->created_at ? $payment->created_at->timestamp : 0,
                    'color' => 'bg-emerald-100 text-emerald-700',
                ];
            });

        $recentEventRegistrations = \App\Models\EventRegistration::whereHas('event', function($q) use ($clubId) {
                $q->where('club_id', $clubId);
            })
            ->with(['user', 'event'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($reg) {
                $userName = $reg->user->name ?? 'Unknown Athlete';
                $eventName = $reg->event->name ?? 'Event';
                $statusStr = $reg->status === 'attended' ? 'attended' : ($reg->status === 'registered' ? 'registered for' : 'applied for');
                return [
                    'initial' => strtoupper(substr($userName, 0, 1)),
                    'name' => $userName,
                    'profile_photo' => $reg->user->profile_photo ?? null,
                    'action' => "{$statusStr} {$eventName}",
                    'time' => $reg->created_at ? $reg->created_at->diffForHumans() : 'some time ago',
                    'timestamp' => $reg->created_at ? $reg->created_at->timestamp : 0,
                    'color' => 'bg-indigo-100 text-indigo-700',
                ];
            });

        $recentActivity = collect()
            ->concat($recentUsers)
            ->concat($recentPayments)
            ->concat($recentEventRegistrations)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->toArray();

        $leaderboard = \App\Models\User::role('Athlete')
            ->where('club_id', $clubId)
            ->with('athleteProfile')
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'profile_photo' => $u->profile_photo,
                    'points' => $u->athleteProfile ? ($u->athleteProfile->event_points ?? 0) : 0,
                    'belt_rank' => $u->athleteProfile ? ($u->athleteProfile->belt_rank ?? '10. WHITE') : '10. WHITE',
                ];
            })
            ->sortByDesc('points')
            ->take(10)
            ->values()
            ->toArray();

        return Inertia::render('Manager/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'leaderboard' => $leaderboard,
        ]);
    })->name('dashboard');

    Route::get('/club', [\App\Http\Controllers\ClubController::class, 'edit'])->name('club.edit');
    Route::patch('/club', [\App\Http\Controllers\ClubController::class, 'update'])->name('club.update');
    Route::post('/club/logo', [\App\Http\Controllers\ClubController::class, 'uploadLogo'])->name('club.logo');
    Route::post('/club/join-code', [\App\Http\Controllers\ClubController::class, 'updateJoinCode'])->name('club.join-code');
    Route::post('/club/join-code/regenerate', [\App\Http\Controllers\ClubController::class, 'regenerateJoinCode'])->name('club.join-code.regenerate');

    Route::get('/setup', [\App\Http\Controllers\ClubController::class, 'setupIndex'])->name('setup.index');

    Route::post('/age-categories', [\App\Http\Controllers\AgeCategoryController::class, 'store'])->name('age-categories.store');
    Route::put('/age-categories/{ageCategory}', [\App\Http\Controllers\AgeCategoryController::class, 'update'])->name('age-categories.update');
    Route::delete('/age-categories/{ageCategory}', [\App\Http\Controllers\AgeCategoryController::class, 'destroy'])->name('age-categories.destroy');

    Route::post('/facilities', [\App\Http\Controllers\FacilityController::class, 'store'])->name('facilities.store');
    Route::put('/facilities/{facility}', [\App\Http\Controllers\FacilityController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [\App\Http\Controllers\FacilityController::class, 'destroy'])->name('facilities.destroy');

    Route::get('/coaches', [\App\Http\Controllers\CoachController::class, 'index'])->name('coaches.index');
    Route::put('/coaches/{user}', [\App\Http\Controllers\CoachController::class, 'update'])->name('coaches.update');

    Route::get('/members', [\App\Http\Controllers\MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [\App\Http\Controllers\MemberController::class, 'store'])->name('members.store');
    Route::put('/members/{user}', [\App\Http\Controllers\MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{user}', [\App\Http\Controllers\MemberController::class, 'destroy'])->name('members.destroy');
    Route::post('/users/{user}/toggle-active', [\App\Http\Controllers\MemberController::class, 'toggleActive'])->name('users.toggle-active');

    Route::get('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'store'])->name('groups.store');
    Route::put('/groups/{group}', [\App\Http\Controllers\TrainingGroupController::class, 'update'])->name('groups.update');
    Route::post('/groups/{group}/assign', [\App\Http\Controllers\TrainingGroupController::class, 'assignUser'])->name('groups.assign');
    Route::post('/groups/{group}/remove', [\App\Http\Controllers\TrainingGroupController::class, 'removeUser'])->name('groups.remove');
    Route::post('/groups/{group}/schedule', [\App\Http\Controllers\TrainingGroupController::class, 'updateSchedule'])->name('groups.schedule');

    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/subscriptions', [\App\Http\Controllers\BillingController::class, 'storeSubscription'])->name('billing.subscriptions.store');
    Route::delete('/billing/subscriptions/{subscription}', [\App\Http\Controllers\BillingController::class, 'destroySubscription'])->name('billing.subscriptions.destroy');
    Route::post('/billing/{subscription}/pay', [\App\Http\Controllers\BillingController::class, 'logPayment'])->name('billing.pay');

    Route::post('/plans', [\App\Http\Controllers\SubscriptionPlanController::class, 'store'])->name('plans.store');
    Route::put('/plans/{plan}', [\App\Http\Controllers\SubscriptionPlanController::class, 'update'])->name('plans.update');
    Route::delete('/plans/{plan}', [\App\Http\Controllers\SubscriptionPlanController::class, 'destroy'])->name('plans.destroy');

    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::post('/payouts', [\App\Http\Controllers\ReportController::class, 'storePayout'])->name('payouts.store');
    Route::post('/coaches/{user}/payment-settings', [\App\Http\Controllers\ReportController::class, 'updatePaymentSettings'])->name('coaches.payment-settings');

    Route::get('/invitations', [\App\Http\Controllers\InvitationController::class, 'index'])->name('invitations.index');
    Route::post('/invitations/coach', [\App\Http\Controllers\InvitationController::class, 'storeCoach'])->name('invitations.coach');
    Route::delete('/invitations/{invitation}', [\App\Http\Controllers\InvitationController::class, 'destroy'])->name('invitations.destroy');

    Route::get('/events', [\App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::post('/events', [\App\Http\Controllers\EventController::class, 'store'])->name('events.store');
    Route::post('/events/{event}', [\App\Http\Controllers\EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [\App\Http\Controllers\EventController::class, 'destroy'])->name('events.destroy');

    Route::get('/attendance', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance', [\App\Http\Controllers\AttendanceController::class, 'save'])->name('attendance.save');
    Route::get('/attendance/load', [\App\Http\Controllers\AttendanceController::class, 'loadAttendance'])->name('attendance.load');

    Route::get('/points', [\App\Http\Controllers\PointsSystemController::class, 'edit'])->name('points.setup');
    Route::post('/points/settings', [\App\Http\Controllers\PointsSystemController::class, 'updateSettings'])->name('points.settings');
    Route::post('/points/reset', [\App\Http\Controllers\PointsSystemController::class, 'resetPoints'])->name('points.reset');
    Route::post('/points/categories', [\App\Http\Controllers\PointsSystemController::class, 'storeCategory'])->name('points.categories.store');
    Route::put('/points/categories/{category}', [\App\Http\Controllers\PointsSystemController::class, 'updateCategory'])->name('points.categories.update');
    Route::delete('/points/categories/{category}', [\App\Http\Controllers\PointsSystemController::class, 'destroyCategory'])->name('points.categories.destroy');
});


// Coach Routes
Route::middleware(['auth', 'verified', 'role:Coach', \App\Http\Middleware\CheckSubscription::class])->prefix('coach')->name('coach.')->group(function () {
    Route::get('/dashboard', function () {
        $coach  = auth()->user();
        $groups = $coach->trainingGroups()->with(['athletes.athleteProfile', 'schedules.facility'])->get();

        $nextPayout = \App\Models\CoachPayout::where('user_id', $coach->id)
            ->where('status', 'pending')
            ->orderBy('payout_date')
            ->first();

        $payoutHistory = \App\Models\CoachPayout::where('user_id', $coach->id)
            ->where('status', 'paid')
            ->orderBy('payout_date', 'desc')
            ->limit(5)
            ->get();

        $totalEarned = \App\Models\CoachPayout::where('user_id', $coach->id)
            ->where('status', 'paid')
            ->sum('amount');

        $leaderboard = \App\Models\User::role('Athlete')
            ->where('club_id', $coach->club_id)
            ->with('athleteProfile')
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'profile_photo' => $u->profile_photo,
                    'points' => $u->athleteProfile ? ($u->athleteProfile->event_points ?? 0) : 0,
                    'belt_rank' => $u->athleteProfile ? ($u->athleteProfile->belt_rank ?? '10. WHITE') : '10. WHITE',
                ];
            })
            ->sortByDesc('points')
            ->take(10)
            ->values()
            ->toArray();

        return Inertia::render('Coach/Dashboard', [
            'groups'        => $groups,
            'nextPayout'    => $nextPayout,
            'payoutHistory' => $payoutHistory,
            'totalEarned'   => $totalEarned,
            'coachProfile'  => $coach->coachProfile,
            'leaderboard'   => $leaderboard,
        ]);
    })->name('dashboard');

    Route::get('/schedule', function () {
        $coach = auth()->user();
        $schedules = \App\Models\GroupSchedule::whereHas('group.users', function ($query) use ($coach) {
            $query->where('user_id', $coach->id)->where('role_in_group', 'Coach');
        })->with(['group', 'facility'])
          ->orderByRaw("FIELD(day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')")
          ->orderBy('start_time')
          ->get();

        return Inertia::render('Coach/Schedule', [
            'schedules' => $schedules,
        ]);
    })->name('schedule');

    Route::get('/my-team', function () {
        $coach = auth()->user();
        $groups = $coach->trainingGroups()->with(['athletes.athleteProfile', 'schedules.facility'])->get();

        return Inertia::render('Coach/MyTeam', [
            'groups' => $groups,
        ]);
    })->name('my-team');

    Route::post('/goals', [\App\Http\Controllers\GoalController::class, 'store'])->name('goals.store');
    Route::put('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'update'])->name('goals.update');
    Route::delete('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'destroy'])->name('goals.destroy');
    Route::post('/athletes/{user}/skills', [\App\Http\Controllers\GoalController::class, 'updateSkills'])->name('athletes.skills');
    Route::post('/athletes/{user}/tip', [\App\Http\Controllers\GoalController::class, 'saveTip'])->name('athletes.tip');
    Route::post('/athletes/{user}/adjust-points', [\App\Http\Controllers\GoalController::class, 'adjustPoints'])->name('athletes.adjust-points');

    Route::get('/events', [\App\Http\Controllers\EventController::class, 'coachIndex'])->name('events.index');
    Route::post('/events/{event}/registrations/{registration}/accept', [\App\Http\Controllers\EventController::class, 'acceptAttendance'])->name('events.attendance.accept');
    Route::post('/events/{event}/registrations/{registration}/reject', [\App\Http\Controllers\EventController::class, 'rejectAttendance'])->name('events.attendance.reject');

    Route::get('/attendance/load', [\App\Http\Controllers\AttendanceController::class, 'loadAttendance'])->name('attendance.load');
    Route::post('/attendance', [\App\Http\Controllers\AttendanceController::class, 'save'])->name('attendance.save');
});

// Athlete Routes
Route::middleware(['auth', 'verified', 'role:Athlete', \App\Http\Middleware\CheckSubscription::class])->prefix('athlete')->name('athlete.')->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $profile = $user->athleteProfile;

        // Count attended events
        $eventsCount = \App\Models\EventRegistration::where('user_id', $user->id)
            ->where('status', 'attended')
            ->count();

        // Classes are not tracked in DB yet, so they default to 0
        $classesCount = 0;
        $points = $profile ? ($profile->event_points ?? 0) : 0;

        // Fetch upcoming schedule slots
        $upcomingSchedulesMapped = \App\Models\GroupSchedule::whereHas('group.users', function ($query) use ($user) {
            $query->where('user_id', $user->id)->where('role_in_group', 'Athlete');
        })->with(['group.coaches', 'facility'])
          ->get()
          ->map(function ($s) {
              return [
                  'id' => $s->id,
                  'day_of_week' => $s->day_of_week,
                  'start_time' => $s->start_time,
                  'end_time' => $s->end_time,
                  'location' => $s->location,
                  'is_event' => false,
                  'group' => [
                      'name' => $s->group->name,
                      'coaches' => $s->group->coaches->map(fn($c) => ['name' => $c->name])->toArray(),
                  ],
                  'facility' => $s->facility ? [
                      'name' => $s->facility->name,
                  ] : null,
              ];
          });

        $upcomingEvents = \App\Models\EventRegistration::where('user_id', $user->id)
            ->whereIn('status', ['registered', 'pending_approval'])
            ->whereHas('event', function ($q) {
                $q->where('start_date', '>=', now()->startOfDay());
            })
            ->with(['event.coaches'])
            ->get();

        $eventSchedules = $upcomingEvents->map(function ($reg) {
            $event = $reg->event;
            if (!$event) return null;

            return [
                'id' => 'event-' . $event->id,
                'day_of_week' => \Carbon\Carbon::parse($event->start_date)->format('l'),
                'start_time' => '00:00:00',
                'end_time' => '23:59:59',
                'location' => $event->location,
                'is_event' => true,
                'group' => [
                    'name' => 'Event: ' . $event->name,
                    'coaches' => $event->coaches->map(fn($c) => ['name' => $c->name])->toArray(),
                ],
                'facility' => null,
            ];
        })->filter();

        $upcomingSchedules = $upcomingSchedulesMapped->concat($eventSchedules)->sortBy(function ($item) {
            $dayOrder = array_search($item['day_of_week'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            return $dayOrder * 100000 + (strtotime($item['start_time']) ?: 0);
        })->take(3)->values()->toArray();


        $allAthletesForRank = \App\Models\User::role('Athlete')
            ->where('club_id', $user->club_id)
            ->with('athleteProfile')
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'profile_photo' => $u->profile_photo,
                    'points' => $u->athleteProfile ? ($u->athleteProfile->event_points ?? 0) : 0,
                    'belt_rank' => $u->athleteProfile ? ($u->athleteProfile->belt_rank ?? '10. WHITE') : '10. WHITE',
                ];
            })
            ->sortByDesc('points')
            ->values();

        $leaderboard = $allAthletesForRank->take(10)->toArray();

        // Compute athlete's position (rank) in the club
        $myPosition = $allAthletesForRank->search(fn($a) => $a['id'] === $user->id);
        $myPosition = $myPosition !== false ? $myPosition + 1 : null;

        // Consolidate point history
        $trainingLogs = \App\Models\TrainingAttendance::where('athlete_id', $user->id)
            ->where('status', 'present')
            ->with('trainingGroup')
            ->latest('attendance_date')
            ->get()
            ->map(function ($att) {
                return [
                    'date' => $att->attendance_date->toDateString(),
                    'type' => 'training',
                    'description' => "Attended training with " . ($att->trainingGroup->name ?? 'Group'),
                    'points' => $att->base_points + $att->extra_points,
                ];
            });

        $eventLogs = \App\Models\EventRegistration::where('user_id', $user->id)
            ->where('status', 'attended')
            ->with('event')
            ->get()
            ->map(function ($reg) {
                $eventDate = $reg->attended_at ? $reg->attended_at->toDateString() : ($reg->event->start_date ? $reg->event->start_date->toDateString() : $reg->updated_at->toDateString());
                return [
                    'date' => $eventDate,
                    'type' => 'event',
                    'description' => "Attended event: " . ($reg->event->name ?? 'Event'),
                    'points' => $reg->event->points ?? 0,
                ];
            });

        $resetLogs = \App\Models\AthletePointHistory::where('athlete_id', $user->id)
            ->latest('period_end_date')
            ->get()
            ->map(function ($hist) {
                return [
                    'date' => $hist->period_end_date->toDateString(),
                    'type' => 'reset',
                    'description' => "Period points archived (Period: " . $hist->period_start_date->toDateString() . " to " . $hist->period_end_date->toDateString() . ")",
                    'points' => $hist->points,
                ];
            });

        $adjustmentLogs = \App\Models\ManualPointAdjustment::where('athlete_id', $user->id)
            ->with('adjustedBy')
            ->latest('date')
            ->get()
            ->map(function ($adj) {
                return [
                    'date'        => $adj->date instanceof \Carbon\Carbon ? $adj->date->toDateString() : (string) $adj->date,
                    'type'        => 'adjustment',
                    'description' => $adj->comment ?? ($adj->points >= 0 ? 'Point bonus awarded by coach' : 'Point deduction by coach'),
                    'points'      => $adj->points,
                ];
            });

        $pointHistory = collect()
            ->concat($trainingLogs)
            ->concat($eventLogs)
            ->concat($resetLogs)
            ->concat($adjustmentLogs)
            ->sortByDesc('date')
            ->values()
            ->toArray();

        $groupIds = $user->trainingGroups()->pluck('training_groups.id');
        $todayMonthDay = now()->format('m-d');
        $birthdays = \App\Models\User::role('Athlete')
            ->where('id', '!=', $user->id)
            ->whereHas('trainingGroups', function ($q) use ($groupIds) {
                $q->whereIn('training_groups.id', $groupIds);
            })
            ->with(['athleteProfile', 'trainingGroups'])
            ->get()
            ->filter(function ($member) use ($todayMonthDay) {
                $dob = $member->athleteProfile?->date_of_birth;
                if (!$dob) return false;
                try {
                    return \Carbon\Carbon::parse($dob)->format('m-d') === $todayMonthDay;
                } catch (\Exception $e) {
                    return false;
                }
            })
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'profile_photo' => $member->profile_photo,
                    'groups' => $member->trainingGroups->pluck('name')->toArray(),
                    'age' => $member->athleteProfile?->date_of_birth ? \Carbon\Carbon::parse($member->athleteProfile->date_of_birth)->age : null,
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('Athlete/Dashboard', [
            'athleteProfile' => $profile,
            'stats' => [
                'classes' => $classesCount,
                'events' => $eventsCount,
                'points' => $points,
            ],
            'upcomingSchedules' => $upcomingSchedules,
            'leaderboard' => $leaderboard,
            'pointHistory' => $pointHistory,
            'birthdays' => $birthdays,
            'myPosition' => $myPosition,
        ]);
    })->name('dashboard');

    Route::get('/schedule', function () {
        $athlete = auth()->user();
        $schedulesMapped = \App\Models\GroupSchedule::whereHas('group.users', function ($query) use ($athlete) {
            $query->where('user_id', $athlete->id)->where('role_in_group', 'Athlete');
        })->with(['group.coaches', 'facility'])
          ->get()
          ->map(function ($s) {
              return [
                  'id' => $s->id,
                  'day_of_week' => $s->day_of_week,
                  'start_time' => $s->start_time,
                  'end_time' => $s->end_time,
                  'location' => $s->location,
                  'notes' => $s->notes,
                  'is_event' => false,
                  'group' => [
                      'id' => $s->group->id,
                      'name' => $s->group->name,
                      'coaches' => $s->group->coaches->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->toArray(),
                  ],
                  'facility' => $s->facility ? [
                      'id' => $s->facility->id,
                      'name' => $s->facility->name,
                  ] : null,
              ];
          });

        $upcomingEvents = \App\Models\EventRegistration::where('user_id', $athlete->id)
            ->whereIn('status', ['registered', 'pending_approval'])
            ->whereHas('event', function ($q) {
                $q->where('start_date', '>=', now()->startOfDay());
            })
            ->with(['event.coaches'])
            ->get();

        $eventSchedules = $upcomingEvents->map(function ($reg) {
            $event = $reg->event;
            if (!$event) return null;

            return [
                'id' => 'event-' . $event->id,
                'day_of_week' => \Carbon\Carbon::parse($event->start_date)->format('l'),
                'start_time' => '00:00:00',
                'end_time' => '23:59:59',
                'location' => $event->location,
                'notes' => $event->description,
                'is_event' => true,
                'event_name' => $event->name,
                'group' => [
                    'id' => 0,
                    'name' => 'Event',
                    'coaches' => $event->coaches->map(fn($c) => ['id' => $c->id, 'name' => $c->name])->toArray(),
                ],
                'facility' => null,
            ];
        })->filter();

        $merged = $schedulesMapped->concat($eventSchedules)->sortBy(function ($item) {
            $dayOrder = array_search($item['day_of_week'], ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            return $dayOrder * 100000 + (strtotime($item['start_time']) ?: 0);
        })->values()->toArray();

        return Inertia::render('Athlete/Schedule', [
            'schedules' => $merged,
        ]);
    })->name('schedule');

    Route::get('/events', [\App\Http\Controllers\EventController::class, 'athleteIndex'])->name('events.index');
    Route::post('/events/{event}/join', [\App\Http\Controllers\EventController::class, 'join'])->name('events.join');
    Route::post('/checkout/{subscription}', [\App\Http\Controllers\BillingController::class, 'createCheckoutSession'])->name('checkout');
    Route::post('/profile/join-group', [\App\Http\Controllers\AthleteProfileController::class, 'joinGroup'])->name('profile.join-group');
    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'athleteBilling'])->name('billing');
    Route::get('/billing/success', [\App\Http\Controllers\BillingController::class, 'paymentSuccess'])->name('billing.success');
});

// Parent Routes
Route::middleware(['auth', 'verified', 'role:Parent'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('/dashboard', function () {
        $parent = auth()->user();
        $childrenIds = $parent->children()->pluck('athlete_id');
        $children = \App\Models\User::whereIn('id', $childrenIds)
            ->with(['athleteProfile', 'trainingGroups'])
            ->get();
        
        $subscriptions = \App\Models\Subscription::whereIn('user_id', $childrenIds)
            ->with(['user', 'payments'])
            ->get();
            
        $nextDueSub = $subscriptions->where('status', '!=', 'active')->sortBy('next_payment_at')->first() 
            ?? $subscriptions->sortBy('next_payment_at')->first();
            
        $nextPaymentDue = $nextDueSub ? ($nextDueSub->next_payment_at ? \Carbon\Carbon::parse($nextDueSub->next_payment_at)->format('M d, Y') : 'Check with Manager') : 'Check with Manager';
        $amountDue = $subscriptions->where('status', '!=', 'active')->sum('amount');
        if ($amountDue == 0 && $nextDueSub) {
            $amountDue = $nextDueSub->amount;
        }

        $childrenData = $children->map(function($child) {
            $group = $child->trainingGroups->first();
            $profile = $child->athleteProfile;
            
            // Count attended events (representing classes here)
            $classesCount = \App\Models\EventRegistration::where('user_id', $child->id)
                ->where('status', 'attended')
                ->count();

            return [
                'name' => $child->name,
                'profile_photo' => $child->profile_photo,
                'group' => $group ? $group->name : 'No Group',
                'status' => $child->isPaid() ? 'Active' : 'Overdue',
                'belt' => $profile ? ($profile->belt_rank ?? '10. WHITE') : '10. WHITE',
                'progress' => 50,
                'classes' => $classesCount,
            ];
        })->toArray();

        return Inertia::render('Parent/Dashboard', [
            'childrenData' => $childrenData,
            'billingSummary' => [
                'nextPaymentDue' => $nextPaymentDue,
                'amountDue' => $amountDue,
            ]
        ]);
    })->middleware(\App\Http\Middleware\CheckSubscription::class)->name('dashboard');

    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'parentBilling'])->name('billing');
    Route::post('/billing/{subscription}/checkout', [\App\Http\Controllers\BillingController::class, 'createCheckoutSession'])->name('billing.checkout');
    Route::get('/billing/success', [\App\Http\Controllers\BillingController::class, 'paymentSuccess'])->name('billing.success');
});

Route::middleware('auth')->group(function () {
    Route::get('/subscription/locked', [\App\Http\Controllers\BillingController::class, 'subscriptionLocked'])->name('subscription.locked');
    Route::get('/invoices/{payment}/download', [\App\Http\Controllers\InvoiceController::class, 'download'])->name('invoices.download');
    
    Route::get('/leaderboard', function() {
        $user = auth()->user();
        $leaderboard = \App\Models\User::role('Athlete')
            ->where('club_id', $user->club_id)
            ->with('athleteProfile')
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'profile_photo' => $u->profile_photo,
                    'points' => $u->athleteProfile ? ($u->athleteProfile->event_points ?? 0) : 0,
                    'belt_rank' => $u->athleteProfile ? ($u->athleteProfile->belt_rank ?? '10. WHITE') : '10. WHITE',
                ];
            })
            ->sortByDesc('points')
            ->values()
            ->toArray();

        return Inertia::render('Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    })->middleware(\App\Http\Middleware\CheckSubscription::class)->name('leaderboard');

    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [\App\Http\Controllers\MessageController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\MessageController::class, 'store'])->name('store');
        Route::delete('/{message}', [\App\Http\Controllers\MessageController::class, 'destroy'])->name('destroy');
        Route::post('/{message}/read', [\App\Http\Controllers\MessageController::class, 'markRead'])->name('read');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto'])->name('profile.photo');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
