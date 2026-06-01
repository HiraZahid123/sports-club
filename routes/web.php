<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    Route::get('/members', [\App\Http\Controllers\MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [\App\Http\Controllers\MemberController::class, 'store'])->name('members.store');

    Route::get('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [\App\Http\Controllers\TrainingGroupController::class, 'store'])->name('groups.store');
    Route::put('/groups/{group}', [\App\Http\Controllers\TrainingGroupController::class, 'update'])->name('groups.update');
    Route::post('/groups/{group}/assign', [\App\Http\Controllers\TrainingGroupController::class, 'assignUser'])->name('groups.assign');

    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/{subscription}/pay', [\App\Http\Controllers\BillingController::class, 'logPayment'])->name('billing.pay');

    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::post('/payouts', [\App\Http\Controllers\ReportController::class, 'storePayout'])->name('payouts.store');
});

// Coach Routes
Route::middleware(['auth', 'verified', 'role:Coach', \App\Http\Middleware\CheckSubscription::class])->prefix('coach')->name('coach.')->group(function () {
    Route::get('/dashboard', function () {
        $groups = auth()->user()->trainingGroups()->with(['athletes.athleteProfile'])->get();
        return Inertia::render('Coach/Dashboard', [
            'groups' => $groups
        ]);
    })->name('dashboard');

    Route::get('/schedule', function () {
        return Inertia::render('Coach/Schedule');
    })->name('schedule');
});

// Athlete Routes
Route::middleware(['auth', 'verified', 'role:Athlete', \App\Http\Middleware\CheckSubscription::class])->prefix('athlete')->name('athlete.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Athlete/Dashboard');
    })->name('dashboard');

    Route::get('/schedule', function () {
        return Inertia::render('Athlete/Schedule');
    })->name('schedule');
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
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
