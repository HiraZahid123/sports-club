<?php

namespace App\Http\Middleware;

use App\Models\ClubMessage;
use App\Models\MessageRead;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'profile_photo' => $request->user()->profile_photo ? asset($request->user()->profile_photo) : null,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    'club' => $request->user()->club ? [
                        ...$request->user()->club->toArray(),
                        'logo_path' => $request->user()->club->logo_path ? asset($request->user()->club->logo_path) : null,
                    ] : null,
                    'athlete_profile' => $request->user()->athleteProfile ? $request->user()->athleteProfile->toArray() : null,
                ] : null,
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'unreadMessageCount' => function () use ($request) {
                $user = $request->user();
                if (!$user || $user->hasRole(['Manager', 'Super Admin'])) {
                    return 0;
                }
                $total = ClubMessage::forUser($user)->count();
                $read  = MessageRead::where('user_id', $user->id)
                    ->whereIn('message_id', ClubMessage::forUser($user)->pluck('id'))
                    ->count();
                return max(0, $total - $read);
            },
            'pendingImportantMessages' => function () use ($request) {
                $user = $request->user();
                if (!$user || !$user->hasRole('Coach')) {
                    return [];
                }
                $readIds = MessageRead::where('user_id', $user->id)->pluck('message_id')->toArray();
                return ClubMessage::forUser($user)
                    ->where('message_type', 'important')
                    ->whereNotIn('id', $readIds)
                    ->with(['sender:id,name'])
                    ->latest()
                    ->get()
                    ->map(fn($m) => [
                        'id'         => $m->id,
                        'title'      => $m->title,
                        'body'       => $m->body,
                        'sender'     => ['name' => $m->sender->name],
                        'created_at' => $m->created_at->format('d M Y, H:i'),
                    ])
                    ->values()
                    ->all();
            },
        ];
    }
}
