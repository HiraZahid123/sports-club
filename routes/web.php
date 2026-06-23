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

    return response()->json(['club' => ['id' => $club->id, 'name' => $club->name, 'join_code' => $club->join_code]]);
});

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
        $stats = [
            'totalMembers' => \App\Models\User::where('club_id', $clubId)->count(),
            'activeGroups' => \App\Models\TrainingGroup::where('club_id', $clubId)->count(),
            'monthlyRevenue' => \App\Models\Payment::whereHas('subscription', function($q) use ($clubId) {
                $q->where('club_id', $clubId);
            })->whereMonth('payment_date', now()->month)->sum('amount'),
            'overdueCount' => \App\Models\Subscription::where('club_id', $clubId)->where('status', 'overdue')->count(),
        ];
        return Inertia::render('Manager/Dashboard', ['stats' => $stats]);
    })->name('dashboard');

    Route::get('/club', [\App\Http\Controllers\ClubController::class, 'edit'])->name('club.edit');
    Route::patch('/club', [\App\Http\Controllers\ClubController::class, 'update'])->name('club.update');
    Route::post('/club/logo', [\App\Http\Controllers\ClubController::class, 'uploadLogo'])->name('club.logo');

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

    Route::get('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'store'])->name('groups.store');
    Route::put('/groups/{group}', [\App\Http\Controllers\TrainingGroupController::class, 'update'])->name('groups.update');
    Route::post('/groups/{group}/assign', [\App\Http\Controllers\TrainingGroupController::class, 'assignUser'])->name('groups.assign');
    Route::post('/groups/{group}/remove', [\App\Http\Controllers\TrainingGroupController::class, 'removeUser'])->name('groups.remove');
    Route::post('/groups/{group}/schedule', [\App\Http\Controllers\TrainingGroupController::class, 'updateSchedule'])->name('groups.schedule');

    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/{subscription}/pay', [\App\Http\Controllers\BillingController::class, 'logPayment'])->name('billing.pay');

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
});

// Coach Routes
Route::middleware(['auth', 'verified', 'role:Coach', \App\Http\Middleware\CheckSubscription::class])->prefix('coach')->name('coach.')->group(function () {
    Route::get('/dashboard', function () {
        $coach  = auth()->user();
        $groups = $coach->trainingGroups()->with(['athletes.athleteProfile'])->get();

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

        return Inertia::render('Coach/Dashboard', [
            'groups'        => $groups,
            'nextPayout'    => $nextPayout,
            'payoutHistory' => $payoutHistory,
            'totalEarned'   => $totalEarned,
            'coachProfile'  => $coach->coachProfile,
        ]);
    })->name('dashboard');

    Route::get('/schedule', function () {
        return Inertia::render('Coach/Schedule');
    })->name('schedule');

    Route::post('/goals', [\App\Http\Controllers\GoalController::class, 'store'])->name('goals.store');
    Route::put('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'update'])->name('goals.update');
    Route::delete('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'destroy'])->name('goals.destroy');
    Route::post('/athletes/{user}/skills', [\App\Http\Controllers\GoalController::class, 'updateSkills'])->name('athletes.skills');
    Route::post('/athletes/{user}/tip', [\App\Http\Controllers\GoalController::class, 'saveTip'])->name('athletes.tip');

    Route::get('/events', [\App\Http\Controllers\EventController::class, 'coachIndex'])->name('events.index');
    Route::post('/events/{event}/registrations/{registration}/accept', [\App\Http\Controllers\EventController::class, 'acceptAttendance'])->name('events.attendance.accept');
    Route::post('/events/{event}/registrations/{registration}/reject', [\App\Http\Controllers\EventController::class, 'rejectAttendance'])->name('events.attendance.reject');
});

// Athlete Routes
Route::middleware(['auth', 'verified', 'role:Athlete', \App\Http\Middleware\CheckSubscription::class])->prefix('athlete')->name('athlete.')->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $profile = $user->athleteProfile;
        return Inertia::render('Athlete/Dashboard', [
            'athleteProfile' => $profile,
        ]);
    })->name('dashboard');

    Route::get('/schedule', function () {
        return Inertia::render('Athlete/Schedule');
    })->name('schedule');

    Route::get('/events', [\App\Http\Controllers\EventController::class, 'athleteIndex'])->name('events.index');
    Route::post('/events/{event}/join', [\App\Http\Controllers\EventController::class, 'join'])->name('events.join');
});

// Parent Routes
Route::middleware(['auth', 'verified', 'role:Parent'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Parent/Dashboard');
    })->middleware(\App\Http\Middleware\CheckSubscription::class)->name('dashboard');

    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'parentBilling'])->name('billing');
    Route::post('/billing/{subscription}/checkout', [\App\Http\Controllers\BillingController::class, 'createCheckoutSession'])->name('billing.checkout');
    Route::get('/billing/success', [\App\Http\Controllers\BillingController::class, 'paymentSuccess'])->name('billing.success');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto'])->name('profile.photo');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
