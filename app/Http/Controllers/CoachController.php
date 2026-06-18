<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoachController extends Controller
{
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;

        $coaches = User::role('Coach')
            ->where('club_id', $clubId)
            ->with([
                'coachProfile',
                'trainingGroups.athletes',
                'trainingGroups.schedules',
            ])
            ->get();

        return Inertia::render('Manager/Coaches/Index', [
            'coaches' => $coaches,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if ($user->club_id !== $request->user()->club_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone'          => 'nullable|string|max:30',
            'city'           => 'nullable|string|max:100',
            'payment_option' => 'required|string|in:athlete,hourly,manual',
            'payment_rate'   => 'required|numeric|min:0',
            'specialization' => 'nullable|string|max:255',
            'bio'            => 'nullable|string|max:1000',
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'city'  => $validated['city'] ?? null,
        ]);

        $user->coachProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'specialization' => $validated['specialization'] ?? null,
                'bio'            => $validated['bio'] ?? null,
                'payment_option' => $validated['payment_option'],
                'payment_rate'   => $validated['payment_rate'],
                'hourly_rate'    => $validated['payment_option'] === 'hourly'
                    ? $validated['payment_rate']
                    : ($user->coachProfile?->hourly_rate ?? 0),
            ]
        );

        return back()->with('status', 'coach-updated');
    }
}
