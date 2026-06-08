<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckSubscription
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

            if (env('BYPASS_SUBSCRIPTION_CHECK', false)) {
                return $next($request);
            }

            // If user is NOT a manager/admin/coach and has NOT paid, restrict access
            if (!$user->isPaid()) {
                // Always allow billing, logout, and profile pages
                if ($request->routeIs(['parent.billing', 'logout', 'profile.*'])) {
                    return $next($request);
                }

                // Send parents to their own billing page; redirect others to login with a notice
                if ($user->hasRole('Parent')) {
                    return redirect()->route('parent.billing')->with('error', 'access-locked');
                }

                // Athletes or any other non-parent: redirect to login with a clear message
                return redirect()->route('login')->with('status', 'Your membership is not currently active. Please contact your club manager.');
            }
        }

        return $next($request);
    }
}
