<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AthleteProfile;
use App\Models\ParentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;

        $members = User::where('club_id', $clubId)
            ->whereHas('roles', function($q) {
                $q->whereIn('name', ['Athlete', 'Parent']);
            })
            ->with(['roles', 'athleteProfile', 'parentProfile'])
            ->get();

        return Inertia::render('Manager/Members/Index', [
            'members' => $members,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'email'                   => 'required|string|email|max:255|unique:users',
            'roles'                   => 'required|array|min:1',
            'roles.*'                 => 'string|in:Athlete,Parent,Coach,Coach Assistant',
            'password'                => 'required|string|min:8',
            'id_code'                 => 'nullable|string|max:100',
            'phone'                   => 'nullable|string|max:50',
            'city'                    => 'nullable|string|max:100',
            'emergency_contact_name'  => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'date_of_birth'           => 'nullable|date',
            'belt_rank'               => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name'                    => $validated['name'],
            'email'                   => $validated['email'],
            'password'                => Hash::make($validated['password']),
            'club_id'                 => $request->user()->club_id,
            'id_code'                 => $validated['id_code'] ?? null,
            'phone'                   => $validated['phone'] ?? null,
            'city'                    => $validated['city'] ?? null,
            'emergency_contact_name'  => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
        ]);

        $user->assignRole($validated['roles']);

        if (in_array('Athlete', $validated['roles'])) {
            AthleteProfile::create([
                'user_id'       => $user->id,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'belt_rank'     => $validated['belt_rank'] ?? null,
            ]);
        }
        if (in_array('Parent', $validated['roles'])) {
            ParentProfile::create(['user_id' => $user->id]);
        }
        if (in_array('Coach', $validated['roles']) || in_array('Coach Assistant', $validated['roles'])) {
            \App\Models\CoachProfile::create(['user_id' => $user->id]);
        }

        return redirect()->route('manager.members.index')->with('status', 'member-created');
    }

    public function update(Request $request, User $user)
    {
        if ($user->club_id !== $request->user()->club_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'email'                   => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'roles'                   => 'required|array|min:1',
            'roles.*'                 => 'string|in:Athlete,Parent,Coach,Coach Assistant',
            'id_code'                 => 'nullable|string|max:100',
            'phone'                   => 'nullable|string|max:50',
            'city'                    => 'nullable|string|max:100',
            'emergency_contact_name'  => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
            'date_of_birth'           => 'nullable|date',
            'belt_rank'               => 'nullable|string|max:100',
        ]);

        $user->update([
            'name'                    => $validated['name'],
            'email'                   => $validated['email'],
            'id_code'                 => $validated['id_code'] ?? null,
            'phone'                   => $validated['phone'] ?? null,
            'city'                    => $validated['city'] ?? null,
            'emergency_contact_name'  => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
        ]);

        $roles = $validated['roles'];
        $user->syncRoles($roles);

        if (in_array('Athlete', $roles)) {
            AthleteProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'date_of_birth' => $validated['date_of_birth'] ?? null,
                    'belt_rank'     => $validated['belt_rank'] ?? null,
                ]
            );
        } else {
            AthleteProfile::where('user_id', $user->id)->delete();
        }

        if (in_array('Parent', $roles)) {
            ParentProfile::firstOrCreate(['user_id' => $user->id]);
        } else {
            ParentProfile::where('user_id', $user->id)->delete();
        }

        if (in_array('Coach', $roles) || in_array('Coach Assistant', $roles)) {
            \App\Models\CoachProfile::firstOrCreate(['user_id' => $user->id]);
        } else {
            \App\Models\CoachProfile::where('user_id', $user->id)->delete();
        }

        return redirect()->back()->with('status', 'member-updated');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->club_id !== $request->user()->club_id) {
            abort(403, 'Unauthorized action.');
        }

        $user->delete();

        return redirect()->back()->with('status', 'member-deleted');
    }
}
