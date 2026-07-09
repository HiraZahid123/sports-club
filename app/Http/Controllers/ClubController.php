<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
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

        $clubData = $club->toArray();
        if ($club->logo_path) {
            $clubData['logo_path'] = asset($club->logo_path);
        }

        $facilities = \App\Models\Facility::where('club_id', $club->id)->orderBy('name')->get();

        return Inertia::render('Manager/Club/Edit', [
            'club'       => $clubData,
            'facilities' => $facilities,
            'join_link'  => $club->join_code
                ? url('/register/join?code=' . $club->join_code)
                : null,
            'status'     => session('status'),
        ]);
    }

    public function update(Request $request)
    {
        $club = $request->user()->club;

        if (!$club) {
            $validated = $request->validate([
                'name'          => 'required|string|max:255',
                'email'         => 'required|email|max:255',
                'phone'         => 'nullable|string|max:20',
                'address'       => 'nullable|string|max:500',
                'description'   => 'nullable|string|max:1000',
                'sport_type'    => 'nullable|string|max:255',
                'founding_date' => 'nullable|date',
                'opening_time'  => 'nullable|date_format:H:i',
                'closing_time'  => 'nullable|date_format:H:i',
            ]);

            $club = Club::create([
                ...$validated,
                'slug'      => Str::slug($validated['name']),
                'join_code' => $this->generateUniqueCode(),
            ]);

            $request->user()->update(['club_id' => $club->id]);

            return redirect()->route('manager.club.edit')->with('status', 'club-created');
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:500',
            'description'   => 'nullable|string|max:1000',
            'sport_type'    => 'nullable|string|max:255',
            'founding_date' => 'nullable|date',
            'opening_time'  => 'nullable|date_format:H:i',
            'closing_time'  => 'nullable|date_format:H:i',
        ]);

        $club->update($validated);

        return redirect()->route('manager.club.edit')->with('status', 'club-updated');
    }

    public function setupIndex(Request $request)
    {
        $clubId = $request->user()->club_id;

        return Inertia::render('Manager/Setup/Index', [
            'ageCategories' => \App\Models\AgeCategory::where('club_id', $clubId)->orderBy('min_age')->get(),
            'facilities'    => \App\Models\Facility::where('club_id', $clubId)->orderBy('name')->get(),
            'status'        => session('status'),
        ]);
    }

    public function updateJoinCode(Request $request)
    {
        $club = $request->user()->club;
        abort_unless($club, 404);

        $request->validate([
            'join_code' => [
                'required',
                'string',
                'min:4',
                'max:12',
                'alpha_num',
                \Illuminate\Validation\Rule::unique('clubs', 'join_code')->ignore($club->id),
            ],
        ]);

        $club->update(['join_code' => strtoupper($request->join_code)]);

        return back()->with('status', 'join-code-updated');
    }

    public function regenerateJoinCode(Request $request)
    {
        $club = $request->user()->club;
        abort_unless($club, 404);

        $club->update(['join_code' => $this->generateUniqueCode()]);

        return back()->with('status', 'join-code-updated');
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Club::where('join_code', $code)->exists());

        return $code;
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

        // Delete old file from public/uploads/club-logos/
        if ($club->logo_path) {
            $oldFile = public_path(ltrim($club->logo_path, '/'));
            if (File::exists($oldFile)) {
                File::delete($oldFile);
            }
        }

        $file      = $request->file('logo');
        $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $directory = public_path('uploads/club-logos');

        File::ensureDirectoryExists($directory);
        $file->move($directory, $filename);

        // Store as a relative public path: /uploads/club-logos/filename.ext
        $club->update(['logo_path' => '/uploads/club-logos/' . $filename]);

        return redirect()->route('manager.club.edit')->with('status', 'logo-updated');
    }
}
