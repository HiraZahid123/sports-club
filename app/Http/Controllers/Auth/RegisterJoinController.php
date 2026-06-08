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

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'join_code'   => 'required|string',
            'role'        => 'required|in:Athlete,Parent',
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password'    => ['required', 'confirmed', Rules\Password::defaults()],
            'child_email' => 'nullable|email|exists:users,email',
        ]);

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

        $user->assignRole($request->role);

        if ($request->role === 'Athlete') {
            AthleteProfile::create(['user_id' => $user->id]);
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
        }

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route($request->role === 'Parent' ? 'parent.dashboard' : 'athlete.dashboard');
    }
}
