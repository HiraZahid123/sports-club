<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachPayout extends Model
{
    protected $fillable = [
        'user_id',
        'club_id',
        'amount',
        'tip',
        'payout_date',
        'status',
        'notes',
        'payment_type',
    ];

    protected $casts = [
        'payout_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }
}
