<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'club_id',
        'training_group_id',
        'name',
        'monthly_price',
        'yearly_price',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function trainingGroup()
    {
        return $this->belongsTo(TrainingGroup::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
