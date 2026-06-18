import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

// ── Types ────────────────────────────────────────────────────────────────────

interface AthleteProfile {
    belt_rank: string | null;
    date_of_birth: string | null;
    weight_class: string | null;
    medical_info: string | null;
    last_grading_date: string | null;
    speed: number | null;
    strength: number | null;
    flexibility: number | null;
    kyorugi: number | null;
    poomsae: number | null;
    coach_tip: string | null;
}

interface Athlete {
    id: number;
    name: string;
    email: string;
    athlete_profile: AthleteProfile | null;
}

interface Group {
    id: number;
    name: string;
    skill_level: string;
    age_range: string | null;
    athletes: Athlete[];
}

interface Payout {
    id: number;
    amount: string;
    payout_date: string;
    status: string;
    notes: string | null;
    payment_type: string | null;
}

// ── Constants ────────────────────────────────────────────────────────────────

const skillColors: Record<string, string> = {
    Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-100',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-100',
    Advanced:     'bg-indigo-50 text-indigo-700 border-indigo-100',
    Elite:        'bg-amber-50 text-amber-700 border-amber-100',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAge(dob: string | null): string {
    if (!dob) return '—';
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toString();
}

function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtCurrency(amount: string | number) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(dateStr: string) {
    return Math.ceil((new Date(dateStr).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
}

// ── Athlete Skills Panel ──────────────────────────────────────────────────────

const METRICS = [
    { key: 'speed',       label: 'Speed',       color: 'from-blue-400 to-blue-600',    track: 'bg-blue-100',    fill: 'bg-blue-500',    icon: '⚡' },
    { key: 'strength',    label: 'Strength',    color: 'from-orange-400 to-orange-600', track: 'bg-orange-100',  fill: 'bg-orange-500',  icon: '💪' },
    { key: 'flexibility', label: 'Flexibility', color: 'from-emerald-400 to-emerald-600', track: 'bg-emerald-100', fill: 'bg-emerald-500', icon: '🤸' },
    { key: 'kyorugi',     label: 'Kyorugi',     color: 'from-rose-400 to-rose-600',    track: 'bg-rose-100',    fill: 'bg-rose-500',    icon: '🥊' },
    { key: 'poomsae',     label: 'Poomsae',     color: 'from-purple-400 to-purple-600', track: 'bg-purple-100', fill: 'bg-purple-500',  icon: '🎽' },
] as const;

function AthleteSkillsPanel({ athlete }: { athlete: Athlete }) {
    const profile = athlete.athlete_profile;
    const { data, setData, post, processing } = useForm({
        speed:       profile?.speed       ?? 0,
        strength:    profile?.strength    ?? 0,
        flexibility: profile?.flexibility ?? 0,
        kyorugi:     profile?.kyorugi     ?? 0,
        poomsae:     profile?.poomsae     ?? 0,
    });
    const tipForm = useForm({ coach_tip: profile?.coach_tip ?? '' });
    const [saved, setSaved] = useState(false);
    const [tipSaved, setTipSaved] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('coach.athletes.skills', athlete.id), {
            preserveScroll: true,
            onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
        });
    };

    const submitTip = (e: React.FormEvent) => {
        e.preventDefault();
        tipForm.post(route('coach.athletes.tip', athlete.id), {
            preserveScroll: true,
            onSuccess: () => { setTipSaved(true); setTimeout(() => setTipSaved(false), 2000); },
        });
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-5">
            {/* Metrics */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-sm">📊</span> Athlete Metrics
                    </p>
                    {saved && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Saved!
                        </span>
                    )}
                </div>
                <form onSubmit={submit} className="space-y-4">
                    {METRICS.map(m => (
                        <div key={m.key}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <span>{m.icon}</span> {m.label}
                                </span>
                                <span className="text-xs font-black text-gray-800 w-8 text-right">
                                    {data[m.key]}
                                </span>
                            </div>
                            <div className="relative flex items-center gap-2">
                                <div className={`flex-1 ${m.track} rounded-full h-2 overflow-hidden`}>
                                    <div
                                        className={`${m.fill} h-2 rounded-full transition-all duration-200`}
                                        style={{ width: `${data[m.key]}%` }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={data[m.key]}
                                    onChange={e => setData(m.key, Number(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                                />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-300 mt-0.5 font-medium">
                                <span>0</span><span>50</span><span>100</span>
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                    >
                        {processing ? 'Saving…' : 'Save Metrics'}
                    </button>
                </form>
            </div>

            {/* Coach Tip */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-sm">🎯</span> Coach's Tip
                    </p>
                    {tipSaved && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Saved!
                        </span>
                    )}
                </div>
                <form onSubmit={submitTip} className="space-y-2">
                    <textarea
                        value={tipForm.data.coach_tip}
                        onChange={e => tipForm.setData('coach_tip', e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Write a personalised tip for this athlete…"
                        className="w-full text-xs rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{tipForm.data.coach_tip.length}/500</span>
                        <button
                            type="submit"
                            disabled={tipForm.processing}
                            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                        >
                            {tipForm.processing ? 'Saving…' : 'Save Tip'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CoachDashboard({
    groups,
    nextPayout,
    payoutHistory,
    totalEarned,
}: {
    groups: Group[];
    nextPayout: Payout | null;
    payoutHistory: Payout[];
    totalEarned: number;
}) {
    const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
    const [expandedAthleteId, setExpandedAthleteId] = useState<number | null>(null);

    const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);
    const selectedGroup = groups[selectedGroupIdx] ?? null;
    const days = nextPayout ? daysUntil(nextPayout.payout_date) : null;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Coach Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your training groups and athlete metrics</p>
                </div>
            }
        >
            <Head title="Coach Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ── Stats ───────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Athletes</p>
                            <p className="text-3xl font-black text-emerald-600">{totalAthletes}</p>
                            <p className="text-xs text-gray-400 mt-1">across all groups</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Groups Assigned</p>
                            <p className="text-3xl font-black text-indigo-600">{groups.length}</p>
                            <p className="text-xs text-gray-400 mt-1">active groups</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Sessions This Week</p>
                            <p className="text-3xl font-black text-blue-600">{groups.length * 3}</p>
                            <p className="text-xs text-gray-400 mt-1">estimated</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Earned</p>
                            <p className="text-3xl font-black text-amber-600">{fmtCurrency(totalEarned)}</p>
                            <p className="text-xs text-gray-400 mt-1">all time</p>
                        </div>
                    </div>

                    {/* ── Salary ──────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Next Payout */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-900">Next Salary / Payout</h3>
                                    <p className="text-xs text-emerald-600 mt-0.5">Your upcoming scheduled payment</p>
                                </div>
                                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg">💰</div>
                            </div>
                            <div className="p-6">
                                {nextPayout ? (
                                    <div className="space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
                                                <p className="text-4xl font-black text-emerald-600">{fmtCurrency(nextPayout.amount)}</p>
                                            </div>
                                            {days !== null && (
                                                <div className={`text-right px-3 py-2 rounded-xl ${days <= 3 ? 'bg-emerald-100' : days <= 7 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                                    <p className={`text-2xl font-black ${days <= 3 ? 'text-emerald-600' : days <= 7 ? 'text-amber-600' : 'text-gray-600'}`}>
                                                        {days <= 0 ? 'Today' : `${days}d`}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-medium">{days <= 0 ? 'due' : 'away'}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Payout Date</p>
                                                <p className="text-sm font-bold text-gray-800">{fmt(nextPayout.payout_date)}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
                                                <span className="inline-flex items-center text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                    {nextPayout.payment_type ?? 'Monthly Salary'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>Pending
                                                </span>
                                            </div>
                                        </div>
                                        {nextPayout.notes && (
                                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1">Note from Manager</p>
                                                <p className="text-sm text-indigo-800">{nextPayout.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-4">📭</div>
                                        <p className="font-semibold text-gray-700 mb-1">No pending payout</p>
                                        <p className="text-sm text-gray-400">Your manager hasn't scheduled a payout yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-indigo-900">Payout History</h3>
                                    <p className="text-xs text-indigo-600 mt-0.5">Your last {payoutHistory.length} payments</p>
                                </div>
                                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-lg">📋</div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {payoutHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3">🗂️</div>
                                        <p className="text-sm font-medium text-gray-500">No payment history yet</p>
                                    </div>
                                ) : (
                                    payoutHistory.map(payout => (
                                        <div key={payout.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{fmtCurrency(payout.amount)}</p>
                                                    <p className="text-xs text-gray-400">{fmt(payout.payout_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid
                                                </span>
                                                {payout.payment_type && (
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                        payout.payment_type === 'Monthly Salary' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                                        payout.payment_type === 'Hourly Rate' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                        payout.payment_type === 'Per Session' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                                        payout.payment_type === 'Commission' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                        'bg-rose-50 border-rose-100 text-rose-700'
                                                    }`}>
                                                        {payout.payment_type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Groups + Athletes ────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Groups list */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">My Training Groups</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{groups.length} groups assigned to you</p>
                                </div>
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg">🏆</div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {groups.map((group, idx) => {
                                    const skillStyle = skillColors[group.skill_level] || 'bg-gray-50 text-gray-700 border-gray-100';
                                    const isSelected = idx === selectedGroupIdx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => { setSelectedGroupIdx(idx); setExpandedAthleteId(null); }}
                                            className={`w-full text-left flex items-center justify-between px-6 py-4 transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${isSelected ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{group.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${skillStyle}`}>{group.skill_level}</span>
                                                        {group.age_range && <span className="text-[10px] text-gray-400">{group.age_range}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Athletes</p>
                                                <p className={`text-lg font-black ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>{group.athletes?.length || 0}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                                {groups.length === 0 && (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">📋</div>
                                        <p className="text-sm font-medium text-gray-500">No groups assigned yet</p>
                                    </div>
                                )}
                            </div>
                            {groups.length > 0 && (
                                <div className="px-6 py-4 bg-slate-50 border-t border-gray-100">
                                    <Link href={route('coach.schedule')} className="w-full inline-block text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                                        View Full Schedule
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Athletes panel */}
                        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {selectedGroup ? (
                                <>
                                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">Athletes — {selectedGroup.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{selectedGroup.athletes.length} athletes · click to edit metrics</p>
                                        </div>
                                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🥋</div>
                                    </div>

                                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                                        {selectedGroup.athletes.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">👤</div>
                                                <p className="text-sm font-medium text-gray-500">No athletes in this group</p>
                                            </div>
                                        ) : (
                                            selectedGroup.athletes.map(athlete => {
                                                const profile    = athlete.athlete_profile;
                                                const belt       = profile?.belt_rank ?? null;
                                                const age        = getAge(profile?.date_of_birth ?? null);
                                                const isExpanded = expandedAthleteId === athlete.id;

                                                return (
                                                    <div key={athlete.id} className={`px-6 py-4 transition-colors ${isExpanded ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                                                        {/* Athlete row — clickable header */}
                                                        <button
                                                            className="w-full text-left"
                                                            onClick={() => setExpandedAthleteId(isExpanded ? null : athlete.id)}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                                    {athlete.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <p className="font-semibold text-gray-900 text-sm">{athlete.name}</p>
                                                                        {belt && (
                                                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${getBeltBadgeStyle(belt)}`}>
                                                                                <span className="inline-block h-1.5 w-3 rounded-sm border shrink-0" style={getBeltStyle(belt)} />
                                                                                {belt}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{athlete.email}</p>
                                                                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                                                        {age !== '—' && <span className="text-xs text-gray-500">Age <strong>{age}</strong></span>}
                                                                        {profile?.weight_class && <span className="text-xs text-gray-500">Weight <strong>{profile.weight_class}</strong></span>}
                                                                        {/* Metrics pills */}
                                                                        {profile?.speed != null && (
                                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                                                                                ⚡ {profile.speed}
                                                                            </span>
                                                                        )}
                                                                        {profile?.strength != null && (
                                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600">
                                                                                💪 {profile.strength}
                                                                            </span>
                                                                        )}
                                                                        {profile?.flexibility != null && (
                                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                                                                                🤸 {profile.flexibility}
                                                                            </span>
                                                                        )}
                                                                        {profile?.kyorugi != null && (
                                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600">
                                                                                🥊 {profile.kyorugi}
                                                                            </span>
                                                                        )}
                                                                        {profile?.poomsae != null && (
                                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
                                                                                🎽 {profile.poomsae}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </button>

                                                        {/* Expanded metrics panel */}
                                                        {isExpanded && <AthleteSkillsPanel athlete={athlete} />}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🥋</div>
                                    <p className="font-semibold text-gray-900 mb-1">No groups assigned</p>
                                    <p className="text-sm text-gray-400">Contact your manager to be assigned to a group.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
