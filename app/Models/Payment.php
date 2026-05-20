<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'subscription_id',
        'amount',
        'payment_date',
        'payment_method',
        'status',
        'transaction_id',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
