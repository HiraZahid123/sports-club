<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\ClubInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function index(Request $request): Response
    {
        $clubId = $request->user()->club_id;

        $invitations = ClubInvitation::where('club_id', $clubId)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Manager/Invitations/Index', [
            'invitations' => $invitations,
        ]);
    }

    public function storeCoach(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $club = Club::findOrFail($request->user()->club_id);

        $existing = ClubInvitation::where('club_id', $club->id)
            ->where('email', $request->email)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return back()->withErrors(['email' => 'An active invitation has already been sent to this email address.']);
        }

        $invitation = ClubInvitation::create([
            'club_id'    => $club->id,
            'email'      => $request->email,
            'role'       => 'Coach',
            'token'      => ClubInvitation::generateToken(),
            'status'     => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        $inviteUrl = route('register.coach', $invitation->token);

        try {
            Mail::send([], [], function ($message) use ($request, $club, $inviteUrl) {
                $message->to($request->email)
                    ->subject("You're invited to join {$club->name} as a Coach")
                    ->html("
                        <div style='font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px'>
                            <h2 style='color:#4f46e5'>Coach Invitation — {$club->name}</h2>
                            <p>You have been invited to join <strong>{$club->name}</strong> as a coach on the sports club management platform.</p>
                            <p>Click the button below to create your account. This link expires in 7 days.</p>
                            <a href='{$inviteUrl}' style='display:inline-block;margin:20px 0;padding:14px 28px;background:#4f46e5;color:#fff;border-radius:10px;text-decoration:none;font-weight:bold'>
                                Activate Coach Account
                            </a>
                            <p style='color:#6b7280;font-size:13px'>If you did not expect this invitation, you can safely ignore this email.</p>
                        </div>
                    ");
            });
        } catch (\Exception $e) {
            // mail failure should not block the invitation creation
        }

        return back()->with('status', 'invitation-sent');
    }

    public function destroy(Request $request, ClubInvitation $invitation): RedirectResponse
    {
        if ($invitation->club_id !== $request->user()->club_id) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('status', 'invitation-deleted');
    }
}
