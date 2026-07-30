import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Check with manager';
    try {
        const dateOnly = dateStr.split('T')[0];
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
            return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
};

export default function AthleteBilling({ subscriptions }: { subscriptions: any[] }) {
    const { flash }: any = usePage().props;
    const [loadingSubId, setLoadingSubId] = useState<number | null>(null);

    // Aggregate real payments from athlete's subscriptions
    const paymentsList = subscriptions.reduce((acc: any[], sub: any) => {
        if (sub.payments) {
            const subPayments = sub.payments.map((p: any) => ({
                ...p,
                plan_name: sub.plan ? sub.plan.name : (sub.plan_name || 'Subscription'),
            }));
            return [...acc, ...subPayments];
        }
        return acc;
    }, []);

    // Sort by payment date descending
    const sortedPayments = paymentsList.sort((a: any, b: any) => {
        return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
    });

    const handlePayNow = (subId: number) => {
        setLoadingSubId(subId);
        router.post(route('athlete.checkout', { subscription: subId }), {}, {
            onError: () => {
                setLoadingSubId(null);
            },
            onFinish: () => {
                setLoadingSubId(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Billing & Payments</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your subscription plans and view your payment history</p>
                </div>
            }
        >
            <Head title="My Billing" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Success Alert */}
                    {flash?.success && (
                        <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm transition-all duration-300">
                            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl shrink-0">✅</div>
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm">Payment Successful</h4>
                                <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {flash?.error && (
                        <div className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm transition-all duration-300">
                            <div className="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center text-2xl shrink-0">⚠️</div>
                            <div>
                                <h4 className="font-bold text-rose-900 text-sm">Payment Failed</h4>
                                <p className="text-sm text-rose-700 mt-1 leading-relaxed">
                                    {flash.error}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Subscriptions */}
                        <div className="lg:col-span-3 space-y-5">
                            <h3 className="text-base font-bold text-gray-900">My Subscriptions</h3>

                            {subscriptions.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">💳</div>
                                    <p className="text-sm font-medium text-gray-500">No active subscriptions found.</p>
                                </div>
                            ) : (
                                subscriptions.map((sub, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Subscription Plan</p>
                                                    <h4 className="text-lg font-bold text-gray-900">{sub.plan ? sub.plan.name : sub.plan_name}</h4>
                                                    {sub.training_group && (
                                                        <p className="text-xs text-gray-400 mt-0.5">{sub.training_group.name}</p>
                                                    )}
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    sub.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Next Payment Due</p>
                                                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{formatDate(sub.next_payment_at)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 font-medium">Amount</p>
                                                    <p className="text-3xl font-black text-indigo-600 leading-none mt-0.5">€{sub.amount}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 capitalize">{sub.billing_cycle}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {(sub.status === 'unpaid' || sub.status === 'overdue') && (
                                            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100">
                                                <button
                                                    onClick={() => handlePayNow(sub.id)}
                                                    disabled={loadingSubId !== null}
                                                    className={`w-full py-3 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                                                        loadingSubId === sub.id
                                                            ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                                                            : loadingSubId !== null
                                                            ? 'bg-indigo-300 cursor-not-allowed shadow-none'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                                    }`}
                                                >
                                                    {loadingSubId === sub.id ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Redirecting to Stripe...
                                                        </>
                                                    ) : (
                                                        'Pay Now via Portal'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Payment History */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50">
                                    <h3 className="text-base font-bold text-gray-900">Payment History</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Your recent transactions</p>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {sortedPayments.length === 0 ? (
                                        <div className="py-8 text-center text-sm font-medium text-gray-500">
                                            No payment history found.
                                        </div>
                                    ) : (
                                        sortedPayments.map((payment, i) => (
                                            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{payment.plan_name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {formatDate(payment.payment_date)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-sm text-emerald-600">+€{parseFloat(payment.amount).toFixed(2)}</span>
                                                    <a
                                                        href={route('invoices.download', payment.id)}
                                                        className="p-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                                                        title="Download Invoice"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
