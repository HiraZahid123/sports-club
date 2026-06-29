<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;

class SubscriptionPlanController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:100',
            'training_group_id'  => 'nullable|exists:training_groups,id',
            'monthly_price'      => 'required|numeric|min:0',
            'yearly_price'       => 'required|numeric|min:0',
            'description'        => 'nullable|string|max:500',
        ]);

        SubscriptionPlan::create([
            ...$validated,
            'club_id' => $request->user()->club_id,
        ]);

        return back()->with('status', 'plan-created');
    }

    public function update(Request $request, SubscriptionPlan $plan)
    {
        abort_if($plan->club_id !== $request->user()->club_id, 403);

        $validated = $request->validate([
            'name'               => 'required|string|max:100',
            'training_group_id'  => 'nullable|exists:training_groups,id',
            'monthly_price'      => 'required|numeric|min:0',
            'yearly_price'       => 'required|numeric|min:0',
            'description'        => 'nullable|string|max:500',
            'is_active'          => 'boolean',
        ]);

        $plan->update($validated);

        return back()->with('status', 'plan-updated');
    }

    public function destroy(Request $request, SubscriptionPlan $plan)
    {
        abort_if($plan->club_id !== $request->user()->club_id, 403);
        $plan->delete();

        return back()->with('status', 'plan-deleted');
    }
}
