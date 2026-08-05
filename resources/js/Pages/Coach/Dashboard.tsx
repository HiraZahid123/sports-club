import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';
import { getDateForDayOfWeek } from '@/dateHelpers';

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
    event_points: number | null;
}

interface Athlete {
    id: number;
    name: string;
    email: string;
    profile_photo?: string | null;
    athlete_profile: AthleteProfile | null;
}

interface ScheduleSlot {
    id?: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string;
    notes: string;
    facility?: { id: number; name: string } | null;
}

interface Group {
    id: number;
    name: string;
    skill_level: string;
    age_range: string | null;
    athletes: Athlete[];
    schedules?: ScheduleSlot[];
}

interface CoachProfile {
    specialization: string | null;
    bio: string | null;
    payment_option: string | null;
    payment_rate: string | null;
    hourly_rate: string | null;
}

interface Payout {
    id: number;
    amount: string;
    tip?: string | number | null;
    payout_date: string;
    status: string;
    notes: string | null;
    payment_type: string | null;
}

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_COLOR: Record<string, string> = {
    Monday:    'bg-indigo-50 text-indigo-700 border-indigo-100',
    Tuesday:   'bg-purple-50 text-purple-700 border border-purple-100',
    Wednesday: 'bg-blue-50 text-blue-700 border border-blue-100',
    Thursday:  'bg-cyan-50 text-cyan-700 border border-cyan-100',
    Friday:    'bg-emerald-50 text-emerald-700 border border-emerald-100',
    Saturday:  'bg-amber-50 text-amber-700 border border-amber-100',
    Sunday:    'bg-rose-50 text-rose-700 border border-rose-100',
};

