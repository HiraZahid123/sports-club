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
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the users (members/staff) for the club.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
