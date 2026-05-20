<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'club_id',
        'training_group_id',
        'plan_name',
        'amount',
        'billing_cycle',
        'status',
        'starts_at',
        'ends_at',
        'last_payment_at',
        'next_payment_at',
    ];

    protected $casts = [
        'starts_at' => 'date',
        'ends_at' => 'date',
        'last_payment_at' => 'date',
        'next_payment_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function trainingGroup()
    {
        return $this->belongsTo(TrainingGroup::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
