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

            if (!$user->isPaid()) {
                if ($request->routeIs(['subscription.locked', 'logout', 'profile.*', 'parent.billing', 'parent.billing.*', 'athlete.checkout'])) {
                    return $next($request);
                }

                return redirect()->route('subscription.locked');
            }
        }

        return $next($request);
    }
}
