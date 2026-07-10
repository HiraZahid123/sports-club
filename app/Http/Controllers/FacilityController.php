<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'type'     => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'notes'    => 'nullable|string|max:500',
        ]);

        Facility::create([
            ...$validated,
            'club_id' => $request->user()->club_id,
        ]);

        return back()->with('status', 'facility-created');
    }

    public function update(Request $request, Facility $facility)
    {
        abort_unless($facility->club_id === $request->user()->club_id, 403);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'type'     => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'notes'    => 'nullable|string|max:500',
        ]);

        $facility->update($validated);

        return back()->with('status', 'facility-updated');
    }

    public function destroy(Request $request, Facility $facility)
    {
        abort_unless($facility->club_id === $request->user()->club_id, 403);

        $facility->delete();

        return back()->with('status', 'facility-deleted');
    }
}
