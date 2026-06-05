import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

const paymentTypeBadges: Record<string, string> = {
    'Per Athlete':  'bg-blue-50 text-blue-700 border-blue-100',
    'Hourly Rate':  'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Fixed Amount': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Monthly Salary': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Per Session':    'bg-purple-50 text-purple-700 border-purple-100',
    'Commission':     'bg-amber-50 text-amber-700 border-amber-100',
    'Bonus':          'bg-rose-50 text-rose-700 border-rose-100',
};

export default function ReportsIndex({ revenueData, coaches, recentPayouts }: any) {
    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const { data, setData, post, processing, reset } = useForm({
        user_id: '',
        amount: '',
        payout_date: new Date().toISOString().split('T')[0],
        payment_type: 'Fixed Amount',
        notes: '',
    });

    const [calcOption, setCalcOption] = useState<'athlete' | 'hourly' | 'manual'>('manual');
    const [pricePerAthlete, setPricePerAthlete] = useState('10');
    const [pricePerHour, setPricePerHour] = useState('');
    const [numberOfWeeks, setNumberOfWeeks] = useState('4');

    const selectCoachForPayment = (coach: any) => {
        setSelectedCoach(coach);
        setData({
            user_id: coach.id,
            amount: '',
            payout_date: new Date().toISOString().split('T')[0],
            payment_type: 'Fixed Amount',
            notes: '',
        });
        setCalcOption('manual');
        const rate = (coach.coach_profile || coach.coachProfile)?.hourly_rate || '25';
        setPricePerHour(rate.toString());
    };

    const groups = selectedCoach?.training_groups || [];
    const allAthletes = groups.flatMap((g: any) => g.athletes || []);
    const uniqueAthleteIds = new Set(allAthletes.map((a: any) => a.id));
    const athleteCount = uniqueAthleteIds.size;

    let totalWeeklyMinutes = 0;
    let totalClassesCount = 0;
    groups.forEach((g: any) => {
        const schedules = g.schedules || [];
        schedules.forEach((s: any) => {
            totalClassesCount++;
            const [sh, sm] = s.start_time.split(':').map(Number);
            const [eh, em] = s.end_time.split(':').map(Number);
            const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
            if (durationMinutes > 0) {
                totalWeeklyMinutes += durationMinutes;
            }
        });
    });
    const totalWeeklyHours = totalWeeklyMinutes / 60;

    useEffect(() => {
        if (!selectedCoach) return;

        if (calcOption === 'athlete') {
            const amt = athleteCount * (parseFloat(pricePerAthlete) || 0);
            setData(d => ({ ...d, payment_type: 'Per Athlete', amount: amt > 0 ? amt.toFixed(2) : '' }));
        } else if (calcOption === 'hourly') {
            const amt = totalWeeklyHours * (parseFloat(pricePerHour) || 0) * (parseFloat(numberOfWeeks) || 0);
            setData(d => ({ ...d, payment_type: 'Hourly Rate', amount: amt > 0 ? amt.toFixed(2) : '' }));
        } else {
            setData(d => ({ ...d, payment_type: 'Fixed Amount' }));
        }
    }, [calcOption, pricePerAthlete, pricePerHour, numberOfWeeks, selectedCoach, athleteCount, totalWeeklyHours]);

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
                                            onClick={() => selectCoachForPayment(coach)}
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
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 text-sm">{payout.user.name}</p>
                                                    {payout.payment_type && (
                                                        <span className={`inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${paymentTypeBadges[payout.payment_type] || 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                                                            {payout.payment_type}
                                                        </span>
                                                    )}
                                                </div>
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
                            {/* Option Selector Tabs */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Compensation Method</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        key="athlete"
                                        type="button"
                                        onClick={() => setCalcOption('athlete')}
                                        className={`px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${
                                            calcOption === 'athlete'
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-base">👤</span>
                                        <span>Per Athlete</span>
                                    </button>
                                    <button
                                        key="hourly"
                                        type="button"
                                        onClick={() => setCalcOption('hourly')}
                                        className={`px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${
                                            calcOption === 'hourly'
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-base">⏱️</span>
                                        <span>Per Hour</span>
                                    </button>
                                    <button
                                        key="manual"
                                        type="button"
                                        onClick={() => setCalcOption('manual')}
                                        className={`px-2 py-3 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 leading-tight ${
                                            calcOption === 'manual'
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-base">💰</span>
                                        <span>Fixed Amount</span>
                                    </button>
                                </div>
                            </div>

                            {/* Calculator inputs */}
                            {calcOption === 'athlete' && (
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-indigo-900">
                                        <span className="font-semibold">Athletes in Training Groups:</span>
                                        <span className="font-black bg-indigo-100 px-2 py-0.5 rounded-lg">{athleteCount} Athletes</span>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wide mb-1">Price per Athlete (€)</label>
                                        <input
                                            type="number"
                                            value={pricePerAthlete}
                                            onChange={(e) => setPricePerAthlete(e.target.value)}
                                            placeholder="10.00"
                                            className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="text-xs font-bold text-indigo-800 pt-1 flex justify-between border-t border-indigo-100/50">
                                        <span>Calculation formula:</span>
                                        <span>{athleteCount} athletes × €{Number(pricePerAthlete || 0).toFixed(2)} = €{data.amount || '0.00'}</span>
                                    </div>
                                </div>
                            )}

                            {calcOption === 'hourly' && (
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                                    <div className="text-xs text-emerald-900 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Weekly Scheduled Classes:</span>
                                            <span className="font-black bg-emerald-100 px-2 py-0.5 rounded-lg">{totalClassesCount} Classes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Total Weekly Hours:</span>
                                            <span className="font-black bg-emerald-100 px-2 py-0.5 rounded-lg">{totalWeeklyHours.toFixed(2)} Hrs</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Price per Hour (€)</label>
                                            <input
                                                type="number"
                                                value={pricePerHour}
                                                onChange={(e) => setPricePerHour(e.target.value)}
                                                placeholder="25.00"
                                                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Number of Weeks</label>
                                            <input
                                                type="number"
                                                value={numberOfWeeks}
                                                onChange={(e) => setNumberOfWeeks(e.target.value)}
                                                placeholder="4"
                                                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-emerald-800 pt-1 flex flex-col gap-1 border-t border-emerald-100/50">
                                        <div className="flex justify-between">
                                            <span>Calculation formula:</span>
                                            <span>{totalWeeklyHours.toFixed(2)} hrs × €{Number(pricePerHour || 0).toFixed(2)}/hr × {numberOfWeeks} wks</span>
                                        </div>
                                        <div className="text-right text-sm font-black text-emerald-900">
                                            Total: €{data.amount || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Payout Amount ($)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    readOnly={calcOption !== 'manual'}
                                    placeholder="0.00"
                                    className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                                        calcOption !== 'manual'
                                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed focus:ring-0'
                                            : 'bg-gray-50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/20'
                                    }`}
                                />
                                {calcOption !== 'manual' && (
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Calculated automatically based on option selected above.</p>
                                )}
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
