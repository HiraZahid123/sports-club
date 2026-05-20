import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function ReportsIndex({ revenueData, coaches, recentPayouts }: any) {
    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const { data, setData, post, processing, reset } = useForm({
        user_id: '',
        amount: '',
        payout_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('manager.payouts.store'), {
            onSuccess: () => {
                setSelectedCoach(null);
                reset();
            },
        });
    };

    const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map((d: any) => d.total)) : 1;
    const totalRevenue = revenueData.reduce((sum: number, d: any) => sum + d.total, 0);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Financial Reports & Analytics</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track revenue trends and manage coach compensation</p>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Revenue Trends</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Last 6 months performance</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium">6-Month Total</p>
                                <p className="text-xl font-black text-indigo-600">${totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            {revenueData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <span className="text-3xl mb-2">📊</span>
                                    <p className="text-sm">No revenue data available yet.</p>
                                </div>
                            ) : (
                                <div className="flex items-end gap-3 h-52">
                                    {revenueData.map((d: any, idx: number) => {
                                        const pct = maxRevenue > 0 ? (d.total / maxRevenue) * 100 : 0;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center group">
                                                <div className="relative w-full flex flex-col items-center">
                                                    <span className="mb-1 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        ${d.total.toLocaleString()}
                                                    </span>
                                                    <div
                                                        className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-300 cursor-pointer"
                                                        style={{ height: `${Math.max(pct * 1.8, 6)}px` }}
                                                    ></div>
                                                </div>
                                                <span className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">{d.month}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coach Compensation + Payout History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Coach Compensation */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="text-base font-bold text-gray-900">Coach Compensation</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Manage coach payouts</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {coaches.map((coach: any) => (
                                    <div key={coach.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center font-bold text-indigo-700 text-sm border border-indigo-100">
                                                {coach.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                                                <p className="text-xs text-gray-400">{coach.training_groups.length} group{coach.training_groups.length !== 1 ? 's' : ''} assigned</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedCoach(coach); setData('user_id', coach.id); }}
                                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                                        >
                                            Pay Coach
                                        </button>
                                    </div>
                                ))}
                                {coaches.length === 0 && (
                                    <div className="py-10 text-center text-gray-400">
                                        <p className="text-sm">No coaches found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Payouts */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="text-base font-bold text-gray-900">Recent Payouts</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Coach payment history</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentPayouts.map((payout: any) => (
                                    <div key={payout.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center font-bold text-rose-600 text-sm">
                                                {payout.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{payout.user.name}</p>
                                                <p className="text-xs text-gray-400">{payout.payout_date}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-rose-600">−${payout.amount}</span>
                                    </div>
                                ))}
                                {recentPayouts.length === 0 && (
                                    <div className="py-10 text-center text-gray-400">
                                        <p className="text-sm">No payout history found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Pay Coach Modal */}
            {selectedCoach && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">Pay Coach</h3>
                            <p className="text-indigo-200 text-sm mt-0.5">Recording payout for {selectedCoach.name}</p>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Payout Amount ($)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Payout Date</label>
                                <input
                                    type="date"
                                    value={data.payout_date}
                                    onChange={(e) => setData('payout_date', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCoach(null)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'Recording...' : 'Record Payout'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
