<?php

namespace App\Http\Controllers;

use App\Models\ClubMessage;
use App\Models\MessageRead;
use App\Models\TrainingGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user   = $request->user();
        $isSender = $user->hasRole(['Manager', 'Super Admin', 'Coach']);

        if ($isSender) {
            $messages = ClubMessage::where('sender_id', $user->id)
                ->with(['trainingGroup:id,name', 'recipientUser:id,name', 'reads'])
                ->latest()
                ->get()
                ->map(function ($msg) {
                    return [
                        'id'             => $msg->id,
                        'title'          => $msg->title,
                        'body'           => $msg->body,
                        'recipient_type' => $msg->recipient_type,
                        'group'          => $msg->trainingGroup ? ['name' => $msg->trainingGroup->name] : null,
                        'recipient_user' => $msg->recipientUser ? ['name' => $msg->recipientUser->name] : null,
                        'read_count'     => $msg->reads->count(),
                        'created_at'     => $msg->created_at->format('d M Y, H:i'),
                    ];
                });

            // For compose: recipients the sender can target
            if ($user->hasRole(['Manager', 'Super Admin'])) {
                $groups  = TrainingGroup::where('club_id', $user->club_id)->get(['id', 'name']);
                $athletes = User::where('club_id', $user->club_id)
                    ->whereHas('roles', fn($q) => $q->where('name', 'Athlete'))
                    ->orderBy('name')
                    ->get(['id', 'name']);
            } else {
                // Coach: only groups they coach
                $groups  = $user->trainingGroups()->get(['training_groups.id', 'training_groups.name']);
                $athletes = User::whereHas('trainingGroups', function ($q) use ($user) {
                    $q->whereIn('training_groups.id', $user->trainingGroups()->pluck('training_groups.id'));
                })->whereHas('roles', fn($q) => $q->where('name', 'Athlete'))
                  ->orderBy('name')
                  ->get(['id', 'name']);
            }

            return Inertia::render('Messages/Index', [
                'isSender' => true,
                'messages' => $messages,
                'groups'   => $groups,
                'athletes' => $athletes,
            ]);
        }

        // Athlete / Parent / other roles — inbox
        $readIds = MessageRead::where('user_id', $user->id)->pluck('message_id')->toArray();

        $messages = ClubMessage::forUser($user)
            ->with(['sender:id,name'])
            ->latest()
            ->get()
            ->map(function ($msg) use ($readIds) {
                return [
                    'id'         => $msg->id,
                    'title'      => $msg->title,
                    'body'       => $msg->body,
                    'sender'     => ['name' => $msg->sender->name],
                    'is_read'    => in_array($msg->id, $readIds),
                    'created_at' => $msg->created_at->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('Messages/Index', [
            'isSender' => false,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'             => 'required|string|max:150',
            'body'              => 'required|string|max:5000',
            'recipient_type'    => 'required|in:club,group,user',
            'training_group_id' => 'nullable|required_if:recipient_type,group|exists:training_groups,id',
            'recipient_user_id' => 'nullable|required_if:recipient_type,user|exists:users,id',
        ]);

        abort_unless($request->user()->hasRole(['Manager', 'Super Admin', 'Coach']), 403);

        ClubMessage::create([
            'club_id'           => $request->user()->club_id,
            'sender_id'         => $request->user()->id,
            'title'             => $request->title,
            'body'              => $request->body,
            'recipient_type'    => $request->recipient_type,
            'training_group_id' => $request->recipient_type === 'group' ? $request->training_group_id : null,
            'recipient_user_id' => $request->recipient_type === 'user'  ? $request->recipient_user_id : null,
        ]);

        return back()->with('status', 'message-sent');
    }

    public function destroy(Request $request, ClubMessage $message)
    {
        abort_if($message->sender_id !== $request->user()->id, 403);
        $message->delete();
        return back()->with('status', 'message-deleted');
    }

    public function markRead(Request $request, ClubMessage $message)
    {
        $user = $request->user();

        MessageRead::firstOrCreate(
            ['message_id' => $message->id, 'user_id' => $user->id],
            ['read_at'    => now()]
        );

        return response()->json(['ok' => true]);
    }
}
