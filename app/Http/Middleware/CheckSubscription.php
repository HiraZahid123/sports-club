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

            // If user is NOT a manager/admin/coach and has NOT paid, restrict access
            if (!$user->isPaid()) {
                // Allow access to billing/payment pages so they can actually pay
                if ($request->routeIs(['parent.billing', 'logout', 'profile.*'])) {
                    return $next($request);
                }

                // Redirect to a "Payment Required" landing or the billing page
                return redirect()->route('parent.billing')->with('error', 'access-locked');
            }
        }

        return $next($request);
    }
}
