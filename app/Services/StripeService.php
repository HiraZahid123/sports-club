<?php

namespace App\Services;

use App\Models\Subscription;
use Stripe\StripeClient;

class StripeService
{
    protected ?StripeClient $client = null;

    public function __construct()
    {
        $secret = config('services.stripe.secret');
        if (!empty($secret)) {
            $this->client = new StripeClient($secret);
        }
    }

    /**
     * Create a Stripe Checkout Session.
     *
     * @param Subscription $subscription
     * @return object
     * @throws \Exception
     */
    public function createCheckoutSession(Subscription $subscription): object
    {
        if (!$this->client) {
            throw new \Exception('Stripe payment gateway is not configured.');
        }

        return $this->client->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $subscription->plan_name,
                        'description' => 'Subscription payment for ' . ($subscription->user->name ?? 'member'),
                    ],
                    'unit_amount' => (int) round($subscription->amount * 100), // in cents
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('parent.billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('parent.billing'),
            'metadata' => [
                'subscription_id' => $subscription->id,
            ],
        ]);
    }

    /**
     * Retrieve a Stripe Checkout Session.
     *
     * @param string $sessionId
     * @return object
     * @throws \Exception
     */
    public function retrieveCheckoutSession(string $sessionId): object
    {
        if (!$this->client) {
            throw new \Exception('Stripe payment gateway is not configured.');
        }

        return $this->client->checkout->sessions->retrieve($sessionId);
    }
}
