<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClubController extends Controller
{
    public function edit(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            return Inertia::render('Manager/Club/Setup');
        }

        return Inertia::render('Manager/Club/Edit', [
            'club' => $club,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            $validated = $request->validate([
                'name'        => 'required|string|max:255',
                'email'       => 'required|email|max:255',
                'phone'       => 'nullable|string|max:20',
                'address'     => 'nullable|string|max:500',
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
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|max:255',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
        ]);

        $club->update($validated);

        return redirect()->route('manager.club.edit')->with('status', 'club-updated');
    }

    public function uploadLogo(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            abort(404);
        }

        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
        ]);

        if ($club->logo_path) {
            Storage::disk('public')->delete($club->logo_path);
        }

        $path = $request->file('logo')->store('club-logos', 'public');
        $club->update(['logo_path' => $path]);

        return redirect()->route('manager.club.edit')->with('status', 'logo-updated');
    }
}
