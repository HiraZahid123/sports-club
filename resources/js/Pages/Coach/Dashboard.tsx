import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

// ── Types ────────────────────────────────────────────────────────────────────

interface AthleteProfile {
    belt_rank: string | null;
    date_of_birth: string | null;
    weight_class: string | null;
    medical_info: string | null;
    last_grading_date: string | null;
}

interface Goal {
    id: number;
    title: string;
    description: string | null;
    category: string;
    status: string;
    target_date: string | null;
}

interface Athlete {
    id: number;
    name: string;
    email: string;
    athlete_profile: AthleteProfile | null;
    training_goals: Goal[];
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
}

interface CoachProfile {
    specialization: string | null;
    hourly_rate: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['General', 'Technique', 'Fitness', 'Strength', 'Mental', 'Competition'];

const STATUSES: { value: string; label: string; color: string; dot: string }[] = [
    { value: 'not_started', label: 'Not Started', color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
    { value: 'completed',   label: 'Completed',   color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
];

const CAT_COLORS: Record<string, string> = {
    General:     'bg-gray-100 text-gray-600',
    Technique:   'bg-indigo-100 text-indigo-700',
    Fitness:     'bg-emerald-100 text-emerald-700',
    Strength:    'bg-orange-100 text-orange-700',
    Mental:      'bg-purple-100 text-purple-700',
    Competition: 'bg-amber-100 text-amber-700',
};

const skillColors: Record<string, string> = {
    Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-100',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-100',
    Advanced:     'bg-indigo-50 text-indigo-700 border-indigo-100',
    Elite:        'bg-amber-50 text-amber-700 border-amber-100',
};

const beltColors: Record<string, string> = {
    White:  'bg-gray-100 text-gray-700',
    Yellow: 'bg-yellow-100 text-yellow-700',
    Orange: 'bg-orange-100 text-orange-700',
    Green:  'bg-emerald-100 text-emerald-700',
    Blue:   'bg-blue-100 text-blue-700',
    Purple: 'bg-purple-100 text-purple-700',
    Brown:  'bg-amber-900/20 text-amber-900',
    Black:  'bg-gray-900 text-white',
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

function statusMeta(value: string) {
    return STATUSES.find(s => s.value === value) ?? STATUSES[0];
}

const inputCls = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';

// ── Goal Form (add or edit) ───────────────────────────────────────────────────

function GoalForm({
    athleteId,
    editingGoal,
    onCancel,
}: {
    athleteId: number;
    editingGoal: Goal | null;
    onCancel: () => void;
}) {
    const isEdit = !!editingGoal;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        athlete_id:  athleteId,
        title:       editingGoal?.title ?? '',
        description: editingGoal?.description ?? '',
        category:    editingGoal?.category ?? 'General',
        status:      editingGoal?.status ?? 'not_started',
        target_date: editingGoal?.target_date ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('coach.goals.update', editingGoal!.id), {
                preserveScroll: true,
                onSuccess: () => { reset(); onCancel(); },
            });
        } else {
            post(route('coach.goals.store'), {
                preserveScroll: true,
                onSuccess: () => { reset(); onCancel(); },
            });
        }
    };

    return (
        <form onSubmit={submit} className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3 mt-3">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{isEdit ? 'Edit Goal' : 'Add New Goal'}</p>

            <div>
                <input
                    type="text"
                    placeholder="Goal title *"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className={inputCls}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <textarea
                placeholder="Description (optional)"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
            />

            <div className="grid grid-cols-3 gap-2">
                <div>
                    <select value={data.category} onChange={e => setData('category', e.target.value)} className={inputCls}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputCls}>
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
                <div>
                    <input
                        type="date"
                        value={data.target_date}
                        onChange={e => setData('target_date', e.target.value)}
                        className={inputCls}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                    Cancel
                </button>
                <button type="submit" disabled={processing} className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {processing ? 'Saving…' : isEdit ? 'Update Goal' : 'Add Goal'}
                </button>
            </div>
        </form>
    );
}

// ── Athlete Goals Panel ───────────────────────────────────────────────────────

function AthleteGoalsPanel({ athlete }: { athlete: Athlete }) {
    const [showForm, setShowForm]       = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const deleteGoal = (goalId: number) => {
        if (!confirm('Delete this goal?')) return;
        router.delete(route('coach.goals.destroy', goalId), { preserveScroll: true });
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Training Goals
                    <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md">
                        {athlete.training_goals.length}
                    </span>
                </p>
                {!showForm && !editingGoal && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Goal
                    </button>
                )}
            </div>

            {/* Goals list */}
            {athlete.training_goals.length === 0 && !showForm ? (
                <p className="text-xs text-gray-400 italic px-1">No goals set yet. Click "Add Goal" to create one.</p>
            ) : (
                <div className="space-y-2">
                    {athlete.training_goals.map(goal => {
                        const st  = statusMeta(goal.status);
                        const isEditing = editingGoal?.id === goal.id;
                        return (
                            <div key={goal.id}>
                                {isEditing ? (
                                    <GoalForm
                                        athleteId={athlete.id}
                                        editingGoal={goal}
                                        onCancel={() => setEditingGoal(null)}
                                    />
                                ) : (
                                    <div className="flex items-start justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-gray-800">{goal.title}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${CAT_COLORS[goal.category] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {goal.category}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${st.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                                                    {st.label}
                                                </span>
                                            </div>
                                            {goal.description && (
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{goal.description}</p>
                                            )}
                                            {goal.target_date && (
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    Target: <span className="font-semibold text-gray-600">{fmt(goal.target_date)}</span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => { setEditingGoal(goal); setShowForm(false); }}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteGoal(goal.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add form */}
            {showForm && (
                <GoalForm
                    athleteId={athlete.id}
                    editingGoal={null}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CoachDashboard({
    groups,
    nextPayout,
    payoutHistory,
    totalEarned,
    coachProfile,
}: {
    groups: Group[];
    nextPayout: Payout | null;
    payoutHistory: Payout[];
    totalEarned: number;
    coachProfile: CoachProfile | null;
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
                    <p className="text-sm text-gray-500 mt-0.5">Manage your training groups and athlete goals</p>
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
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Payout Date</p>
                                                <p className="text-sm font-bold text-gray-800">{fmt(nextPayout.payout_date)}</p>
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
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid
                                            </span>
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
                                            <p className="text-xs text-gray-500 mt-0.5">{selectedGroup.athletes.length} athletes · click an athlete to manage goals</p>
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
                                                const goalCount  = athlete.training_goals.length;
                                                const doneCount  = athlete.training_goals.filter(g => g.status === 'completed').length;

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
                                                                        {/* Goal progress pill */}
                                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                                                                            {doneCount}/{goalCount} goals
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </button>

                                                        {/* Expanded goals panel */}
                                                        {isExpanded && <AthleteGoalsPanel athlete={athlete} />}
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
