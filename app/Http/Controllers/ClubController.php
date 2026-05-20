<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClubController extends Controller
{
    /**
     * Display the club settings page.
     */
    public function edit(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            // If manager doesn't have a club, they should probably create one or be assigned
            // For now, let's create a stub if it doesn't exist for the manager
            return Inertia::render('Manager/Club/Setup');
        }

        return Inertia::render('Manager/Club/Edit', [
            'club' => $club,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the club's information.
     */
    public function update(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            // Handle creation if it doesn't exist
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'description' => 'nullable|string|max:1000',
            ]);

            $club = Club::create([
                ...$validated,
                'slug' => Str::slug($validated['name']),
            ]);

            $request->user()->update(['club_id' => $club->id]);

            return redirect()->route('manager.club.edit')->with('status', 'club-created');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
        ]);

        $club->update($validated);

        return redirect()->route('manager.club.edit')->with('status', 'club-updated');
    }
}
