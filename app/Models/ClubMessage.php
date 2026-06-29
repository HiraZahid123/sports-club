<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubMessage extends Model
{
    protected $fillable = [
        'club_id',
        'sender_id',
        'title',
        'body',
        'recipient_type',
        'training_group_id',
        'recipient_user_id',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function trainingGroup()
    {
        return $this->belongsTo(TrainingGroup::class);
    }

    public function recipientUser()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function reads()
    {
        return $this->hasMany(MessageRead::class, 'message_id');
    }

    // Scope: messages visible to a specific recipient user
    public function scopeForUser($query, User $user)
    {
        $groupIds = $user->trainingGroups()->pluck('training_groups.id');

        return $query->where('club_id', $user->club_id)->where(function ($q) use ($user, $groupIds) {
            $q->where('recipient_type', 'club')
              ->orWhere(function ($q2) use ($groupIds) {
                  $q2->where('recipient_type', 'group')->whereIn('training_group_id', $groupIds);
              })
              ->orWhere(function ($q2) use ($user) {
                  $q2->where('recipient_type', 'user')->where('recipient_user_id', $user->id);
              });
        });
    }
}
