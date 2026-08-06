import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
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

const METRICS = [
    { key: 'speed',       label: 'Speed',       color: 'from-blue-400 to-blue-600',    track: 'bg-blue-100',    fill: 'bg-blue-500',    icon: '⚡' },
    { key: 'strength',    label: 'Strength',    color: 'from-orange-400 to-orange-600', track: 'bg-orange-100',  fill: 'bg-orange-500',  icon: '💪' },
    { key: 'flexibility', label: 'Flexibility', color: 'from-emerald-400 to-emerald-600', track: 'bg-emerald-100', fill: 'bg-emerald-500', icon: '🤸' },
    { key: 'kyorugi',     label: 'Kyorugi',     color: 'from-rose-400 to-rose-600',    track: 'bg-rose-100',    fill: 'bg-rose-500',    icon: '🥊' },
    { key: 'poomsae',     label: 'Poomsae',     color: 'from-purple-400 to-purple-600', track: 'bg-purple-100', fill: 'bg-purple-500',  icon: '🎽' },
] as const;

function getAge(dob: string | null): string {
    if (!dob) return '—';
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toString();
}

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

            <div className="flex items-center gap-2 mb-4 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-sm">⭐</span>
                <span className="text-xs font-semibold text-indigo-700">
                    Current Points: <strong>{athlete.athlete_profile?.event_points ?? 0}</strong>
                </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="flex flex-col items-center gap-3">
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
                        isNegative ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                >
                    {processing ? 'Applying…' : isNegative ? `Deduct ${Math.abs(pts)} Points` : `Award ${pts || 0} Points`}
                </button>
            </form>
        </div>
    );
}

// ── Athlete Details Panel ─────────────────────────────────────────────────────

