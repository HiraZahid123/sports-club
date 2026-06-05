import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getBeltBadgeStyle, getBeltBarClass } from '@/beltHelpers';

interface AthleteProfile {
    belt_rank?: string | null;
    date_of_birth?: string | null;
    medical_info?: string | null;
    weight_class?: string | null;
}

export default function AthleteDashboard({ athleteProfile }: { athleteProfile?: AthleteProfile | null }) {
    const belt = athleteProfile?.belt_rank || '10. WHITE';
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
                        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative">
                                <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/20 shadow-inner">
                                    🥋
                                </div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Current Rank</p>
                                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                                    <span className={`inline-block h-3.5 w-7 rounded border shadow-sm ${getBeltBarClass(belt)} shrink-0`} />
                                    {belt}
                                </h3>
                                <p className="text-indigo-200 text-xs">Next: Red Belt (Est. 3 months)</p>

                                <div className="mt-5">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-indigo-200 font-medium">Progress to Grading</span>
                                        <span className="text-white font-bold">45%</span>
                                    </div>
                                    <div className="w-full bg-white/15 rounded-full h-2.5">
                                        <div className="bg-white h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" style={{ width: '45%' }}></div>
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

                    {/* Schedule + Goals Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upcoming Schedule */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900">Upcoming Schedule</h3>
                                <Link href={route('athlete.schedule')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { day: '16', month: 'May', title: 'Elite Sparring Session', coach: 'Master Kim', time: '06:00 PM', color: 'border-indigo-400 bg-indigo-50' },
                                    { day: '18', month: 'May', title: 'Belt Grading Prep', coach: 'Coach Lee', time: '04:00 PM', color: 'border-emerald-400 bg-emerald-50' },
                                    { day: '22', month: 'May', title: 'Pattern Practice', coach: 'Master Kim', time: '05:30 PM', color: 'border-blue-400 bg-blue-50' },
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

                        {/* Goals & Tips */}
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-gray-900 mb-4">Training Goals</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-medium text-gray-600">Kick Accuracy</span>
                                            <span className="font-bold text-indigo-600">78%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-medium text-gray-600">Flexibility</span>
                                            <span className="font-bold text-emerald-600">62%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-medium text-gray-600">Pattern Forms</span>
                                            <span className="font-bold text-amber-500">90%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-amber-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
