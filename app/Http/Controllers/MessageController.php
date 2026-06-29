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
        $user = $request->user();

        if ($user->hasRole(['Manager', 'Super Admin'])) {
            return $this->managerIndex($user);
        }

        if ($user->hasRole('Coach')) {
            return $this->coachIndex($user);
        }

        return $this->athleteIndex($user);
    }

    private function managerIndex(User $user)
    {
        $sent = ClubMessage::where('sender_id', $user->id)
            ->with(['trainingGroup:id,name', 'recipientUser:id,name', 'reads'])
            ->latest()
            ->get()
            ->map(fn($msg) => [
                'id'             => $msg->id,
                'title'          => $msg->title,
                'body'           => $msg->body,
                'recipient_type' => $msg->recipient_type,
                'group'          => $msg->trainingGroup ? ['name' => $msg->trainingGroup->name] : null,
                'recipient_user' => $msg->recipientUser ? ['name' => $msg->recipientUser->name] : null,
                'read_count'     => $msg->reads->count(),
                'created_at'     => $msg->created_at->format('d M Y, H:i'),
                'message_type'   => $msg->message_type,
            ]);

        $groups   = TrainingGroup::where('club_id', $user->club_id)->get(['id', 'name']);
        $athletes = User::where('club_id', $user->club_id)
            ->whereHas('roles', fn($q) => $q->where('name', 'Athlete'))
            ->orderBy('name')
            ->get(['id', 'name']);
        $coaches  = User::where('club_id', $user->club_id)
            ->whereHas('roles', fn($q) => $q->where('name', 'Coach'))
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Messages/Index', [
            'role'     => 'manager',
            'sent'     => $sent,
            'groups'   => $groups,
            'athletes' => $athletes,
            'coaches'  => $coaches,
        ]);
    }

    private function coachIndex(User $user)
    {
        $sent = ClubMessage::where('sender_id', $user->id)
            ->with(['trainingGroup:id,name', 'recipientUser:id,name', 'reads'])
            ->latest()
            ->get()
            ->map(fn($msg) => [
                'id'             => $msg->id,
                'title'          => $msg->title,
                'body'           => $msg->body,
                'recipient_type' => $msg->recipient_type,
                'group'          => $msg->trainingGroup ? ['name' => $msg->trainingGroup->name] : null,
                'recipient_user' => $msg->recipientUser ? ['name' => $msg->recipientUser->name] : null,
                'read_count'     => $msg->reads->count(),
                'created_at'     => $msg->created_at->format('d M Y, H:i'),
                'message_type'   => $msg->message_type,
            ]);

        $readIds = MessageRead::where('user_id', $user->id)->pluck('message_id')->toArray();
        $inbox   = ClubMessage::forUser($user)
            ->with(['sender:id,name'])
            ->latest()
            ->get()
            ->map(fn($msg) => [
                'id'           => $msg->id,
                'title'        => $msg->title,
                'body'         => $msg->body,
                'sender'       => ['name' => $msg->sender->name],
                'is_read'      => in_array($msg->id, $readIds),
                'created_at'   => $msg->created_at->format('d M Y, H:i'),
                'message_type' => $msg->message_type,
            ]);

        $groups   = $user->trainingGroups()->get(['training_groups.id', 'training_groups.name']);
        $athletes = User::whereHas('trainingGroups', function ($q) use ($user) {
            $q->whereIn('training_groups.id', $user->trainingGroups()->pluck('training_groups.id'));
        })->whereHas('roles', fn($q) => $q->where('name', 'Athlete'))
          ->orderBy('name')
          ->get(['id', 'name']);

        return Inertia::render('Messages/Index', [
            'role'     => 'coach',
            'sent'     => $sent,
            'inbox'    => $inbox,
            'groups'   => $groups,
            'athletes' => $athletes,
        ]);
    }

    private function athleteIndex(User $user)
    {
        $readIds  = MessageRead::where('user_id', $user->id)->pluck('message_id')->toArray();
        $messages = ClubMessage::forUser($user)
            ->with(['sender:id,name'])
            ->latest()
            ->get()
            ->map(fn($msg) => [
                'id'           => $msg->id,
                'title'        => $msg->title,
                'body'         => $msg->body,
                'sender'       => ['name' => $msg->sender->name],
                'is_read'      => in_array($msg->id, $readIds),
                'created_at'   => $msg->created_at->format('d M Y, H:i'),
                'message_type' => $msg->message_type,
            ]);

        return Inertia::render('Messages/Index', [
            'role'     => 'athlete',
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $user      = $request->user();
        $isManager = $user->hasRole(['Manager', 'Super Admin']);

        abort_unless($user->hasRole(['Manager', 'Super Admin', 'Coach']), 403);

        $allowedTypes  = $isManager ? ['club', 'group', 'user', 'coaches'] : ['club', 'group', 'user'];
        $maxBodyLength = $request->input('message_type') === 'important' ? 200 : 5000;

        $request->validate([
            'title'             => 'required|string|max:150',
            'body'              => "required|string|max:{$maxBodyLength}",
            'recipient_type'    => 'required|in:' . implode(',', $allowedTypes),
            'training_group_id' => 'nullable|required_if:recipient_type,group|exists:training_groups,id',
            'recipient_user_id' => 'nullable|required_if:recipient_type,user|exists:users,id',
            'message_type'      => 'required|in:regular,important',
        ]);

        abort_if($request->message_type === 'important' && !$isManager, 403);
        abort_if($request->recipient_type === 'coaches' && !$isManager, 403);

        ClubMessage::create([
            'club_id'           => $user->club_id,
            'sender_id'         => $user->id,
            'title'             => $request->title,
            'body'              => $request->body,
            'recipient_type'    => $request->recipient_type,
            'training_group_id' => $request->recipient_type === 'group' ? $request->training_group_id : null,
            'recipient_user_id' => $request->recipient_type === 'user'  ? $request->recipient_user_id : null,
            'message_type'      => $request->message_type,
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
        MessageRead::firstOrCreate(
            ['message_id' => $message->id, 'user_id' => $request->user()->id],
            ['read_at'    => now()]
        );

        return response()->json(['ok' => true]);
    }
}
