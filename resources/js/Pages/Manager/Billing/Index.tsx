import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Subscription {
    id: number;
    plan_name: string;
    amount: string;
    status: string;
    user: { name: string };
    next_payment_at: string;
}

export default function BillingIndex({ subscriptions, totalRevenue }: { subscriptions: Subscription[], totalRevenue: number }) {
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
    const { data, setData, post, processing, reset } = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedSub) return;
        post(route('manager.billing.pay', selectedSub.id), {
            onSuccess: () => {
                setSelectedSub(null);
                reset();
            },
        });
    };

    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const overdueCount = subscriptions.filter(s => s.status !== 'active').length;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Billing & Revenue</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track subscriptions, log payments, and monitor club revenue</p>
                </div>
            }
        >
            <Head title="Billing" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wide mb-2">Total Lifetime Revenue</p>
                                    <p className="text-4xl font-black">${totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-xl">💰</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">Active Subscriptions</p>
                                    <p className="text-4xl font-black text-emerald-600">{activeCount}</p>
                                </div>
                                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-xl">✅</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">Overdue / Unpaid</p>
                                    <p className="text-4xl font-black text-amber-600">{overdueCount}</p>
                                </div>
                                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-xl">⚠️</div>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="text-base font-bold text-gray-900">Subscriptions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Member</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Plan</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Next Due</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                        {sub.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 text-sm">{sub.user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{sub.plan_name}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-indigo-600">${sub.amount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                    sub.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : sub.status === 'overdue'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'
                                                    }`}></span>
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{sub.next_payment_at || 'N/A'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => { setSelectedSub(sub); setData('amount', sub.amount); }}
                                                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                >
                                                    Log Payment
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {subscriptions.length === 0 && (
                                <div className="py-14 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">💳</div>
                                    <p className="font-semibold text-gray-900">No subscriptions found</p>
                                    <p className="text-sm text-gray-500 mt-1">Subscriptions will appear here once members are enrolled.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Log Payment Modal */}
            {selectedSub && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">Log Payment</h3>
                            <p className="text-indigo-200 text-sm mt-0.5">Recording payment for {selectedSub.user.name}</p>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Amount Paid ($)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Payment Date</label>
                                <input
                                    type="date"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSub(null)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'Saving...' : 'Save Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
