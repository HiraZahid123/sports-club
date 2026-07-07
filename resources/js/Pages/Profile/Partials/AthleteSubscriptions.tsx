import React, { useState } from 'react';

interface Payment {
    id: number;
    amount: number | string;
    payment_date: string | null;
    payment_method: string | null;
    status: string;
    transaction_id: string | null;
    notes: string | null;
}

interface Subscription {
    id: number;
    plan_name: string;
    amount: number | string;
    billing_cycle: string;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
    next_payment_at: string | null;
    training_group?: {
        name: string;
    } | null;
    payments?: Payment[];
}

export default function AthleteSubscriptions({
    subscriptions = [],
    className = '',
}: {
    subscriptions?: Subscription[];
    className?: string;
}) {
    const [expandedSubscription, setExpandedSubscription] = useState<number | null>(null);

    const togglePayments = (id: number) => {
        setExpandedSubscription(expandedSubscription === id ? null : id);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'unpaid':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'overdue':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">💳</div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            My Subscriptions
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Manage your active training plans and download payment invoices.
                        </p>
                    </div>
                </div>
            </header>

            {subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3">🏷️</div>
                    <p className="text-sm font-semibold text-gray-600">No active subscriptions</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                        You are not registered in any training groups. Join a group below to start training!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map((sub) => {
                        const isExpanded = expandedSubscription === sub.id;
                        const hasPayments = sub.payments && sub.payments.length > 0;

                        return (
                            <div
                                key={sub.id}
                                className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Subscription Info Row */}
                                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h3 className="font-bold text-gray-900 text-base">
                                                {sub.plan_name}
                                            </h3>
                                            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(sub.status)}`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Group: <span className="font-semibold text-gray-700">{sub.training_group?.name ?? 'General'}</span>
                                        </p>
                                    </div>

                                    {/* Price and Cycle */}
                                    <div className="flex items-baseline gap-1 md:text-right">
                                        <span className="text-xl font-black text-indigo-600">€{sub.amount}</span>
                                        <span className="text-xs font-semibold text-gray-400">/{sub.billing_cycle}</span>
                                    </div>

                                    {/* Dates Info */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-right">
                                        <div>
                                            <span className="text-gray-400">Starts:</span>{' '}
                                            <span className="font-semibold text-gray-700">{formatDate(sub.starts_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Ends:</span>{' '}
                                            <span className="font-semibold text-gray-700">{formatDate(sub.ends_at)}</span>
                                        </div>
                                        {sub.status === 'active' && (
                                            <div className="col-span-2">
                                                <span className="text-gray-400">Next Payment:</span>{' '}
                                                <span className="font-semibold text-indigo-600">{formatDate(sub.next_payment_at)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    <button
                                        onClick={() => togglePayments(sub.id)}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2 md:mt-0 transition-colors"
                                    >
                                        {isExpanded ? 'Hide Payments' : 'View Payments'}
                                        <svg
                                            className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Payments Collapse Area */}
                                {isExpanded && (
                                    <div className="border-t border-gray-50 bg-gray-50/50 p-5">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                            Payment & Billing History
                                        </h4>

                                        {!hasPayments ? (
                                            <p className="text-xs text-gray-400 italic">No payments logged yet for this subscription.</p>
                                        ) : (
                                            <div className="overflow-x-auto rounded-xl border border-gray-200/60 bg-white">
                                                <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                                                        <tr>
                                                            <th className="px-4 py-3">Date</th>
                                                            <th className="px-4 py-3">Method</th>
                                                            <th className="px-4 py-3">Amount</th>
                                                            <th className="px-4 py-3">Status</th>
                                                            <th className="px-4 py-3 text-right">Invoice</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {sub.payments?.map((payment) => (
                                                            <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-4 py-3 font-medium text-gray-700">
                                                                    {formatDate(payment.payment_date)}
                                                                </td>
                                                                <td className="px-4 py-3 font-semibold text-gray-500 uppercase">
                                                                    {payment.payment_method ?? 'Admin Log'}
                                                                </td>
                                                                <td className="px-4 py-3 font-bold text-gray-800">
                                                                    €{payment.amount}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                                                        payment.status.toLowerCase() === 'completed'
                                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                                                    }`}>
                                                                        {payment.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    {payment.status.toLowerCase() === 'completed' ? (
                                                                        <a
                                                                            href={route('invoices.download', payment.id)}
                                                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                                                        >
                                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                            </svg>
                                                                            PDF Invoice
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-gray-400 italic">Unavailable</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
