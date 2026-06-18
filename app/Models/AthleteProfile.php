<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AthleteProfile extends Model
{
    protected $fillable = [
        'user_id',
        'belt_rank',
        'date_of_birth',
        'medical_info',
        'weight_class',
        'last_grading_date',
        'speed',
        'strength',
        'flexibility',
        'kyorugi',
        'poomsae',
        'coach_tip',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
