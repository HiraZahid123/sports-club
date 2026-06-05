<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Models\AthleteProfile;
use App\Models\ParentProfile;
use App\Models\TrainingGroup;
use App\Models\Subscription;
use App\Models\CoachProfile;
use App\Models\CoachPayout;


class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'club_id',
        'id_code',
        'phone',
        'city',
        'emergency_contact_name',
        'emergency_contact_phone',
        'profile_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the athlete profile associated with the user.
     */
    public function athleteProfile()
    {
        return $this->hasOne(AthleteProfile::class);
    }

    /**
     * Get the parent profile associated with the user.
     */
    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class);
    }

    /**
     * Get the children associated with this user (if they are a parent).
     */
    public function children()
    {
        return $this->belongsToMany(User::class, 'athlete_parent', 'parent_id', 'athlete_id')->withPivot('relationship');
    }

    /**
     * Get the parents associated with this user (if they are an athlete).
     */
    public function parents()
    {
        return $this->belongsToMany(User::class, 'athlete_parent', 'athlete_id', 'parent_id')->withPivot('relationship');
    }

    /**
     * Get the club the user belongs to.
     */
    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Get the training groups the user is assigned to.
     */
    public function trainingGroups()
    {
        return $this->belongsToMany(TrainingGroup::class, 'training_group_user')
            ->withPivot('role_in_group')
            ->withTimestamps();
    }
    /**
     * Get the subscriptions for the user.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Check if the user has an active, paid subscription.
     */
    public function isPaid(): bool
    {
        // For Managers/Coaches/Admins, we assume they are always "paid" for access
        if ($this->hasRole(['Manager', 'Super Admin', 'Coach'])) {
            return true;
        }

        if ($this->hasRole('Parent')) {
            $childrenIds = $this->children()->pluck('athlete_id');

            if ($childrenIds->isEmpty()) {
                return true;
            }

            return !Subscription::whereIn('user_id', $childrenIds)
                ->where('status', '!=', 'active')
                ->exists();
        }

        return $this->subscriptions()
            ->where('status', 'active')
            ->exists();
    }
    /**
     * Get the coach profile associated with the user.
     */
    public function coachProfile()
    {
        return $this->hasOne(CoachProfile::class);
    }

    /**
     * Get the payouts for the coach.
     */
    public function coachPayouts()
    {
        return $this->hasMany(CoachPayout::class);
    }
}
