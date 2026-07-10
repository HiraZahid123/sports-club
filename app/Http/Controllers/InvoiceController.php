<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Gate;

class InvoiceController extends Controller
{
    /**
     * Generate and download the PDF invoice for a given payment.
     */
    public function download(Request $request, Payment $payment)
    {
        $user = $request->user();

        // Load subscription, user, club, trainingGroup, plan
        $payment->load(['subscription.user', 'subscription.club', 'subscription.trainingGroup', 'subscription.plan']);
        $subscription = $payment->subscription;

        if (!$subscription) {
            abort(404, 'Subscription not found.');
        }

        // Authorize: check if user owns the subscription, or is the parent, or is a manager/admin of the club
        $isOwner = $subscription->user_id == $user->id;
        $isParent = $user->hasRole('Parent') && $user->children()->where('users.id', $subscription->user_id)->exists();
        $isManager = ($user->hasRole('Manager') || $user->hasRole('Super Admin')) && $subscription->club_id == $user->club_id;

        if (!$isOwner && !$isParent && !$isManager) {
            abort(403, 'Unauthorized to view this invoice.');
        }

        // Generate the PDF using clean, table-based HTML
        $clubName = $subscription->club->name ?? 'Sports Club';
        $clubEmail = $subscription->club->email ?? '';
        $clubPhone = $subscription->club->phone ?? '';
        $clubAddress = $subscription->club->address ?? '';

        $athleteName = $subscription->user->name ?? 'N/A';
        $athleteEmail = $subscription->user->email ?? 'N/A';
        $athletePhone = $subscription->user->phone ?? 'N/A';

        $invoiceId = str_pad($payment->id, 6, '0', STR_PAD_LEFT);
        
        $paymentDateVal = $payment->payment_date;
        if ($paymentDateVal instanceof \Carbon\Carbon) {
            $paymentDate = $paymentDateVal->format('F d, Y');
        } elseif (is_string($paymentDateVal)) {
            $paymentDate = \Carbon\Carbon::parse($paymentDateVal)->format('F d, Y');
        } else {
            $paymentDate = now()->format('F d, Y');
        }
        
        $amount = number_format($payment->amount, 2);
        $planName = $subscription->plan_name ?? $subscription->plan->name ?? 'Training Plan';
        $groupName = $subscription->trainingGroup->name ?? 'General Group';
        $billingCycle = ucfirst($subscription->billing_cycle ?? '');
        $transactionId = $payment->transaction_id ?? 'N/A';
        $paymentMethod = strtoupper($payment->payment_method ?? 'N/A');

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{$invoiceId}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            vertical-align: top;
        }
        .header {
            margin-bottom: 40px;
            border-bottom: 2px solid #eef2f6;
            padding-bottom: 20px;
        }
        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
        }
        .invoice-title {
            font-size: 28px;
            font-weight: 800;
            text-align: right;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-section {
            margin-bottom: 30px;
        }
        .info-title {
            font-size: 12px;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .info-content {
            color: #334155;
        }
        .details-table {
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .details-table th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 12px;
            font-weight: bold;
            text-align: left;
            padding: 12px 16px;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
        }
        .details-table td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
        }
        .totals-section {
            margin-top: 20px;
            text-align: right;
        }
        .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #4f46e5;
        }
        .footer {
            margin-top: 60px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #d1fae5;
            color: #065f46;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <table>
                <tr>
                    <td>
                        <span class="logo-text">{$clubName}</span>
                        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                            {$clubAddress}<br>
                            Phone: {$clubPhone}<br>
                            Email: {$clubEmail}
                        </div>
                    </td>
                    <td style="text-align: right;">
                        <span class="invoice-title">Invoice</span>
                        <div style="margin-top: 10px; font-size: 13px; color: #475569;">
                            <strong>Invoice No:</strong> #{$invoiceId}<br>
                            <strong>Date:</strong> {$paymentDate}<br>
                            <strong>Status:</strong> <span class="badge">Paid</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Info Section -->
        <div class="info-section">
            <table style="margin-bottom: 20px;">
                <tr>
                    <td style="width: 50%;">
                        <div class="info-title">Bill To:</div>
                        <div class="info-content">
                            <strong>{$athleteName}</strong><br>
                            Email: {$athleteEmail}<br>
                            Phone: {$athletePhone}
                        </div>
                    </td>
                    <td style="width: 50%;">
                        <div class="info-title">Payment Method:</div>
                        <div class="info-content">
                            <strong>{$paymentMethod}</strong><br>
                            Transaction ID: {$transactionId}<br>
                            Billing Cycle: {$billingCycle}
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Details Table -->
        <table class="details-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right; width: 150px;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>{$planName}</strong><br>
                        <span style="font-size: 12px; color: #64748b;">Training Group: {$groupName} ({$billingCycle} subscription)</span>
                    </td>
                    <td style="text-align: right; font-weight: bold;">
                        €{$amount}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <table style="width: 300px; margin-left: auto;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b;">Subtotal:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 500;">€{$amount}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 12px;">Total:</td>
                    <td style="padding: 8px 0; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 12px;" class="total-amount">€{$amount}</td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            Thank you for being a valued member of {$clubName}!<br>
            If you have any questions about this invoice, please contact support at {$clubEmail}.
        </div>
    </div>
</body>
</html>
HTML;

        // Render PDF
        $pdf = Pdf::loadHTML($html);
        return $pdf->download("Invoice-{$invoiceId}.pdf");
    }
}
