import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface CoachProfile {
    specialization?: string | null;
    bio?: string | null;
    payment_option?: 'athlete' | 'hourly' | 'manual' | null;
    payment_rate?: number | null;
    hourly_rate?: number | null;
}

interface Schedule {
    day_of_week: string;
    start_time: string;
    end_time: string;
}

interface TrainingGroup {
    id: number;
    name: string;
    athletes: { id: number }[];
    schedules: Schedule[];
}

interface Payout {
    id: number;
    amount: string | number;
    tip: string | number;
    payout_date: string;
    status: string;
    notes?: string | null;
    payment_type?: string | null;
}

interface Coach {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    coach_profile?: CoachProfile | null;
    training_groups: TrainingGroup[];
    coach_payouts?: Payout[];
}

const OPTION_META = {
    athlete: { icon: '👤', label: 'Per Athlete',          color: 'bg-blue-50 text-blue-700 border-blue-100' },
    hourly:  { icon: '⏱️', label: 'Per Hour (Schedule)',  color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    manual:  { icon: '💰', label: 'Fixed / Manual',       color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
};

function getCoachStats(coach: Coach) {
    const groups = coach.training_groups || [];
    const allAthletes = groups.flatMap((g) => g.athletes || []);
    const athleteCount = new Set(allAthletes.map((a) => a.id)).size;

    let totalWeeklyMinutes = 0;
    let totalClassesCount = 0;
    groups.forEach((g) => {
        (g.schedules || []).forEach((s) => {
            totalClassesCount++;
            const [sh, sm] = s.start_time.split(':').map(Number);
            const [eh, em] = s.end_time.split(':').map(Number);
            const mins = (eh * 60 + em) - (sh * 60 + sm);
            if (mins > 0) totalWeeklyMinutes += mins;
        });
    });

    return { athleteCount, totalClassesCount, weeklyHours: totalWeeklyMinutes / 60, groupCount: groups.length };
}

function calcEarning(coach: Coach) {
    const profile = coach.coach_profile;
    if (!profile?.payment_option || !profile?.payment_rate) return null;
    const { athleteCount, weeklyHours } = getCoachStats(coach);
    const rate = Number(profile.payment_rate);
    if (profile.payment_option === 'athlete') return athleteCount * rate;
    if (profile.payment_option === 'hourly') return weeklyHours * rate * 4;
    if (profile.payment_option === 'manual') return rate;
    return null;
}

export default function CoachesIndex({ coaches }: { coaches: Coach[] }) {
    const [editing, setEditing] = useState<Coach | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'salary' | 'payouts'>('info');
    const [showInviteCoach, setShowInviteCoach] = useState(false);

    const inviteForm = useForm({ email: '', payment_option: 'manual', payment_rate: '0' });

    const submitInvite: FormEventHandler = (e) => {
        e.preventDefault();
        inviteForm.post(route('manager.invitations.coach'), {
            onSuccess: () => {
                setShowInviteCoach(false);
                inviteForm.reset();
            },
        });
    };

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        specialization: '',
        bio: '',
        payment_option: 'manual' as 'athlete' | 'hourly' | 'manual',
        payment_rate: '0',
    });

    const openEdit = (coach: Coach) => {
        const p = coach.coach_profile;
        setData({
            name:            coach.name,
            email:           coach.email,
            phone:           coach.phone ?? '',
            city:            coach.city ?? '',
            specialization:  p?.specialization ?? '',
            bio:             p?.bio ?? '',
            payment_option:  (p?.payment_option as any) ?? 'manual',
            payment_rate:    (p?.payment_rate ?? 0).toString(),
        });
        clearErrors();
        setEditing(coach);
        setActiveTab('info');
    };

    const closeEdit = () => {
        setEditing(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('manager.coaches.update', editing!.id), { onSuccess: closeEdit });
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';
    const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Coach Management</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {coaches.length} coach{coaches.length !== 1 ? 'es' : ''} — edit info and configure salary / revenue options
                        </p>
                    </div>
                    <button
                        onClick={() => setShowInviteCoach(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Invite Coach
                    </button>
                </div>
            }
        >
            <Head title="Coaches" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Info banner */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                        <span className="text-indigo-400 text-lg mt-0.5">ℹ️</span>
                        <div className="text-sm text-indigo-800">
                            <span className="font-bold">Three salary options available:</span>{' '}
                            <span className="font-semibold">Option 1</span> — Per Athlete × EUR (counts athletes in coach's groups) ·{' '}
                            <span className="font-semibold">Option 2</span> — EUR Per Hour × monthly hours (weekly schedule × 4 weeks) ·{' '}
                            <span className="font-semibold">Option 3</span> — Manager writes the amount manually each payout. Changes take effect immediately.
                        </div>
                    </div>

                    {/* Coaches Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Coach</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Specialization</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Groups / Athletes</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Weekly Hours</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Salary Option</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Est. Earning / Month</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {coaches.map((coach) => {
                                        const p = coach.coach_profile;
                                        const opt = (p?.payment_option as keyof typeof OPTION_META) ?? 'manual';
                                        const meta = OPTION_META[opt] ?? OPTION_META.manual;
                                        const stats = getCoachStats(coach);
                                        const earning = calcEarning(coach);

                                        return (
                                            <tr key={coach.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center font-bold text-amber-700 text-sm border border-amber-100 shrink-0">
                                                            {coach.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                                                            <p className="text-xs text-gray-400">{coach.email}</p>
                                                            {coach.phone && <p className="text-xs text-gray-400">{coach.phone}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {p?.specialization || <span className="text-gray-300 italic">—</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700 font-medium">{stats.groupCount} group{stats.groupCount !== 1 ? 's' : ''}</div>
                                                    <div className="text-xs text-gray-400">{stats.athleteCount} athlete{stats.athleteCount !== 1 ? 's' : ''}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700 font-medium">{stats.weeklyHours.toFixed(1)} hrs</div>
                                                    <div className="text-xs text-gray-400">{stats.totalClassesCount} class{stats.totalClassesCount !== 1 ? 'es' : ''}/wk</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.color}`}>
                                                        <span>{meta.icon}</span>
                                                        <span>{meta.label}</span>
                                                    </div>
                                                    {p?.payment_rate && p.payment_rate > 0 && opt !== 'manual' && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            €{Number(p.payment_rate).toFixed(2)}{opt === 'athlete' ? ' / athlete' : ' / hr'}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {earning !== null ? (
                                                        <span className="text-sm font-bold text-emerald-600">€{earning.toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">Set manually</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openEdit(coach)}
                                                        className="px-4 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {coaches.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏋️</div>
                                    <p className="font-semibold text-gray-900 mb-1">No coaches yet</p>
                                    <p className="text-sm text-gray-500">Invite a coach from the Members page to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Edit Coach Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl overflow-hidden max-h-screen sm:max-h-[90vh] flex flex-col">

                        {/* Modal header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-white">Edit Coach</h3>
                                <p className="text-indigo-200 text-sm mt-0.5">{editing.name}</p>
                            </div>
                            <button onClick={closeEdit} className="text-indigo-200 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'info' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Coach Information
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('salary')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'salary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Salary & Revenue
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('payouts')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'payouts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Payout History
                            </button>
                        </div>

                        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto flex-1 p-6 space-y-5">

                                {/* TAB: Coach Info */}
                                {activeTab === 'info' && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Full Name</label>
                                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} placeholder="Coach Name" />
                                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Email Address</label>
                                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} placeholder="email@example.com" />
                                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Phone</label>
                                                <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} placeholder="+1 555 000 0000" />
                                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                            </div>
                                            <div>
                                                <label className={labelClass}>City</label>
                                                <input type="text" value={data.city} onChange={(e) => setData('city', e.target.value)} className={inputClass} placeholder="e.g. London" />
                                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Specialization</label>
                                            <input type="text" value={data.specialization} onChange={(e) => setData('specialization', e.target.value)} className={inputClass} placeholder="e.g. Judo, Strength & Conditioning" />
                                            {errors.specialization && <p className="mt-1 text-xs text-red-600">{errors.specialization}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Bio</label>
                                            <textarea
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                rows={3}
                                                className={inputClass + ' resize-none'}
                                                placeholder="Short bio about the coach..."
                                            />
                                            {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio}</p>}
                                        </div>
                                    </>
                                )}

                                {/* TAB: Salary & Revenue */}
                                {activeTab === 'salary' && (
                                    <>
                                        {/* Live stats for this coach */}
                                        {(() => {
                                            const stats = getCoachStats(editing);
                                            return (
                                                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <p className="text-2xl font-black text-gray-800">{stats.athleteCount}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">Athletes</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black text-gray-800">{stats.totalClassesCount}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">Classes / Week</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black text-gray-800">{stats.weeklyHours.toFixed(1)}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">Hours / Week</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Option picker */}
                                        <div>
                                            <label className={labelClass}>Revenue / Salary Option</label>
                                            <div className="space-y-2">
                                                {[
                                                    {
                                                        value: 'athlete' as const,
                                                        icon: '👤',
                                                        title: 'Option 1 — Per Athlete × EUR',
                                                        desc: 'Manager sets price per 1 athlete. System multiplies by number of athletes in coach\'s training groups.',
                                                    },
                                                    {
                                                        value: 'hourly' as const,
                                                        icon: '⏱️',
                                                        title: 'Option 2 — EUR Per Hour (Training Schedule)',
                                                        desc: 'System counts weekly class hours × 4 weeks. Manager sets the hourly price. Result is monthly salary.',
                                                    },
                                                    {
                                                        value: 'manual' as const,
                                                        icon: '💰',
                                                        title: 'Option 3 — Manager Sets Amount',
                                                        desc: 'Manager manually enters the payout amount each time. No automatic calculation.',
                                                    },
                                                ].map((opt) => (
                                                    <label
                                                        key={opt.value}
                                                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                                            data.payment_option === opt.value
                                                                ? 'border-indigo-600 bg-indigo-50/30'
                                                                : 'border-gray-200 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="payment_option"
                                                            value={opt.value}
                                                            checked={data.payment_option === opt.value}
                                                            onChange={() => setData('payment_option', opt.value)}
                                                            className="mt-1 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-xl leading-none mt-0.5">{opt.icon}</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{opt.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.payment_option && <p className="mt-1 text-xs text-red-600">{errors.payment_option}</p>}
                                        </div>

                                        {/* Rate input */}
                                        <div>
                                            <label className={labelClass}>
                                                {data.payment_option === 'athlete' && 'Price per Athlete (€)'}
                                                {data.payment_option === 'hourly'  && 'Price per Hour (€)'}
                                                {data.payment_option === 'manual'  && 'Default Amount (€) — optional, manager can override'}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.payment_rate}
                                                onChange={(e) => setData('payment_rate', e.target.value)}
                                                placeholder="0.00"
                                                className={inputClass}
                                            />
                                            {errors.payment_rate && <p className="mt-1 text-xs text-red-600">{errors.payment_rate}</p>}
                                        </div>

                                        {/* Earnings preview */}
                                        {data.payment_option !== 'manual' && Number(data.payment_rate) > 0 && (
                                            <div className={`rounded-2xl p-4 border ${data.payment_option === 'athlete' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                                <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${data.payment_option === 'athlete' ? 'text-blue-700' : 'text-emerald-700'}`}>
                                                    Estimated Earnings Preview
                                                </p>
                                                {data.payment_option === 'athlete' && (() => {
                                                    const stats = getCoachStats(editing);
                                                    const total = stats.athleteCount * Number(data.payment_rate);
                                                    return (
                                                        <div className="text-sm text-blue-900 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Athletes in groups:</span>
                                                                <span className="font-bold">{stats.athleteCount}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>× Rate per athlete:</span>
                                                                <span className="font-bold">€{Number(data.payment_rate).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between border-t border-blue-200 pt-1 font-black text-base">
                                                                <span>Total:</span>
                                                                <span className="text-blue-700">€{total.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                                {data.payment_option === 'hourly' && (() => {
                                                    const stats = getCoachStats(editing);
                                                    const totalPerMonth = stats.weeklyHours * Number(data.payment_rate) * 4;
                                                    return (
                                                        <div className="text-sm text-emerald-900 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Weekly hours:</span>
                                                                <span className="font-bold">{stats.weeklyHours.toFixed(2)} hrs</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>× Rate per hour:</span>
                                                                <span className="font-bold">€{Number(data.payment_rate).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>× 4 weeks / month:</span>
                                                                <span className="font-bold">4</span>
                                                            </div>
                                                            <div className="flex justify-between border-t border-emerald-200 pt-1 font-black text-base">
                                                                <span>Monthly total:</span>
                                                                <span className="text-emerald-700">€{totalPerMonth.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeTab === 'payouts' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                            <h4 className="text-sm font-bold text-gray-900">Payout History</h4>
                                            <span className="text-xs text-gray-500 font-medium">{(editing.coach_payouts || []).length} payout(s)</span>
                                        </div>

                                        <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-1">
                                            {(editing.coach_payouts || []).map((payout) => (
                                                <div key={payout.id} className="py-3 flex items-center justify-between text-sm">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-950">
                                                                €{Number(payout.amount).toFixed(2)}
                                                            </p>
                                                            {payout.payment_type && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                                                    {payout.payment_type}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(payout.payout_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            {payout.tip && parseFloat(payout.tip.toString()) > 0 && (
                                                                <span className="text-amber-600 font-semibold ml-2">
                                                                    (incl. €{parseFloat(payout.tip.toString()).toFixed(2)} tip)
                                                                </span>
                                                            )}
                                                        </p>
                                                        {payout.notes && (
                                                            <p className="text-xs text-gray-500 italic mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                                                Note: {payout.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                                                        Paid
                                                    </span>
                                                </div>
                                            ))}
                                            {(!editing.coach_payouts || editing.coach_payouts.length === 0) && (
                                                <div className="py-8 text-center text-gray-400 text-xs italic">
                                                    No payout recorded for this coach yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal footer */}
                            <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex gap-3">
                                {activeTab === 'payouts' ? (
                                    <button
                                        type="button"
                                        onClick={closeEdit}
                                        className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                    >
                                        Close
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={closeEdit}
                                            className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {processing ? 'Saving…' : 'Save Coach'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Coach Modal */}
            {showInviteCoach && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-amber-900">Invite Coach</h3>
                                <p className="text-xs text-amber-600 mt-0.5">Send a registration link to a new coach</p>
                            </div>
                            <button
                                onClick={() => { setShowInviteCoach(false); inviteForm.reset(); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteForm.data.email}
                                    onChange={(e) => inviteForm.setData('email', e.target.value)}
                                    placeholder="coach@example.com"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                                {inviteForm.errors.email && <p className="mt-1 text-xs text-red-600">{inviteForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Salary / Payout Option</label>
                                <select
                                    value={inviteForm.data.payment_option}
                                    onChange={(e) => {
                                        inviteForm.setData('payment_option', e.target.value);
                                        inviteForm.clearErrors('payment_rate');
                                    }}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                >
                                    <option value="manual">Fixed / Manual Payout</option>
                                    <option value="athlete">Per Active Athlete</option>
                                    <option value="hourly">Hourly Rate</option>
                                </select>
                            </div>

                            {inviteForm.data.payment_option !== 'manual' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        {inviteForm.data.payment_option === 'athlete' ? 'Price per Athlete (€)' : 'Price per Hour (€)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={inviteForm.data.payment_rate}
                                        onChange={(e) => inviteForm.setData('payment_rate', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                    {inviteForm.errors.payment_rate && <p className="mt-1 text-xs text-red-600">{inviteForm.errors.payment_rate}</p>}
                                </div>
                            )}

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                                The coach will receive an email with a secure activation link valid for 7 days. They cannot self-register — this is the only way to create a coach account.
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => { setShowInviteCoach(false); inviteForm.reset(); }}
                                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteForm.processing}
                                    className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-200 disabled:opacity-60"
                                >
                                    {inviteForm.processing ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
