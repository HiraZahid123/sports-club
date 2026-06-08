<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ClubInvitation;
use App\Models\CoachProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisterCoachController extends Controller
{
    public function create(string $token): Response|RedirectResponse
    {
        $invitation = ClubInvitation::with('club')
            ->where('token', $token)
            ->first();

        if (!$invitation || !$invitation->isValid()) {
            return redirect()->route('register')->with('error', 'This invitation link is invalid or has expired. Please contact the club manager.');
        }

        return Inertia::render('Auth/RegisterCoach', [
            'token'      => $token,
            'club'       => ['id' => $invitation->club->id, 'name' => $invitation->club->name],
            'email'      => $invitation->email,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $invitation = ClubInvitation::with('club')
            ->where('token', $token)
            ->first();

        if (!$invitation || !$invitation->isValid()) {
            return redirect()->route('register')->with('error', 'This invitation link is invalid or has expired.');
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'club_id'  => $invitation->club_id,
        ]);

        $user->assignRole('Coach');
        CoachProfile::create(['user_id' => $user->id]);

        $invitation->update(['status' => 'accepted']);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('coach.dashboard');
    }
}
