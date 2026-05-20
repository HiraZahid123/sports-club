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
    /**
     * Display a listing of members for the manager's club.
     */
    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;
        
        $members = User::where('club_id', $clubId)
            ->with(['roles', 'athleteProfile', 'parentProfile'])
            ->get();

        return Inertia::render('Manager/Members/Index', [
            'members' => $members,
        ]);
    }

    /**
     * Store a newly created member in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:Athlete,Parent,Coach',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'club_id' => $request->user()->club_id,
        ]);

        $user->assignRole($validated['role']);

        // Initialize profile based on role
        if ($validated['role'] === 'Athlete') {
            AthleteProfile::create(['user_id' => $user->id]);
        } elseif ($validated['role'] === 'Parent') {
            ParentProfile::create(['user_id' => $user->id]);
        }

        return redirect()->route('manager.members.index')->with('status', 'member-created');
    }
}
