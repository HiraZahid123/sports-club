<?php

namespace App\Http\Controllers;

use App\Models\TrainingGroup;
use App\Models\TrainingAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Display the manager attendance management index.
     */
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;
        $groups = TrainingGroup::where('club_id', $clubId)->with('athletes')->orderBy('name')->get();

        $selectedGroupId = $request->input('group_id');
        $dateStr = $request->input('date', now()->toDateString());

        $attendanceData = [];
        if ($selectedGroupId) {
            $group = TrainingGroup::where('club_id', $clubId)->findOrFail($selectedGroupId);
            $existingAttendance = TrainingAttendance::where('training_group_id', $selectedGroupId)
                ->where('attendance_date', $dateStr)
                ->get()
                ->keyBy('athlete_id');

            $attendanceData = $group->athletes->map(function ($athlete) use ($existingAttendance) {
                $att = $existingAttendance->get($athlete->id);
                return [
                    'athlete_id'   => $athlete->id,
                    'name'         => $athlete->name,
                    'status'       => $att ? $att->status : 'absent',
                    'base_points'  => $att ? $att->base_points : 5,
                    'extra_points' => $att ? $att->extra_points : 0,
                ];
            });
        }

        return Inertia::render('Manager/Attendance/Index', [
            'groups'          => $groups,
            'selectedGroupId' => $selectedGroupId,
            'date'            => $dateStr,
            'attendanceData'  => $attendanceData,
        ]);
    }

    /**
     * Load attendance data via AJAX.
     */
    public function loadAttendance(Request $request)
    {
        $groupId = $request->query('group_id');
        $dateStr = $request->query('date', now()->toDateString());

        if (!$groupId) {
            return response()->json(['error' => 'group_id is required'], 400);
        }

        $user = $request->user();
        
        // Verify user has permission to load attendance for this group
        if ($user->hasRole('Coach')) {
            $hasGroup = $user->trainingGroups()->where('training_group_id', $groupId)->exists();
            if (!$hasGroup) {
                return response()->json(['error' => 'Unauthorized group access.'], 403);
            }
        } elseif (!$user->hasRole(['Manager', 'Super Admin'])) {
            return response()->json(['error' => 'Unauthorized role.'], 403);
        }

        $group = TrainingGroup::with('athletes')->findOrFail($groupId);
        $existing = TrainingAttendance::where('training_group_id', $groupId)
            ->where('attendance_date', $dateStr)
            ->get()
            ->keyBy('athlete_id');

        $data = $group->athletes->map(function ($athlete) use ($existing) {
            $att = $existing->get($athlete->id);
            return [
                'athlete_id'   => $athlete->id,
                'name'         => $athlete->name,
                'status'       => $att ? $att->status : 'absent',
                'base_points'  => $att ? $att->base_points : 5,
                'extra_points' => $att ? $att->extra_points : 0,
            ];
        });

        return response()->json([
            'attendance' => $data
        ]);
    }

    /**
     * Save training attendance logs.
     */
    public function save(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'training_group_id'           => 'required|exists:training_groups,id',
            'attendance_date'             => 'required|date',
            'attendance_data'             => 'required|array',
            'attendance_data.*.athlete_id' => 'required|exists:users,id',
            'attendance_data.*.status'     => 'required|in:present,absent',
            'attendance_data.*.base_points' => 'required|integer|min:0',
            'attendance_data.*.extra_points' => 'required|integer',
        ]);

        $groupId = $validated['training_group_id'];
        
        // Authorize
        if ($user->hasRole('Coach')) {
            $hasGroup = $user->trainingGroups()->where('training_group_id', $groupId)->exists();
            if (!$hasGroup) {
                abort(403, 'Unauthorized group access.');
            }
        } elseif (!$user->hasRole(['Manager', 'Super Admin'])) {
            abort(403, 'Unauthorized.');
        }

        DB::transaction(function () use ($validated, $user) {
            foreach ($validated['attendance_data'] as $item) {
                TrainingAttendance::updateOrCreate(
                    [
                        'training_group_id' => $validated['training_group_id'],
                        'athlete_id'        => $item['athlete_id'],
                        'attendance_date'   => $validated['attendance_date'],
                    ],
                    [
                        'status'       => $item['status'],
                        'base_points'  => $item['base_points'],
                        'extra_points' => $item['extra_points'],
                        'created_by'   => $user->id,
                    ]
                );

                // Sync the athlete's total points dynamically
                TrainingAttendance::syncProfilePoints($item['athlete_id']);
            }
        });

        return back()->with('success', 'Attendance saved and athlete points synchronized successfully!');
    }
}