const fmtTime = (t: string) => {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAge(dob: string | null): string {
    if (!dob) return '—';
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toString();
}

function fmt(dateStr: string) {
    if (!dateStr) return '';
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
}

function fmtCurrency(amount: string | number) {
    return '€' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(dateStr: string) {
    return Math.ceil((new Date(dateStr).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
}

// ── Metrics ──────────────────────────────────────────────────────────────────

const METRICS = [
    { key: 'speed',       label: 'Speed',       color: 'from-blue-400 to-blue-600',    track: 'bg-blue-100',    fill: 'bg-blue-500',    icon: '⚡' },
    { key: 'strength',    label: 'Strength',    color: 'from-orange-400 to-orange-600', track: 'bg-orange-100',  fill: 'bg-orange-500',  icon: '💪' },
    { key: 'flexibility', label: 'Flexibility', color: 'from-emerald-400 to-emerald-600', track: 'bg-emerald-100', fill: 'bg-emerald-500', icon: '🤸' },
    { key: 'kyorugi',     label: 'Kyorugi',     color: 'from-rose-400 to-rose-600',    track: 'bg-rose-100',    fill: 'bg-rose-500',    icon: '🥊' },
    { key: 'poomsae',     label: 'Poomsae',     color: 'from-purple-400 to-purple-600', track: 'bg-purple-100', fill: 'bg-purple-500',  icon: '🎽' },
] as const;

// ── Point Adjustment Panel ────────────────────────────────────────────────────

function PointAdjustPanel({ athlete }: { athlete: Athlete }) {
    const { data, setData, post, processing, reset } = useForm({
        points: 0 as number,
        comment: '',
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const pts = Number(data.points);
        if (isNaN(pts) || pts === 0) {
            setError('Points must be a non-zero number.');
            return;
        }
        setError('');
        post(route('coach.athletes.adjust-points', athlete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                reset();
                setTimeout(() => setSaved(false), 2500);
            },
        });
    };

    const pts = Number(data.points);
    const isNegative = pts < 0;
    const isPositive = pts > 0;

    const adjustBy = (delta: number) => {
        setData('points', Math.max(-9999, Math.min(9999, pts + delta)));
        setError('');
    };

    const STEPS = [1, 5, 10];

    return (
        <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="text-sm">⚖️</span> Point Adjustment
                </p>
                {saved && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Applied!
                    </span>
                )}
            </div>

            {/* Current points display */}
            <div className="flex items-center gap-2 mb-4 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-sm">⭐</span>
                <span className="text-xs font-semibold text-indigo-700">
                    Current Points: <strong>{athlete.athlete_profile?.event_points ?? 0}</strong>
                </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Big points display + scroll buttons */}
                <div className="flex flex-col items-center gap-3">
                    {/* Point value display */}
                    <div className={`w-full text-center py-3 rounded-2xl font-black text-3xl transition-all border-2 ${
                        isNegative
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : isPositive
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                        {isNegative ? '−' : isPositive ? '+' : ''}{Math.abs(pts)}
                        <span className="text-sm font-semibold ml-1 opacity-60">pts</span>
                    </div>

                    {/* Step buttons row — positive */}
                    <div className="w-full">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1.5 text-center">Add Points</p>
                        <div className="grid grid-cols-3 gap-2">
                            {STEPS.map(step => (
                                <button
                                    key={`+${step}`}
                                    type="button"
                                    onClick={() => adjustBy(+step)}
                                    className="py-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-sm transition-all active:scale-95 shadow-sm border border-emerald-200"
                                >
                                    +{step}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step buttons row — negative */}
                    <div className="w-full">
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mb-1.5 text-center">Remove Points</p>
                        <div className="grid grid-cols-3 gap-2">
                            {STEPS.map(step => (
                                <button
                                    key={`-${step}`}
                                    type="button"
                                    onClick={() => adjustBy(-step)}
                                    className="py-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-sm transition-all active:scale-95 shadow-sm border border-rose-200"
                                >
                                    −{step}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset */}
                    {pts !== 0 && (
                        <button
                            type="button"
                            onClick={() => { setData('points', 0); setError(''); }}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                            Reset to 0
                        </button>
                    )}
                </div>

                <textarea
                    value={data.comment}
                    onChange={e => setData('comment', e.target.value)}
                    placeholder="Reason / comment (optional)…"
                    rows={2}
                    maxLength={500}
                    className="w-full text-xs rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400 resize-none transition-all"
                />
                {error && <p className="text-[10px] text-rose-600 font-semibold">{error}</p>}
                <button
                    type="submit"
                    disabled={processing || pts === 0}
                    className={`w-full py-3 text-white text-sm font-black rounded-xl transition-all disabled:opacity-40 shadow-sm ${
                        isNegative
                            ? 'bg-rose-500 hover:bg-rose-600'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                >
                    {processing ? 'Applying…' : isNegative ? `Deduct ${Math.abs(pts)} Points` : `Award ${pts || 0} Points`}
                </button>
            </form>
        </div>
    );
}

// ── Athlete Skills Panel ──────────────────────────────────────────────────────

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

            {/* Point Adjustment */}
            <PointAdjustPanel athlete={athlete} />
        </div>
    );
}

// ── Athlete Row ────────────────────────────────────────────────────────────────
function AthleteRow({
    athlete,
    expandedAthleteId,
    setExpandedAthleteId,
    showGroup,
    groupName,
}: {
    athlete: Athlete;
    expandedAthleteId: number | null;
    setExpandedAthleteId: (id: number | null) => void;
    showGroup?: boolean;
    groupName?: string;
}) {
    const profile    = athlete.athlete_profile;
    const belt       = profile?.belt_rank ?? null;
    const age        = getAge(profile?.date_of_birth ?? null);
    const isExpanded = expandedAthleteId === athlete.id;

    return (
        <div className={`px-6 py-4 transition-colors ${isExpanded ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
            <button
                className="w-full text-left"
                onClick={() => setExpandedAthleteId(isExpanded ? null : athlete.id)}
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 overflow-hidden">
                        {athlete.profile_photo ? (
                            <img
                                src={athlete.profile_photo.startsWith('http') ? athlete.profile_photo : '/' + athlete.profile_photo}
                                alt={athlete.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            athlete.name.charAt(0).toUpperCase()
                        )}
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
                            {showGroup && groupName && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    {groupName}
                                </span>
                            )}
                            {/* Points badge */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                ⭐ {profile?.event_points ?? 0} pts
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{athlete.email}</p>
                        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                            {age !== '—' && <span className="text-xs text-gray-500">Age <strong>{age}</strong></span>}
                            {profile?.weight_class && <span className="text-xs text-gray-500">Weight <strong>{profile.weight_class}</strong></span>}
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
                        </div>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isExpanded && <AthleteSkillsPanel athlete={athlete} />}
        </div>
    );
}

// ── Coach Profile Card ────────────────────────────────────────────────────────

function CoachProfileCard({
    user,
    coachProfile,
    groups,
}: {
    user: any;
    coachProfile: CoachProfile | null;
    groups: Group[];
}) {
    const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);

    return (
        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 rounded-2xl p-8 overflow-hidden text-white">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-6 w-16 h-16 bg-white/5 rounded-full" />

            <div className="relative">
                {/* Avatar + name row */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
                        {user.profile_photo ? (
                            <img
                                src={user.profile_photo.startsWith('http') || user.profile_photo.startsWith('blob:') || user.profile_photo.startsWith('data:')
                                    ? user.profile_photo
                                    : (user.profile_photo.startsWith('/') ? user.profile_photo : '/' + user.profile_photo)}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-white truncate leading-snug">{user.name}</h4>
                        {user.club && (
                            <p className="text-xs text-white/70 font-medium truncate mt-0.5">{user.club.name}</p>
                        )}
                        {/* COACH role badge */}
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-white/20 text-white border border-white/25">
                            🎽 Coach
                        </span>
                    </div>
                </div>

                {/* Manager-assigned position/titles — business card style */}
                {user.titles && Array.isArray(user.titles) && user.titles.length > 0 && (
                    <div className="mb-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2 text-white/50">Position</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(user.titles as string[]).map((title: string, i: number) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-sm border bg-white/15 border-white/25 text-white"
                                >
                                    {title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* COACH role display */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                        <span className="text-xl">🎽</span>
                        <h3 className="text-xl font-black text-white tracking-wide">COACH</h3>
                    </div>
                </div>

                {/* Specialization */}
                {coachProfile?.specialization && (
                    <p className="text-xs text-white/70 mb-4 font-medium">
                        📌 {coachProfile.specialization}
                    </p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wide">Groups</p>
                        <p className="text-2xl font-black text-white">{groups.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wide">Athletes</p>
                        <p className="text-2xl font-black text-white">{totalAthletes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Section type ──────────────────────────────────────────────────────────────
type Section = 'athletes' | 'groups';

// ── Main Component ────────────────────────────────────────────────────────────

export default function CoachDashboard({
    groups,
    nextPayout,
    payoutHistory,
    totalEarned,
    coachProfile,
    leaderboard = [],
}: {
    groups: Group[];
    nextPayout: Payout | null;
    payoutHistory: Payout[];
    totalEarned: number;
    coachProfile: CoachProfile | null;
    leaderboard?: Array<{ id: number; name: string; points: number; belt_rank: string }>;
}) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [activeSection, setActiveSection] = useState<Section | null>(null);
    const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
    const [expandedAthleteId, setExpandedAthleteId] = useState<number | null>(null);

    const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);
    const selectedGroup = groups[selectedGroupIdx] ?? null;
    const days = nextPayout ? daysUntil(nextPayout.payout_date) : null;

    // All athletes flat (deduplicated by id)
    const allAthletes = Object.values(
        groups.flatMap(g => g.athletes.map(a => ({ athlete: a, groupName: g.name }))).reduce((acc, item) => {
            if (!acc[item.athlete.id]) acc[item.athlete.id] = item;
            return acc;
        }, {} as Record<number, { athlete: Athlete; groupName: string }>)
    );

    const totalSessions = groups.reduce((sum, g) => sum + (g.schedules?.length || 0), 0);

    // ── Stat Cards ─────────────────────────────────────────────────────────
    const statCards = [
        {
            id: 'athletes' as Section,
            label: 'Total Athletes',
            value: totalAthletes,
            sub: 'across all groups',
            valueColor: 'text-emerald-600',
            border: 'border-emerald-100',
            ring: 'ring-emerald-400',
            icon: '🥋',
            iconBg: 'bg-emerald-50',
            hint: 'View athlete list →',
        },
        {
            id: 'groups' as Section,
            label: 'Groups Assigned',
            value: groups.length,
            sub: 'active groups',
            valueColor: 'text-indigo-600',
            border: 'border-indigo-100',
            ring: 'ring-indigo-400',
            icon: '🏆',
            iconBg: 'bg-indigo-50',
            hint: 'View your groups →',
        },
        {
            id: null,
            label: 'Sessions This Week',
            value: totalSessions,
            sub: 'scheduled',
            valueColor: 'text-blue-600',
            border: 'border-blue-100',
            ring: 'ring-blue-400',
            icon: '📅',
            iconBg: 'bg-blue-50',
            hint: 'View schedule →',
        },
        {
            id: null,
            label: 'Total Earned',
            value: fmtCurrency(totalEarned),
            sub: 'all time',
            valueColor: 'text-amber-600',
            border: 'border-amber-100',
            ring: 'ring-amber-400',
            icon: '💰',
            iconBg: 'bg-amber-50',
            hint: '',
        },
    ];

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

                    {/* ── Hero Row: Profile Card + Stat Cards ────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Coach Profile Card */}
                        <CoachProfileCard user={user} coachProfile={coachProfile} groups={groups} />

                        {/* Stat cards (2-col right side) */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            {statCards.map((card) => {
                                const isActive = card.id !== null && activeSection === card.id;
                                const CardTag = card.id === null ? Link : 'button';
                                const cardProps = card.id === null
                                    ? { href: route('coach.schedule') }
                                    : { onClick: () => setActiveSection(activeSection === card.id ? null : card.id!) };

                                return (
                                    <CardTag
                                        key={card.label}
                                        {...(cardProps as any)}
                                        className={`group bg-white rounded-2xl border shadow-sm p-5 text-left cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                                            isActive
                                                ? `${card.border} ring-2 ${card.ring}/40 shadow-md -translate-y-0.5`
                                                : `${card.border}`
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110`}>
                                                {card.icon}
                                            </div>
                                            {isActive && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
                                        <p className={`text-2xl font-black ${card.valueColor}`}>{card.value}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                                        <p className={`text-[10px] font-semibold mt-1.5 transition-opacity ${isActive ? 'opacity-100 text-indigo-500' : 'opacity-0 group-hover:opacity-60 text-gray-400'}`}>
                                            {card.hint}
                                        </p>
                                    </CardTag>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Next Payout Banner ──────────────────────────────────── */}
                    {nextPayout && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">💰</div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Next Payout</p>
                                    <p className="text-xs text-amber-600 mt-0.5">
                                        {fmt(nextPayout.payout_date)}
                                        {days !== null && (
                                            <span className="ml-2 font-bold">
                                                {days === 0 ? '— Today!' : days > 0 ? `— in ${days} day${days !== 1 ? 's' : ''}` : `— ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-amber-700">{fmtCurrency(nextPayout.amount)}</p>
                                {nextPayout.tip && Number(nextPayout.tip) > 0 && (
                                    <p className="text-xs text-amber-500 font-semibold">+{fmtCurrency(nextPayout.tip)} bonus</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Active Section Content ──────────────────────────────── */}
                    {activeSection === 'athletes' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">All Athletes</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{allAthletes.length} athletes across your groups</p>
                                </div>
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {allAthletes.length > 0 ? (
                                    allAthletes.map(({ athlete, groupName }) => (
                                        <AthleteRow
                                            key={athlete.id}
                                            athlete={athlete}
                                            expandedAthleteId={expandedAthleteId}
                                            setExpandedAthleteId={setExpandedAthleteId}
                                            showGroup
                                            groupName={groupName}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400 text-sm italic">No athletes in your groups yet.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === 'groups' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">My Groups</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{groups.length} group{groups.length !== 1 ? 's' : ''} assigned</p>
                                </div>
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Group tabs */}
                            {groups.length > 0 && (
                                <div className="flex border-b border-gray-100 overflow-x-auto">
                                    {groups.map((g, idx) => (
                                        <button
                                            key={g.id}
                                            onClick={() => { setSelectedGroupIdx(idx); setExpandedAthleteId(null); }}
                                            className={`flex-shrink-0 px-5 py-3 text-sm font-bold transition-colors ${
                                                selectedGroupIdx === idx
                                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            {g.name}
                                            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                                                selectedGroupIdx === idx ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {g.athletes.length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedGroup && (
                                <>
                                    {/* Group info row */}
                                    <div className="px-6 py-3 bg-slate-50 border-b border-gray-100 flex flex-wrap gap-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                            🎯 {selectedGroup.skill_level}
                                        </span>
                                        {selectedGroup.age_range && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                                👥 Ages: {selectedGroup.age_range}
                                            </span>
                                        )}
                                        {(selectedGroup.schedules?.length ?? 0) > 0 && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                                📅 {selectedGroup.schedules!.length} session{selectedGroup.schedules!.length !== 1 ? 's' : ''}/wk
                                            </span>
                                        )}
                                    </div>

                                    {/* Athletes in group */}
                                    <div className="divide-y divide-gray-50">
                                        {selectedGroup.athletes.length > 0 ? (
                                            selectedGroup.athletes.map(athlete => (
                                                <AthleteRow
                                                    key={athlete.id}
                                                    athlete={athlete}
                                                    expandedAthleteId={expandedAthleteId}
                                                    setExpandedAthleteId={setExpandedAthleteId}
                                                />
                                            ))
                                        ) : (
                                            <div className="py-10 text-center text-gray-400 text-sm italic">No athletes in this group yet.</div>
                                        )}
                                    </div>

                                    {/* Schedule rows */}
                                    {(selectedGroup.schedules?.length ?? 0) > 0 && (
                                        <div className="border-t border-gray-100">
                                            <div className="px-6 py-3 bg-slate-50">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Weekly Schedule</p>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {selectedGroup.schedules!.map((s, idx) => {
                                                    const dateNum = new Date(getDateForDayOfWeek(s.day_of_week)).getDate();
                                                    return (
                                                        <div key={idx} className={`flex items-center gap-4 px-6 py-3 border-l-4 ${DAY_COLOR[s.day_of_week] || 'border-gray-200'}`}>
                                                            <div className="text-center w-12 shrink-0">
                                                                <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">{s.day_of_week.substring(0,3)}</p>
                                                                <p className="text-lg font-black text-gray-800 leading-none mt-0.5">{dateNum}</p>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-800">{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</p>
                                                                {s.facility?.name && <p className="text-xs text-gray-400 mt-0.5">{s.facility.name}</p>}
                                                                {s.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{s.notes}</p>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Leaderboard + Payout History row ───────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Leaderboard */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-5 py-4 border-b border-amber-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-amber-900">Top Athletes (Points)</h3>
                                    <p className="text-xs text-amber-600 mt-0.5">Club-wide ranking</p>
                                </div>
                                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-sm">🏆</div>
                            </div>
                            <div className="p-4 divide-y divide-gray-50">
                                {leaderboard.length > 0 ? (
                                    leaderboard.slice(0, 5).map((ath, idx) => (
                                        <div key={ath.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-2.5">
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                                    idx === 0 ? 'bg-amber-500 text-white' :
                                                    idx === 1 ? 'bg-slate-300 text-slate-800' :
                                                    idx === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800">{ath.name}</p>
                                                    <span className="inline-block text-[8px] font-bold text-gray-400 uppercase">{ath.belt_rank}</span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                                                ⭐ {ath.points} pts
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-4">No athlete points recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Recent Payouts</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Last 5 paid payouts</p>
                                </div>
                                <span className="text-xl">📋</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {payoutHistory.length > 0 ? (
                                    payoutHistory.map(p => (
                                        <div key={p.id} className="flex items-center justify-between px-5 py-3">
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{fmt(p.payout_date)}</p>
                                                {p.notes && <p className="text-[10px] text-gray-400 mt-0.5">{p.notes}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-emerald-600">{fmtCurrency(p.amount)}</p>
                                                {p.tip && Number(p.tip) > 0 && (
                                                    <p className="text-[10px] text-amber-500 font-semibold">+{fmtCurrency(p.tip)} bonus</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-8">No payout history yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
