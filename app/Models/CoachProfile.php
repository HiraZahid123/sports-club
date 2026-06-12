<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialization',
        'hourly_rate',
        'payment_option',
        'payment_rate',
        'bio',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
