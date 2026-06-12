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

export default function AthleteDashboard({ athleteProfile }: { athleteProfile?: AthleteProfile | null }) {
    const belt = athleteProfile?.belt_rank || '10. WHITE';
    const cardStyle = getBeltCardGradient(belt);
    const progressStats = [
        { label: 'Classes', val: '24', icon: '📚', color: 'bg-blue-50 border-blue-100 text-blue-600' },
        { label: 'Sparring', val: '15', icon: '🥊', color: 'bg-rose-50 border-rose-100 text-rose-600' },
        { label: 'Events', val: '2', icon: '🏅', color: 'bg-amber-50 border-amber-100 text-amber-600' },
        { label: 'Points', val: '450', icon: '⭐', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
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
                                <div className={`w-16 h-16 ${cardStyle.text.includes('text-white') ? 'bg-white/15 border-white/20' : 'bg-slate-900/10 border-slate-900/20'} backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-4 border shadow-inner`}>
                                    🥋
                                </div>
                                <p className={`${cardStyle.subtext} text-xs font-bold uppercase tracking-widest mb-1`}>Current Rank</p>
                                <h3 className={`text-2xl font-black mb-2 flex items-center gap-2 ${cardStyle.text}`}>
                                    <span className="inline-block h-3.5 w-7 rounded border shadow-sm shrink-0" style={getBeltStyle(belt)} />
                                    {belt}
                                </h3>
                                <p className={`${cardStyle.subtext} text-xs`}>Next: {getNextBelt(belt)} (Est. 3 months)</p>

                                <div className="mt-5">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className={`${cardStyle.subtext} font-medium`}>Progress to Grading</span>
                                        <span className={`${cardStyle.text} font-bold`}>45%</span>
                                    </div>
                                    <div className={`w-full ${cardStyle.text.includes('text-white') ? 'bg-white/15' : 'bg-slate-200'} rounded-full h-2.5`}>
                                        <div className={`${cardStyle.text.includes('text-white') ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-indigo-600'} h-2.5 rounded-full`} style={{ width: '45%' }}></div>
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
                                {[
                                    { day: '16', month: 'May', title: 'Elite Sparring Session', coach: 'Master Kim', time: '18:00', color: 'border-indigo-400 bg-indigo-50' },
                                    { day: '18', month: 'May', title: 'Belt Grading Prep', coach: 'Coach Lee', time: '16:00', color: 'border-emerald-400 bg-emerald-50' },
                                    { day: '22', month: 'May', title: 'Pattern Practice', coach: 'Master Kim', time: '17:30', color: 'border-blue-400 bg-blue-50' },
                                ].map((event, i) => (
                                    <div key={i} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-l-4 ${event.color}`}>
                                        <div className="text-center w-10 shrink-0">
                                            <p className="text-lg font-black text-gray-900 leading-none">{event.day}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{event.month}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                                            <p className="text-xs text-gray-500">{event.coach} • {event.time}</p>
                                        </div>
                                        <Link href={route('athlete.schedule')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 transition-colors">Details</Link>
                                    </div>
                                ))}
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
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Focus on your spinning heel kick this week. It will significantly boost your grading score!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
