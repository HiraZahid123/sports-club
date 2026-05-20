<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleRedirect
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // If user is trying to access the generic dashboard, redirect them to their role-specific one
            if ($request->routeIs('dashboard')) {
                if ($user->hasRole('Manager') || $user->hasRole('Super Admin')) {
                    return redirect()->route('manager.dashboard');
                } elseif ($user->hasRole('Coach')) {
                    return redirect()->route('coach.dashboard');
                } elseif ($user->hasRole('Athlete')) {
                    return redirect()->route('athlete.dashboard');
                } elseif ($user->hasRole('Parent')) {
                    return redirect()->route('parent.dashboard');
                }
            }
        }

        return $next($request);
    }
}
