<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'address',
        'phone',
        'email',
        'logo_path',
        'description',
        'settings',
        'is_active',
        'join_code',
        'sport_type',
        'founding_date',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'founding_date' => 'date',
    ];

    public function ageCategories()
    {
        return $this->hasMany(AgeCategory::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }

    /**
     * Get the users (members/staff) for the club.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function invitations()
    {
        return $this->hasMany(\App\Models\ClubInvitation::class);
    }
}
