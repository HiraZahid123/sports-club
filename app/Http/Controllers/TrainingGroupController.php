<?php

namespace App\Http\Controllers;

use App\Models\GroupSchedule;
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
            ->with(['coaches', 'athletes', 'schedules'])
            ->withCount('athletes')
            ->get();

        $coaches = User::role('Coach')
            ->where('club_id', $clubId)
            ->get();

        $athletes = User::role('Athlete')
            ->where('club_id', $clubId)
            ->get();

        return Inertia::render('Manager/Groups/Index', [
            'groups'   => $groups,
            'coaches'  => $coaches,
            'athletes' => $athletes,
        ]);
    }

    /**
     * Store a newly created training group.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'capacity'      => 'nullable|integer|min:1',
            'skill_level'   => 'nullable|string',
            'age_range'     => 'nullable|string',
        ]);

        TrainingGroup::create([
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
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'capacity'      => 'nullable|integer|min:1',
            'skill_level'   => 'nullable|string',
            'age_range'     => 'nullable|string',
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
            'user_id'      => 'required|exists:users,id',
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

    /**
     * Replace the schedule slots for a training group.
     * Accepts an array of { day_of_week, start_time, end_time, location, notes }.
     */
    public function updateSchedule(Request $request, TrainingGroup $group)
    {
        if ($request->has('schedules') && is_array($request->schedules)) {
            $schedules = $request->schedules;
            foreach ($schedules as $key => $slot) {
                if (isset($slot['start_time'])) {
                    $schedules[$key]['start_time'] = substr($slot['start_time'], 0, 5);
                }
                if (isset($slot['end_time'])) {
                    $schedules[$key]['end_time'] = substr($slot['end_time'], 0, 5);
                }
            }
            $request->merge(['schedules' => $schedules]);
        }

        $request->validate([
            'schedules'                 => 'present|array',
            'schedules.*.day_of_week'   => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'schedules.*.start_time'    => 'required|date_format:H:i',
            'schedules.*.end_time'      => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.location'      => 'nullable|string|max:255',
            'schedules.*.notes'         => 'nullable|string|max:500',
        ]);

        // Delete old slots and insert fresh ones atomically
        $group->schedules()->delete();

        foreach ($request->schedules as $slot) {
            $group->schedules()->create($slot);
        }

        return redirect()->route('manager.groups.index')->with('status', 'schedule-updated');
    }
}
