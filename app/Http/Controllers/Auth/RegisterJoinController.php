<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AthleteProfile;
use App\Models\Club;
use App\Models\ParentProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Services\StripeService;

class RegisterJoinController extends Controller
{
    public function create(Request $request): Response
    {
        $club = null;
        if ($request->filled('code')) {
            $club = Club::where('join_code', strtoupper($request->code))->where('is_active', true)->first();
        }

        return Inertia::render('Auth/RegisterJoin', [
            'club'     => $club ? ['id' => $club->id, 'name' => $club->name, 'join_code' => $club->join_code] : null,
            'prefill_code' => $request->input('code', ''),
        ]);
    }

    public function store(Request $request, StripeService $stripeService)
    {
        $rules = [
            'join_code'   => 'required|string',
            'role'        => 'required|in:Athlete,Parent',
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password'    => ['required', 'confirmed', Rules\Password::defaults()],
            'child_email' => 'nullable|email|exists:users,email',
        ];

        if ($request->role === 'Athlete') {
            $rules['training_group_id'] = 'required|exists:training_groups,id';
            $rules['subscription_plan_id'] = 'required|exists:subscription_plans,id';
            $rules['billing_cycle'] = 'required|in:monthly,yearly';
        }

        $request->validate($rules);

        $club = Club::where('join_code', strtoupper($request->join_code))->where('is_active', true)->first();

        if (!$club) {
            return back()->withErrors(['join_code' => 'Invalid or inactive club code. Please check and try again.'])->withInput();
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'club_id'  => $club->id,
        ]);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        Role::firstOrCreate(['name' => $request->role, 'guard_name' => 'web']);
        $user->assignRole($request->role);

        if ($request->role === 'Athlete') {
            $plan = SubscriptionPlan::findOrFail($request->subscription_plan_id);
            $amount = $request->billing_cycle === 'yearly' ? $plan->yearly_price : $plan->monthly_price;
            $startsAt = now();
            $endsAt = $request->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth();

            $subscription = Subscription::create([
                'user_id'              => $user->id,
                'club_id'              => $club->id,
                'training_group_id'    => $request->training_group_id,
                'subscription_plan_id' => $plan->id,
                'plan_name'            => $plan->name,
                'amount'               => $amount,
                'billing_cycle'        => $request->billing_cycle,
                'status'               => 'unpaid',
                'starts_at'            => $startsAt,
                'ends_at'              => $endsAt,
                'next_payment_at'      => $startsAt,
            ]);

            try {
                $successUrl = route('register.payment.success') . '?session_id={CHECKOUT_SESSION_ID}';
                $checkoutSession = $stripeService->createCheckoutSession($subscription, $successUrl);
                return Inertia::location($checkoutSession->url);
            } catch (\Exception $e) {
                return back()->withErrors(['subscription_plan_id' => 'Stripe failed: ' . $e->getMessage()]);
            }
        } elseif ($request->role === 'Parent') {
            ParentProfile::create(['user_id' => $user->id]);

            if ($request->filled('child_email')) {
                $child = User::where('email', $request->child_email)
                    ->where('club_id', $club->id)
                    ->whereHas('roles', fn($q) => $q->where('name', 'Athlete'))
                    ->first();

                if ($child) {
                    $user->children()->syncWithoutDetaching([
                        $child->id => ['relationship' => 'parent'],
                    ]);
                }
            }

            event(new Registered($user));
            Auth::login($user);

            return redirect()->route('parent.dashboard');
        }
    }

    public function registerPaymentSuccess(Request $request, StripeService $stripeService)
    {
        $sessionId = $request->query('session_id');
        if (!$sessionId) {
            return redirect()->route('login')->with('error', 'Missing checkout session ID.');
        }

        try {
            $session = $stripeService->retrieveCheckoutSession($sessionId);
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Failed to retrieve checkout session.');
        }

        if ($session->payment_status !== 'paid') {
            return redirect()->route('login')->with('error', 'Payment not completed.');
        }

        $subscriptionId = $session->metadata->subscription_id ?? null;
        if (!$subscriptionId) {
            return redirect()->route('login')->with('error', 'Invalid payment metadata.');
        }

        $subscription = Subscription::find($subscriptionId);
        if (!$subscription) {
            return redirect()->route('login')->with('error', 'Subscription not found.');
        }

        $user = User::find($subscription->user_id);
        if (!$user) {
            return redirect()->route('login')->with('error', 'User not found.');
        }

        if ($subscription->status !== 'active') {
            \Illuminate\Support\Facades\DB::transaction(function () use ($subscription, $user, $sessionId) {
                \App\Models\Payment::create([
                    'subscription_id' => $subscription->id,
                    'amount'          => $subscription->amount,
                    'payment_date'    => now(),
                    'payment_method'  => 'stripe',
                    'status'          => 'completed',
                    'transaction_id'  => $sessionId,
                    'notes'           => 'Stripe Checkout completed during registration for ' . $user->name,
                ]);

                $subscription->update([
                    'status'          => 'active',
                    'last_payment_at' => now(),
                    'next_payment_at' => now()->addMonth(),
                ]);

                AthleteProfile::firstOrCreate(['user_id' => $user->id]);

                if ($subscription->training_group_id) {
                    $user->trainingGroups()->syncWithoutDetaching([
                        $subscription->training_group_id => ['role_in_group' => 'Athlete']
                    ]);
                }
            });
        }

        Auth::login($user);

        return redirect()->route('athlete.dashboard')->with('success', 'Subscription activated and registration complete!');
    }
}
