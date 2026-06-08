<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisterClubController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterClub');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'club_name'    => 'required|string|max:255',
            'club_email'   => 'nullable|string|email|max:255',
            'club_phone'   => 'nullable|string|max:50',
            'club_address' => 'nullable|string|max:500',
            'name'         => 'required|string|max:255',
            'email'        => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $slug = Str::slug($request->club_name);
        $base = $slug;
        $i = 1;
        while (Club::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        $joinCode = strtoupper(Str::random(8));
        while (Club::where('join_code', $joinCode)->exists()) {
            $joinCode = strtoupper(Str::random(8));
        }

        $club = Club::create([
            'name'      => $request->club_name,
            'slug'      => $slug,
            'email'     => $request->club_email,
            'phone'     => $request->club_phone,
            'address'   => $request->club_address,
            'join_code' => $joinCode,
            'is_active' => true,
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'club_id'  => $club->id,
        ]);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $user->assignRole('Manager');

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('manager.dashboard');
    }
}
