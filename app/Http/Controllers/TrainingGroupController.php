<?php

namespace App\Http\Controllers;

use App\Models\TrainingGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainingGroupController extends Controller
{
    /**
     * Display a listing of the training groups.
     */
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;
        
        $groups = TrainingGroup::where('club_id', $clubId)
            ->with(['coaches', 'athletes'])
            ->withCount('athletes')
            ->get();

        $coaches = User::role('Coach')
            ->where('club_id', $clubId)
            ->get();

        $athletes = User::role('Athlete')
            ->where('club_id', $clubId)
            ->get();

        return Inertia::render('Manager/Groups/Index', [
            'groups' => $groups,
            'coaches' => $coaches,
            'athletes' => $athletes,
        ]);
    }

    /**
     * Store a newly created training group.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'skill_level' => 'nullable|string',
            'age_range' => 'nullable|string',
        ]);

        $group = TrainingGroup::create([
            ...$validated,
            'club_id' => $request->user()->club_id,
        ]);

        return redirect()->route('manager.groups.index')->with('status', 'group-created');
    }

    /**
     * Update the specified training group.
     */
    public function update(Request $request, TrainingGroup $group)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'skill_level' => 'nullable|string',
            'age_range' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('manager.groups.index')->with('status', 'group-updated');
    }

    /**
     * Assign a user to a training group.
     */
    public function assignUser(Request $request, TrainingGroup $group)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_in_group' => 'required|string|in:Athlete,Coach',
        ]);

        $group->users()->syncWithoutDetaching([
            $validated['user_id'] => ['role_in_group' => $validated['role_in_group']]
        ]);

        return redirect()->route('manager.groups.index')->with('status', 'user-assigned');
    }

    /**
     * Remove a user from a training group.
     */
    public function removeUser(Request $request, TrainingGroup $group)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $group->users()->detach($validated['user_id']);

        return redirect()->route('manager.groups.index')->with('status', 'user-removed');
    }
}
