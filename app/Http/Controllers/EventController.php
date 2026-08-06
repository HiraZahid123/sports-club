<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\TrainingGroup;
use App\Models\User;
use App\Models\AthleteProfile;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventController extends Controller
{
    // ── Manager ─────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $clubId = $request->user()->club_id;

        $events = Event::where('club_id', $clubId)
            ->with(['groups', 'coaches:id,name', 'registrations'])
            ->orderByDesc('start_date')
            ->get()
            ->map(function ($event) {
                $mappedGroups = $event->groups->map(function ($group) {
                    return [
                        'id' => $group->id,
                        'name' => $group->name,
                        'can_join' => (bool) $group->pivot->can_join,
                    ];
                });

                return array_merge($event->toArray(), [
                    'pdf_url'             => $event->pdf_path ? asset($event->pdf_path) : null,
                    'image_url'           => $event->image_path ? asset($event->image_path) : null,
                    'registrations_count' => $event->registrations->count(),
                    'attended_count'      => $event->registrations->where('status', 'attended')->count(),
                    'groups'              => $mappedGroups,
                ]);
            });

        $groups  = TrainingGroup::where('club_id', $clubId)->select('id', 'name')->get();
        $coaches = User::where('club_id', $clubId)->role(['Coach', 'Coach Assistant'])->select('id', 'name')->get();
        $categories = EventCategory::where('club_id', $clubId)->orderBy('name')->get();

        return Inertia::render('Manager/Events/Index', [
            'events'     => $events,
            'groups'     => $groups,
            'coaches'    => $coaches,
            'categories' => $categories,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'location'            => 'nullable|string|max:255',
            'start_date'          => 'required|date',
            'end_date'            => 'nullable|date|after_or_equal:start_date',
            'price'               => 'nullable|numeric|min:0',
            'stripe_payment_link' => 'nullable|url|max:500',
            'points'              => 'required|integer|min:0',
            'pdf'                 => 'nullable|file|mimes:pdf|max:10240',
            'image'               => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'event_category_id'   => 'nullable|exists:event_categories,id',
            'group_ids'           => 'required|array|min:1',
            'group_ids.*'         => 'integer|exists:training_groups,id',
            'join_group_ids'      => 'nullable|array',
            'join_group_ids.*'    => 'integer',
            'coach_ids'           => 'nullable|array',
            'coach_ids.*'         => 'integer|exists:users,id',
            'coach_salary_type'   => 'nullable|string|in:per_athlete,fixed,per_hour,free',
            'coach_salary_rate'   => 'nullable|numeric|min:0',
        ]);

        $pdfPath = null;
        if ($request->hasFile('pdf')) {
            $file      = $request->file('pdf');
            $filename  = Str::uuid() . '.pdf';
            $directory = public_path('uploads/event-pdfs');
            File::ensureDirectoryExists($directory);
            $file->move($directory, $filename);
            $pdfPath = '/uploads/event-pdfs/' . $filename;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $directory = public_path('uploads/event-posters');
            File::ensureDirectoryExists($directory);
            $file->move($directory, $filename);
            $imagePath = '/uploads/event-posters/' . $filename;
        }

        $event = Event::create([
            'club_id'             => $request->user()->club_id,
            'created_by'          => $request->user()->id,
            'name'                => $validated['name'],
            'description'         => $validated['description'] ?? null,
            'location'            => $validated['location'] ?? null,
            'start_date'          => $validated['start_date'],
            'end_date'            => $validated['end_date'] ?? null,
            'price'               => $validated['price'] ?? null,
            'stripe_payment_link' => $validated['stripe_payment_link'] ?? null,
            'points'              => $validated['points'],
            'pdf_path'            => $pdfPath,
            'image_path'          => $imagePath,
            'event_category_id'   => $validated['event_category_id'] ?? null,
            'coach_salary_type'   => $validated['coach_salary_type'] ?? null,
            'coach_salary_rate'   => $validated['coach_salary_rate'] ?? null,
        ]);

        $syncData = [];
        $joinGroupIds = $request->input('join_group_ids', []);
        foreach ($validated['group_ids'] as $groupId) {
            $syncData[$groupId] = [
                'can_join' => in_array($groupId, $joinGroupIds)
            ];
        }

        $event->groups()->sync($syncData);
        $event->coaches()->sync($validated['coach_ids'] ?? []);

        return redirect()->route('manager.events.index');
    }

    public function update(Request $request, Event $event)
    {
        abort_if($event->club_id !== $request->user()->club_id, 403);

        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'location'            => 'nullable|string|max:255',
            'start_date'          => 'required|date',
            'end_date'            => 'nullable|date|after_or_equal:start_date',
            'price'               => 'nullable|numeric|min:0',
            'stripe_payment_link' => 'nullable|url|max:500',
            'points'              => 'required|integer|min:0',
            'pdf'                 => 'nullable|file|mimes:pdf|max:10240',
            'remove_pdf'          => 'nullable|boolean',
            'image'               => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_image'        => 'nullable|boolean',
            'event_category_id'   => 'nullable|exists:event_categories,id',
            'group_ids'           => 'required|array|min:1',
            'group_ids.*'         => 'integer|exists:training_groups,id',
            'join_group_ids'      => 'nullable|array',
            'join_group_ids.*'    => 'integer',
            'coach_ids'           => 'nullable|array',
            'coach_ids.*'         => 'integer|exists:users,id',
            'coach_salary_type'   => 'nullable|string|in:per_athlete,fixed,per_hour,free',
            'coach_salary_rate'   => 'nullable|numeric|min:0',
        ]);

        $pdfPath = $event->pdf_path;

        if (!empty($validated['remove_pdf'])) {
            if ($pdfPath) {
                $full = public_path(ltrim($pdfPath, '/'));
                if (File::exists($full)) File::delete($full);
            }
            $pdfPath = null;
        }

        if ($request->hasFile('pdf')) {
            if ($pdfPath) {
                $full = public_path(ltrim($pdfPath, '/'));
                if (File::exists($full)) File::delete($full);
            }
            $file      = $request->file('pdf');
            $filename  = Str::uuid() . '.pdf';
            $directory = public_path('uploads/event-pdfs');
            File::ensureDirectoryExists($directory);
            $file->move($directory, $filename);
            $pdfPath = '/uploads/event-pdfs/' . $filename;
        }

        $imagePath = $event->image_path;

        if (!empty($validated['remove_image'])) {
            if ($imagePath) {
                $full = public_path(ltrim($imagePath, '/'));
                if (File::exists($full)) File::delete($full);
            }
            $imagePath = null;
        }

        if ($request->hasFile('image')) {
            if ($imagePath) {
                $full = public_path(ltrim($imagePath, '/'));
                if (File::exists($full)) File::delete($full);
            }
            $file      = $request->file('image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $directory = public_path('uploads/event-posters');
            File::ensureDirectoryExists($directory);
            $file->move($directory, $filename);
            $imagePath = '/uploads/event-posters/' . $filename;
        }

        $event->update([
            'name'                => $validated['name'],
            'description'         => $validated['description'] ?? null,
            'location'            => $validated['location'] ?? null,
            'start_date'          => $validated['start_date'],
            'end_date'            => $validated['end_date'] ?? null,
            'price'               => $validated['price'] ?? null,
            'stripe_payment_link' => $validated['stripe_payment_link'] ?? null,
            'points'              => $validated['points'],
            'pdf_path'            => $pdfPath,
            'image_path'          => $imagePath,
            'event_category_id'   => $validated['event_category_id'] ?? null,
            'coach_salary_type'   => $validated['coach_salary_type'] ?? null,
            'coach_salary_rate'   => $validated['coach_salary_rate'] ?? null,
        ]);

        $syncData = [];
        $joinGroupIds = $request->input('join_group_ids', []);
        foreach ($validated['group_ids'] as $groupId) {
            $syncData[$groupId] = [
                'can_join' => in_array($groupId, $joinGroupIds)
            ];
        }

        $event->groups()->sync($syncData);
        $event->coaches()->sync($validated['coach_ids'] ?? []);

        return redirect()->route('manager.events.index');
    }

    public function destroy(Request $request, Event $event)
    {
        abort_if($event->club_id !== $request->user()->club_id, 403);

        if ($event->pdf_path) {
            $full = public_path(ltrim($event->pdf_path, '/'));
            if (File::exists($full)) File::delete($full);
        }

        if ($event->image_path) {
            $full = public_path(ltrim($event->image_path, '/'));
            if (File::exists($full)) File::delete($full);
        }

        $event->delete();

        return redirect()->route('manager.events.index');
    }

    // ── Athlete ─────────────────────────────────────────────────────────────

    public function athleteIndex(Request $request)
    {
        $user   = $request->user();
        $groupIds = $user->trainingGroups()->pluck('training_groups.id');

        $events = Event::where('club_id', $user->club_id)
            ->whereHas('groups', fn($q) => $q->whereIn('training_groups.id', $groupIds))
            ->with(['groups', 'coaches:id,name'])
            ->orderBy('start_date')
            ->get()
            ->map(function ($event) use ($user, $groupIds) {
                $registration = $event->registrations()->where('user_id', $user->id)->first();
                
                // Check if athlete is in any group that has join permission for this event
                $canJoin = $event->groups()
                    ->whereIn('training_groups.id', $groupIds)
                    ->wherePivot('can_join', true)
                    ->exists();

                return array_merge($event->toArray(), [
                    'pdf_url'        => $event->pdf_path ? asset($event->pdf_path) : null,
                    'image_url'      => $event->image_path ? asset($event->image_path) : null,
                    'registration'   => $registration,
                    'is_free'        => $event->isFree(),
                    'can_join_event' => $canJoin,
                ]);
            });

        $athleteProfile = $user->athleteProfile;

        return Inertia::render('Athlete/Events', [
            'events'         => $events,
            'event_points'   => $athleteProfile?->event_points ?? 0,
        ]);
    }

    public function join(Request $request, Event $event)
    {
        $user = $request->user();

        abort_if($event->club_id !== $user->club_id, 403);

        // Check athlete is in one of the event's groups and that group has join permission
        $athleteGroupIds = $user->trainingGroups()->pluck('training_groups.id');
        
        $canJoin = $event->groups()
            ->whereIn('training_groups.id', $athleteGroupIds)
            ->wherePivot('can_join', true)
            ->exists();

        abort_if(!$canJoin, 403, 'You do not have permission to join this event.');

        // Prevent duplicate registration
        if ($event->registrations()->where('user_id', $user->id)->exists()) {
            return back();
        }

        $status = $event->isFree() ? 'pending_approval' : 'registered';

        EventRegistration::create([
            'event_id'      => $event->id,
            'user_id'       => $user->id,
            'status'        => $status,
            'registered_at' => now(),
        ]);

        return back();
    }

    // ── Coach ────────────────────────────────────────────────────────────────

    public function coachIndex(Request $request)
    {
        $user = $request->user();

        $events = Event::where('club_id', $user->club_id)
            ->whereHas('coaches', fn($q) => $q->where('users.id', $user->id))
            ->with([
                'groups:id,name',
                'registrations.user:id,name,email',
            ])
            ->orderBy('start_date')
            ->get()
            ->map(fn($event) => array_merge($event->toArray(), [
                'pdf_url' => $event->pdf_path ? asset($event->pdf_path) : null,
                'image_url' => $event->image_path ? asset($event->image_path) : null,
                'is_free' => $event->isFree(),
            ]));

        return Inertia::render('Coach/Events', [
            'events' => $events,
        ]);
    }

    public function acceptAttendance(Request $request, Event $event, EventRegistration $registration)
    {
        abort_if($event->club_id !== $request->user()->club_id, 403);
        abort_if($registration->event_id !== $event->id, 404);

        $registration->update([
            'status'      => 'attended',
            'attended_at' => now(),
        ]);

        // Award event points via self-healing sync
        \App\Models\TrainingAttendance::syncProfilePoints($registration->user_id);

        return back();
    }

    public function rejectAttendance(Request $request, Event $event, EventRegistration $registration)
    {
        abort_if($event->club_id !== $request->user()->club_id, 403);
        abort_if($registration->event_id !== $event->id, 404);

        $registration->update(['status' => 'rejected']);

        // Sync points since status changed from attended to rejected or similar
        \App\Models\TrainingAttendance::syncProfilePoints($registration->user_id);

        return back();
    }
}
