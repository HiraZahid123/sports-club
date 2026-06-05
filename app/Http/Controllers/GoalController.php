<?php

namespace App\Http\Controllers;

use App\Models\TrainingGoal;
use App\Models\User;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'athlete_id'  => 'required|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category'    => 'required|string|in:General,Technique,Fitness,Strength,Mental,Competition',
            'status'      => 'required|string|in:not_started,in_progress,completed',
            'target_date' => 'nullable|date',
        ]);

        // Ensure the athlete is in one of the coach's groups
        $coach = $request->user();
        $athleteInCoachGroup = $coach->trainingGroups()
            ->whereHas('athletes', fn($q) => $q->where('users.id', $validated['athlete_id']))
            ->exists();

        abort_if(!$athleteInCoachGroup, 403, 'Athlete is not in your group.');

        TrainingGoal::create([
            ...$validated,
            'coach_id' => $coach->id,
        ]);

        return back()->with('status', 'goal-created');
    }

    public function update(Request $request, TrainingGoal $goal)
    {
        abort_if($goal->coach_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category'    => 'required|string|in:General,Technique,Fitness,Strength,Mental,Competition',
            'status'      => 'required|string|in:not_started,in_progress,completed',
            'target_date' => 'nullable|date',
        ]);

        $goal->update($validated);

        return back()->with('status', 'goal-updated');
    }

    public function destroy(Request $request, TrainingGoal $goal)
    {
        abort_if($goal->coach_id !== $request->user()->id, 403);

        $goal->delete();

        return back()->with('status', 'goal-deleted');
    }

    public function updateSkills(Request $request, User $user)
    {
        $validated = $request->validate([
            'speed'       => 'required|integer|min:0|max:100',
            'strength'    => 'required|integer|min:0|max:100',
            'flexibility' => 'required|integer|min:0|max:100',
        ]);

        // Ensure coach has access to this athlete
        $coach = $request->user();
        $athleteInCoachGroup = $coach->trainingGroups()
            ->whereHas('athletes', fn($q) => $q->where('users.id', $user->id))
            ->exists();

        abort_if(!$athleteInCoachGroup, 403, 'Athlete is not in your group.');

        $user->athleteProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'speed'       => $validated['speed'],
                'strength'    => $validated['strength'],
                'flexibility' => $validated['flexibility'],
            ]
        );

        return back()->with('status', 'skills-updated');
    }
}
