import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getBeltStyle, getBeltCardGradient, getNextBelt } from '@/beltHelpers';

interface AthleteProfile {
    belt_rank?: string | null;
    date_of_birth?: string | null;
    medical_info?: string | null;
    weight_class?: string | null;
    speed?: number | null;
    strength?: number | null;
    flexibility?: number | null;
    kyorugi?: number | null;
    poomsae?: number | null;
    coach_tip?: string | null;
}

// ── Metrics Card ─────────────────────────────────────────────────────────────

const METRICS = [
    { key: 'speed'       as const, label: 'Speed',       icon: '⚡', track: 'bg-blue-100',    fill: 'bg-blue-500',    text: 'text-blue-700',    badge: 'bg-blue-50 text-blue-600' },
    { key: 'strength'    as const, label: 'Strength',    icon: '💪', track: 'bg-orange-100',  fill: 'bg-orange-500',  text: 'text-orange-700',  badge: 'bg-orange-50 text-orange-600' },
    { key: 'flexibility' as const, label: 'Flexibility', icon: '🤸', track: 'bg-emerald-100', fill: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-600' },
    { key: 'kyorugi'     as const, label: 'Kyorugi',     icon: '🥊', track: 'bg-rose-100',    fill: 'bg-rose-500',    text: 'text-rose-700',    badge: 'bg-rose-50 text-rose-600' },
    { key: 'poomsae'     as const, label: 'Poomsae',     icon: '🎽', track: 'bg-purple-100', fill: 'bg-purple-500',  text: 'text-purple-700',  badge: 'bg-purple-50 text-purple-600' },
];

function MetricsCard({ athleteProfile }: { athleteProfile?: AthleteProfile | null }) {
    const hasAny = METRICS.some(m => (athleteProfile?.[m.key] ?? null) !== null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">My Metrics</h3>
                <span className="text-xs text-gray-400 font-medium">Set by coach</span>
            </div>

            {hasAny ? (
                <div className="space-y-5">
                    {METRICS.map(m => {
                        const val = athleteProfile?.[m.key] ?? 0;
                        return (
                            <div key={m.key}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-bold flex items-center gap-1.5 ${m.text}`}>
                                        <span>{m.icon}</span> {m.label}
                                    </span>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${m.badge}`}>
                                        {val}<span className="text-[10px] font-medium opacity-70">/100</span>
                                    </span>
                                </div>
                                <div className={`w-full ${m.track} rounded-full h-2.5 overflow-hidden`}>
                                    <div
                                        className={`${m.fill} h-2.5 rounded-full transition-all duration-700`}
                                        style={{ width: `${val}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-3">📊</div>
                    <p className="text-sm font-medium text-gray-500">No metrics set yet</p>
                    <p className="text-xs text-gray-400 mt-1">Your coach will update your metrics soon.</p>
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface UpcomingScheduleSlot {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string | null;
    group: {
        name: string;
        coaches?: Array<{ name: string }>;
    };
    facility?: {
        name: string;
    } | null;
}

export default function AthleteDashboard({
    athleteProfile,
    stats = { classes: 0, sparring: 0, events: 0, points: 0 },
    upcomingSchedules = [],
    leaderboard = [],
}: {
    athleteProfile?: AthleteProfile | null;
    stats?: { classes: number; sparring: number; events: number; points: number };
    upcomingSchedules?: UpcomingScheduleSlot[];
    leaderboard?: Array<{ id: number; name: string; points: number; belt_rank: string }>;
}) {
    const belt = athleteProfile?.belt_rank || '10. WHITE';
    const cardStyle = getBeltCardGradient(belt);
    const progressStats = [
        { label: 'Classes', val: String(stats.classes), icon: '📚', color: 'bg-blue-50 border-blue-100 text-blue-600' },
        { label: 'Sparring', val: String(stats.sparring), icon: '🥊', color: 'bg-rose-50 border-rose-100 text-rose-600' },
        { label: 'Events', val: String(stats.events), icon: '🏅', color: 'bg-amber-50 border-amber-100 text-amber-600' },
        { label: 'Points', val: String(stats.points), icon: '⭐', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track your progress and upcoming training schedule</p>
                </div>
            }
        >
            <Head title="Athlete Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Hero Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Belt Rank Card */}
                        <div className={`relative bg-gradient-to-br ${cardStyle.bg} rounded-2xl p-8 overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative">
                                <div className={`w-16 h-16 ${cardStyle.text.includes('text-white') ? 'bg-white/20 border-white/30' : 'bg-black/10 border-black/15'} backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-4 border shadow-inner`}>
                                    🥋
                                </div>

                                {/* Label */}
                                <p className={`text-[11px] font-extrabold uppercase tracking-widest mb-2 ${cardStyle.text.includes('text-white') ? 'text-white/70' : 'text-gray-500'}`}>
                                    Current Rank
                                </p>

                                {/* Belt stripe + name — always high contrast */}
                                <div className="flex items-center gap-3 mb-1">
                                    <span
                                        className="inline-block h-5 w-9 rounded-md border-2 shadow-md shrink-0"
                                        style={getBeltStyle(belt)}
                                    />
                                    <h3 className={`text-xl font-black leading-tight ${cardStyle.text.includes('text-white') ? 'text-white drop-shadow-sm' : 'text-gray-900'}`}>
                                        {belt}
                                    </h3>
                                </div>

                                <p className={`text-xs mb-5 ${cardStyle.text.includes('text-white') ? 'text-white/60' : 'text-gray-500'}`}>
                                    Next: <span className={`font-bold ${cardStyle.text.includes('text-white') ? 'text-white/90' : 'text-gray-700'}`}>{getNextBelt(belt)}</span>
                                </p>

                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className={`font-semibold ${cardStyle.text.includes('text-white') ? 'text-white/70' : 'text-gray-500'}`}>Progress to Grading</span>
                                        <span className={`font-black ${cardStyle.text.includes('text-white') ? 'text-white' : 'text-indigo-600'}`}>45%</span>
                                    </div>
                                    <div className={`w-full rounded-full h-2.5 ${cardStyle.text.includes('text-white') ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        <div
                                            className={`h-2.5 rounded-full ${cardStyle.text.includes('text-white') ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-indigo-600'}`}
                                            style={{ width: '45%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold text-gray-900">My Progress</h3>
                                <span className="text-xs text-gray-400 font-medium">This month</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {progressStats.map((stat, i) => (
                                    <div key={i} className={`border rounded-xl p-4 text-center ${stat.color.split(' ').slice(0, 2).join(' ')}`}>
                                        <div className="text-2xl mb-2">{stat.icon}</div>
                                        <p className={`text-2xl font-black ${stat.color.split(' ').slice(2).join(' ')}`}>{stat.val}</p>
                                        <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Schedule + Metrics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upcoming Schedule */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900">Upcoming Schedule</h3>
                                <Link href={route('athlete.schedule')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((slot) => {
                                        const coaches = slot.group.coaches?.map(c => c.name).join(', ') || 'No Coach';
                                        const loc = slot.facility?.name || slot.location || 'Main Hall';
                                        const dayColor = {
                                            Monday: 'border-indigo-400 bg-indigo-50/50 text-indigo-700',
                                            Tuesday: 'border-purple-400 bg-purple-50/50 text-purple-700',
                                            Wednesday: 'border-blue-400 bg-blue-50/50 text-blue-700',
                                            Thursday: 'border-cyan-400 bg-cyan-50/50 text-cyan-700',
                                            Friday: 'border-emerald-400 bg-emerald-50/50 text-emerald-700',
                                            Saturday: 'border-amber-400 bg-amber-50/50 text-amber-700',
                                            Sunday: 'border-rose-400 bg-rose-50/50 text-rose-700',
                                        }[slot.day_of_week] || 'border-gray-400 bg-gray-50';

                                        return (
                                            <div key={slot.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-l-4 ${dayColor}`}>
                                                <div className="text-center w-16 shrink-0">
                                                    <p className="text-xs font-extrabold uppercase tracking-wide">{slot.day_of_week.substring(0, 3)}</p>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm">{slot.group.name}</p>
                                                    <p className="text-xs text-gray-500">{coaches} • {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate max-w-28 text-center">{loc}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No upcoming training sessions this week.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metrics & Tip */}
                        <div className="space-y-5">
                            {/* Coach-set Metrics */}
                            <MetricsCard athleteProfile={athleteProfile} />

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg">🎯</span>
                                    <p className="text-sm font-bold text-amber-900">Coach's Tip</p>
                                </div>
                                {athleteProfile?.coach_tip ? (
                                    <p className="text-xs text-amber-700 leading-relaxed">{athleteProfile.coach_tip}</p>
                                ) : (
                                    <p className="text-xs text-amber-500 italic leading-relaxed">No tip yet — your coach will add one soon.</p>
                                )}
                            </div>

                            {/* Points Leaderboard */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-5 py-3.5 border-b border-amber-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-amber-900">Top Athletes (Points)</h3>
                                        <p className="text-xs text-amber-600 mt-0.5">Top point earners in the club</p>
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
                                                        <span className="inline-block text-[8px] font-bold text-gray-400 uppercase">
                                                            {ath.belt_rank}
                                                        </span>
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
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