function AthleteDetailsPanel({ athlete }: { athlete: Athlete }) {
    const profile = athlete.athlete_profile;

    const { data: metricsData, setData: setMetric, post: postMetrics, processing: savingMetrics } = useForm({
        speed: profile?.speed ?? 0,
        strength: profile?.strength ?? 0,
        flexibility: profile?.flexibility ?? 0,
        kyorugi: profile?.kyorugi ?? 0,
        poomsae: profile?.poomsae ?? 0,
    });

    const tipForm = useForm({
        coach_tip: profile?.coach_tip ?? '',
    });

    const [metricsSaved, setMetricsSaved] = useState(false);
    const [tipSaved, setTipSaved] = useState(false);

    const submitMetrics = (e: React.FormEvent) => {
        e.preventDefault();
        postMetrics(route('coach.athletes.skills', athlete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setMetricsSaved(true);
                setTimeout(() => setMetricsSaved(false), 2000);
            },
        });
    };

    const submitTip = (e: React.FormEvent) => {
        e.preventDefault();
        tipForm.post(route('coach.athletes.tip', athlete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setTipSaved(true);
                setTimeout(() => setTipSaved(false), 2000);
            },
        });
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-5">
            {/* Athlete Metrics */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-sm">📊</span> Athlete Metrics
                    </p>
                    {metricsSaved && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Saved!
                        </span>
                    )}
                </div>

                <form onSubmit={submitMetrics} className="space-y-4">
                    {METRICS.map(m => (
                        <div key={m.key}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <span>{m.icon}</span> {m.label}
                                </span>
                                <span className="text-xs font-black text-gray-800 w-8 text-right">
                                    {metricsData[m.key]}
                                </span>
                            </div>
                            <div className="relative flex items-center gap-2">
                                <div className={`flex-1 ${m.track} rounded-full h-2 overflow-hidden`}>
                                    <div
                                        className={`${m.fill} h-2 rounded-full transition-all duration-200`}
                                        style={{ width: `${metricsData[m.key]}%` }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={metricsData[m.key]}
                                    onChange={e => setMetric(m.key, Number(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                                />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-300 mt-0.5 font-medium">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={savingMetrics}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                    >
                        {savingMetrics ? 'Saving…' : 'Save Metrics'}
                    </button>
                </form>
            </div>

            {/* Coach's Tip */}
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

            {/* Points Panel */}
            <PointAdjustPanel athlete={athlete} />
        </div>
    );
}

// ── Athlete Card ──────────────────────────────────────────────────────────────

function AthleteCard({
    athlete,
    expandedAthleteId,
    setExpandedAthleteId,
}: {
    athlete: Athlete;
    expandedAthleteId: number | null;
    setExpandedAthleteId: (id: number | null) => void;
}) {
    const profile = athlete.athlete_profile;
    const rank = profile?.belt_rank ?? null;
    const age = getAge(profile?.date_of_birth ?? null);
    const isExpanded = expandedAthleteId === athlete.id;

    return (
        <div className={`px-6 py-4 transition-colors rounded-2xl border mb-3 bg-white shadow-sm ${
            isExpanded ? 'border-indigo-200 ring-1 ring-indigo-50/55 bg-indigo-50/5' : 'border-gray-100 hover:bg-slate-50'
        }`}>
            <button
                className="w-full text-left"
                onClick={() => setExpandedAthleteId(isExpanded ? null : athlete.id)}
            >
                <div className="flex items-start gap-4">
                    {/* Photo/Initials */}
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
                            {rank && (
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${getBeltBadgeStyle(rank)}`}>
                                    <span className="inline-block h-1.5 w-3 rounded-sm border shrink-0" style={getBeltStyle(rank)} />
                                    {rank}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                ⭐ {profile?.event_points ?? 0} pts
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{athlete.email}</p>
                        
                        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                            {age !== '—' && (
                                <span className="text-xs text-gray-500">
                                    Age <strong>{age}</strong>
                                </span>
                            )}
                            {profile?.weight_class && (
                                <span className="text-xs text-gray-500">
                                    Weight <strong>{profile.weight_class}</strong>
                                </span>
                            )}
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

                    <svg
                        className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isExpanded && <AthleteDetailsPanel athlete={athlete} />}
        </div>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function MyTeam({ groups }: { groups: Group[] }) {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(groups[0]?.id ?? null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedAthleteId, setExpandedAthleteId] = useState<number | null>(null);

    const activeGroup = groups.find(g => g.id === selectedGroupId) || null;

    // Filter athletes by search query and group selection
    const displayedAthletes = activeGroup
        ? activeGroup.athletes.filter(athlete =>
            athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Team Directory</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage athlete metrics, awards and feedback by groups</p>
                </div>
            }
        >
            <Head title="My Team" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {groups.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🥋</div>
                            <p className="font-semibold text-gray-900 mb-1">No groups assigned</p>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                You are not currently assigned as a Coach to any training groups. Contact your Club Manager to be assigned.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                            {/* Group Selection Sidebar */}
                            <div className="lg:col-span-1 space-y-3">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Training Groups</p>
                                    
                                    {/* Mobile dropdown selector */}
                                    <div className="block lg:hidden mb-1">
                                        <select
                                            value={selectedGroupId ?? ''}
                                            onChange={e => setSelectedGroupId(Number(e.target.value))}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300/30"
                                        >
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id}>{g.name} ({g.athletes.length})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Desktop sidebar list */}
                                    <div className="hidden lg:flex flex-col gap-1">
                                        {groups.map(g => {
                                            const isActive = g.id === selectedGroupId;
                                            return (
                                                <button
                                                    key={g.id}
                                                    onClick={() => {
                                                        setSelectedGroupId(g.id);
                                                        setExpandedAthleteId(null);
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                                        isActive
                                                            ? 'bg-indigo-600 text-white shadow-sm'
                                                            : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'
                                                    }`}
                                                >
                                                    <span className="truncate pr-2">{g.name}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] rounded-lg font-extrabold ${
                                                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {g.athletes.length}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Active Group Info Widget */}
                                {activeGroup && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-4 hidden lg:block">
                                        <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest mb-2">Group Details</p>
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{activeGroup.name}</h4>
                                        <div className="mt-3 space-y-2 text-xs text-gray-600">
                                            <p className="flex justify-between">
                                                <span>Skill Level:</span>
                                                <strong className="text-gray-950 font-bold">{activeGroup.skill_level}</strong>
                                            </p>
                                            {activeGroup.age_range && (
                                                <p className="flex justify-between">
                                                    <span>Age Range:</span>
                                                    <strong className="text-gray-950 font-bold">{activeGroup.age_range}</strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main Members Panel */}
                            <div className="lg:col-span-3 space-y-4">
                                {/* Search Bar & Count */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="relative w-full md:max-w-xs shrink-0">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">🔍</span>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Search athlete by name or email..."
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-400 font-semibold">
                                        Showing {displayedAthletes.length} of {activeGroup?.athletes.length || 0} athletes
                                    </div>
                                </div>

                                {/* Athlete List */}
                                <div className="space-y-1">
                                    {displayedAthletes.length === 0 ? (
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                                            <p className="text-gray-400 italic text-sm">
                                                {searchTerm ? 'No athletes match your search query.' : 'This group has no athletes.'}
                                            </p>
                                        </div>
                                    ) : (
                                        displayedAthletes.map(athlete => (
                                            <AthleteCard
                                                key={athlete.id}
                                                athlete={athlete}
                                                expandedAthleteId={expandedAthleteId}
                                                setExpandedAthleteId={setExpandedAthleteId}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
