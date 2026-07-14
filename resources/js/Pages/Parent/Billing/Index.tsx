import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Check with manager';
    try {
        const dateOnly = dateStr.split('T')[0];
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export default function ParentBilling({ mySubscriptions, childrenSubscriptions }: { mySubscriptions: any[], childrenSubscriptions: any[] }) {
    const { flash }: any = usePage().props;
    const isLocked = flash?.error === 'access-locked';
    const allSubscriptions = [...mySubscriptions, ...childrenSubscriptions];
    
    const [loadingSubId, setLoadingSubId] = useState<number | null>(null);

    // Aggregate real payments from all subscriptions
    const paymentsList = allSubscriptions.reduce((acc: any[], sub: any) => {
        if (sub.payments) {
            const subPayments = sub.payments.map((p: any) => ({
                ...p,
                plan_name: sub.plan_name,
                member_name: sub.user?.name || 'Member',
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
        router.post(route('parent.billing.checkout', { subscription: subId }), {}, {
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
                    <p className="text-sm text-gray-500 mt-0.5">Manage family subscriptions and view payment history</p>
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
                    {flash?.error && !isLocked && (
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

                    {/* Access Locked Alert */}
                    {isLocked && (
                        <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
                            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🔒</div>
                            <div>
                                <h4 className="font-bold text-red-900 text-sm">Account Access Restricted</h4>
                                <p className="text-sm text-red-700 mt-1 leading-relaxed">
                                    Your dashboard access has been restricted due to outstanding payments. Please settle your dues below to restore full access.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Subscriptions */}
                        <div className="lg:col-span-3 space-y-5">
                            <h3 className="text-base font-bold text-gray-900">Family Subscriptions</h3>

                            {allSubscriptions.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">💳</div>
                                    <p className="text-sm font-medium text-gray-500">No active subscriptions found.</p>
                                </div>
                            ) : (
                                allSubscriptions.map((sub, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{sub.user.name}'s Plan</p>
                                                    <h4 className="text-lg font-bold text-gray-900">{sub.plan_name}</h4>
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
                                                </div>
                                            </div>
                                        </div>

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
                                                        {payment.member_name} • {new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <span className="font-black text-sm text-emerald-600">+€{parseFloat(payment.amount).toFixed(2)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="px-6 py-3.5 bg-slate-50 border-t border-gray-100 text-center">
                                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View Full History</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
