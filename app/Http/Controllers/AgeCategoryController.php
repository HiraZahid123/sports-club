<?php

namespace App\Http\Controllers;

use App\Models\AgeCategory;
use Illuminate\Http\Request;

class AgeCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'min_age' => 'nullable|integer|min:0|max:255',
            'max_age' => 'nullable|integer|min:0|max:255|gte:min_age',
        ]);

        AgeCategory::create([
            ...$validated,
            'club_id' => $request->user()->club_id,
        ]);

        return redirect()->route('manager.setup.index')->with('status', 'age-category-created');
    }

    public function update(Request $request, AgeCategory $ageCategory)
    {
        abort_unless($ageCategory->club_id === $request->user()->club_id, 403);

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'min_age' => 'nullable|integer|min:0|max:255',
            'max_age' => 'nullable|integer|min:0|max:255|gte:min_age',
        ]);

        $ageCategory->update($validated);

        return redirect()->route('manager.setup.index')->with('status', 'age-category-updated');
    }

    public function destroy(Request $request, AgeCategory $ageCategory)
    {
        abort_unless($ageCategory->club_id === $request->user()->club_id, 403);

        $ageCategory->delete();

        return redirect()->route('manager.setup.index')->with('status', 'age-category-deleted');
    }
}
