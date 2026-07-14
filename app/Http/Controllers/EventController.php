<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\TrainingGroup;
use App\Models\User;
use App\Models\AthleteProfile;
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
            ->with(['groups:id,name', 'coaches:id,name', 'registrations'])
            ->orderByDesc('start_date')
            ->get()
            ->map(function ($event) {
                return array_merge($event->toArray(), [
                    'pdf_url'             => $event->pdf_path ? asset($event->pdf_path) : null,
                    'registrations_count' => $event->registrations->count(),
                    'attended_count'      => $event->registrations->where('status', 'attended')->count(),
                ]);
            });

        $groups  = TrainingGroup::where('club_id', $clubId)->select('id', 'name')->get();
        $coaches = User::where('club_id', $clubId)->role(['Coach', 'Coach Assistant'])->select('id', 'name')->get();

        return Inertia::render('Manager/Events/Index', [
            'events'  => $events,
            'groups'  => $groups,
            'coaches' => $coaches,
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
            'group_ids'           => 'required|array|min:1',
            'group_ids.*'         => 'integer|exists:training_groups,id',
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
            'coach_salary_type'   => $validated['coach_salary_type'] ?? null,
            'coach_salary_rate'   => $validated['coach_salary_rate'] ?? null,
        ]);

        $event->groups()->sync($validated['group_ids']);
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
            'group_ids'           => 'required|array|min:1',
            'group_ids.*'         => 'integer|exists:training_groups,id',
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
            'coach_salary_type'   => $validated['coach_salary_type'] ?? null,
            'coach_salary_rate'   => $validated['coach_salary_rate'] ?? null,
        ]);

        $event->groups()->sync($validated['group_ids']);
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
            ->with(['groups:id,name', 'coaches:id,name'])
            ->orderBy('start_date')
            ->get()
            ->map(function ($event) use ($user) {
                $registration = $event->registrations()->where('user_id', $user->id)->first();
                return array_merge($event->toArray(), [
                    'pdf_url'       => $event->pdf_path ? asset($event->pdf_path) : null,
                    'registration'  => $registration,
                    'is_free'       => $event->isFree(),
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

        // Check athlete is in one of the event's groups
        $athleteGroupIds = $user->trainingGroups()->pluck('training_groups.id');
        $eventGroupIds   = $event->groups()->pluck('training_groups.id');
        abort_if($athleteGroupIds->intersect($eventGroupIds)->isEmpty(), 403);

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
