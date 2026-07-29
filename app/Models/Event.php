<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'club_id',
        'created_by',
        'name',
        'description',
        'location',
        'start_date',
        'end_date',
        'price',
        'stripe_payment_link',
        'points',
        'pdf_path',
        'image_path',
        'event_category_id',
        'coach_salary_type',
        'coach_salary_rate',
    ];

    protected $casts = [
        'start_date'         => 'date',
        'end_date'           => 'date',
        'price'              => 'decimal:2',
        'points'             => 'integer',
        'coach_salary_rate'  => 'decimal:2',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function groups()
    {
        return $this->belongsToMany(TrainingGroup::class, 'event_groups')->withPivot('can_join');
    }

    public function coaches()
    {
        return $this->belongsToMany(User::class, 'event_coaches');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function eventCategory()
    {
        return $this->belongsTo(EventCategory::class);
    }


    public function isFree(): bool
    {
        return is_null($this->price) || $this->price == 0;
    }
}
