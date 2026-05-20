<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'secondary_phone',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
