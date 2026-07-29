<?php

namespace App\Http\Controllers;

use App\Models\EventCategory;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointsSystemController extends Controller
{
    public function edit(Request $request)
    {
        $club = $request->user()->club;
        abort_if(!$club, 404, 'Club not found.');

        $categories = $club->eventCategories()->orderBy('name')->get();
        
        $settings = [
            'regular_training_points' => $club->settings['regular_training_points'] ?? 5,
            'points_reset_date'       => $club->settings['points_reset_date'] ?? null,
            'points_period_start'     => $club->settings['points_period_start'] ?? null,
        ];

        return Inertia::render('Manager/Points/Setup', [
            'categories' => $categories,
            'settings'   => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $club = $request->user()->club;
        abort_if(!$club, 404, 'Club not found.');

        $validated = $request->validate([
            'regular_training_points' => 'required|integer|min:0',
            'points_reset_date'       => 'nullable|date',
        ]);

        $settings = $club->settings ?? [];
        $settings['regular_training_points'] = $validated['regular_training_points'];
        $settings['points_reset_date']       = $validated['points_reset_date'];

        $club->update(['settings' => $settings]);

        return back()->with('success', 'Points settings updated successfully.');
    }

    public function resetPoints(Request $request)
    {
        $club = $request->user()->club;
        abort_if(!$club, 404, 'Club not found.');

        $club->resetPointsSystem(now()->toDateString());

        return back()->with('success', 'All athlete points have been reset to 0, and legacy points have been archived.');
    }

    public function storeCategory(Request $request)
    {
        $club = $request->user()->club;
        abort_if(!$club, 404, 'Club not found.');

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'points' => 'required|integer|min:0',
        ]);

        $club->eventCategories()->create([
            'name'   => $validated['name'],
            'points' => $validated['points'],
        ]);

        return back()->with('success', 'Event category created successfully.');
    }

    public function updateCategory(Request $request, EventCategory $category)
    {
        $club = $request->user()->club;
        abort_if($category->club_id !== $club->id, 403);

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'points' => 'required|integer|min:0',
        ]);

        $category->update([
            'name'   => $validated['name'],
            'points' => $validated['points'],
        ]);

        // Dynamically update points of all events associated with this category
        // and sync all affected athlete profiles to propagate points change.
        foreach ($category->events as $event) {
            $event->update(['points' => $validated['points']]);
            foreach ($event->registrations as $reg) {
                \App\Models\TrainingAttendance::syncProfilePoints($reg->user_id);
            }
        }

        return back()->with('success', 'Event category updated successfully.');
    }

    public function destroyCategory(Request $request, EventCategory $category)
    {
        $club = $request->user()->club;
        abort_if($category->club_id !== $club->id, 403);

        $category->delete();

        return back()->with('success', 'Event category deleted successfully.');
    }
}
