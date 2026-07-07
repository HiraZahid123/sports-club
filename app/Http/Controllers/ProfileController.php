<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $mySubscriptions = [];
        $availablePlans = [];

        if ($user->hasRole('Athlete')) {
            $mySubscriptions = \App\Models\Subscription::where('user_id', $user->id)
                ->with(['payments' => function ($q) {
                    $q->latest();
                }, 'trainingGroup', 'plan'])
                ->latest()
                ->get();

            $subscribedGroupIds = \App\Models\Subscription::where('user_id', $user->id)
                ->whereIn('status', ['active', 'unpaid', 'overdue'])
                ->pluck('training_group_id')
                ->toArray();

            $availablePlans = \App\Models\SubscriptionPlan::where('club_id', $user->club_id)
                ->where('is_active', true)
                ->whereNotIn('training_group_id', $subscribedGroupIds)
                ->with('trainingGroup')
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'mySubscriptions' => $mySubscriptions,
            'availablePlans' => $availablePlans,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($user->hasRole('Athlete')) {
            $user->athleteProfile()->updateOrCreate(
                ['user_id' => $user->id],
                ['date_of_birth' => $request->input('date_of_birth')]
            );
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Upload the user's profile photo.
     */
    public function uploadPhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
        ]);

        $user = $request->user();

        if ($user->profile_photo) {
            $old = public_path(ltrim($user->profile_photo, '/'));
            if (File::exists($old)) {
                File::delete($old);
            }
        }

        $file      = $request->file('photo');
        $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $directory = public_path('uploads/profile-photos');

        File::ensureDirectoryExists($directory);
        $file->move($directory, $filename);

        $user->update(['profile_photo' => '/uploads/profile-photos/' . $filename]);

        return Redirect::route('profile.edit')->with('status', 'photo-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
