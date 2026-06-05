import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface AthleteProfile {
    belt_rank: string | null;
    date_of_birth: string | null;
    weight_class: string | null;
    medical_info: string | null;
    last_grading_date: string | null;
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
}

interface CoachProfile {
    specialization: string | null;
    hourly_rate: string;
    bio: string | null;
}

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

function getAge(dob: string | null): string {
    if (!dob) return '—';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)).toString();
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

function formatCurrency(amount: string | number) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(dateStr: string): number {
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

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
    const totalAthletes  = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);
    const selectedGroup  = groups[selectedGroupIdx] ?? null;

    const days = nextPayout ? daysUntil(nextPayout.payout_date) : null;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Coach Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your training groups and track athlete performance</p>
                </div>
            }
        >
            <Head title="Coach Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ── Quick Stats ─────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                            <p className="text-3xl font-black text-amber-600">{formatCurrency(totalEarned)}</p>
                            <p className="text-xs text-gray-400 mt-1">all time</p>
                        </div>
                    </div>

                    {/* ── Salary Section ──────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Next Payout Card */}
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
                                        {/* Amount */}
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
                                                <p className="text-4xl font-black text-emerald-600">{formatCurrency(nextPayout.amount)}</p>
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

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Payout Date</p>
                                                <p className="text-sm font-bold text-gray-800">{formatDate(nextPayout.payout_date)}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    Pending
                                                </span>
                                            </div>
                                        </div>

                                        {nextPayout.notes && (
                                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1">Note from Manager</p>
                                                <p className="text-sm text-indigo-800">{nextPayout.notes}</p>
                                            </div>
                                        )}

                                        {coachProfile?.hourly_rate && Number(coachProfile.hourly_rate) > 0 && (
                                            <p className="text-xs text-gray-400">
                                                Hourly rate: <span className="font-semibold text-gray-600">{formatCurrency(coachProfile.hourly_rate)}/hr</span>
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-4">📭</div>
                                        <p className="font-semibold text-gray-700 mb-1">No pending payout</p>
                                        <p className="text-sm text-gray-400">Your manager hasn't scheduled a payout yet.</p>
                                        {coachProfile?.hourly_rate && Number(coachProfile.hourly_rate) > 0 && (
                                            <p className="text-xs text-gray-400 mt-3">
                                                Your rate: <span className="font-semibold text-gray-600">{formatCurrency(coachProfile.hourly_rate)}/hr</span>
                                            </p>
                                        )}
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
                                        <p className="text-xs text-gray-400 mt-1">Paid payouts will appear here.</p>
                                    </div>
                                ) : (
                                    payoutHistory.map((payout) => (
                                        <div key={payout.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(payout.amount)}</p>
                                                    <p className="text-xs text-gray-400">{formatDate(payout.payout_date)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Paid
                                                </span>
                                                {payout.notes && (
                                                    <p className="text-[10px] text-gray-400 mt-1 max-w-28 truncate">{payout.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Groups + Athletes ───────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Training Groups */}
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
                                            onClick={() => setSelectedGroupIdx(idx)}
                                            className={`w-full text-left flex items-center justify-between px-6 py-4 transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${isSelected ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{group.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${skillStyle}`}>
                                                            {group.skill_level}
                                                        </span>
                                                        {group.age_range && (
                                                            <span className="text-[10px] text-gray-400">{group.age_range}</span>
                                                        )}
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
                                        <p className="text-xs text-gray-400 mt-1">Contact your manager to be assigned to a group.</p>
                                    </div>
                                )}
                            </div>

                            {groups.length > 0 && (
                                <div className="px-6 py-4 bg-slate-50 border-t border-gray-100">
                                    <Link
                                        href={route('coach.schedule')}
                                        className="w-full inline-block text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                                    >
                                        View Full Schedule
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Athletes Panel */}
                        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {selectedGroup ? (
                                <>
                                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">Athletes — {selectedGroup.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{selectedGroup.athletes.length} athletes enrolled</p>
                                        </div>
                                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🥋</div>
                                    </div>

                                    <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                                        {selectedGroup.athletes.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">👤</div>
                                                <p className="text-sm font-medium text-gray-500">No athletes in this group</p>
                                                <p className="text-xs text-gray-400 mt-1">Ask your manager to assign athletes.</p>
                                            </div>
                                        ) : (
                                            selectedGroup.athletes.map((athlete) => {
                                                const profile    = athlete.athlete_profile;
                                                const belt       = profile?.belt_rank ?? null;
                                                const beltStyle  = belt ? (beltColors[belt] ?? 'bg-gray-100 text-gray-700') : null;
                                                const age        = getAge(profile?.date_of_birth ?? null);

                                                return (
                                                    <div key={athlete.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                                {athlete.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className="font-semibold text-gray-900 text-sm">{athlete.name}</p>
                                                                    {belt && (
                                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${beltStyle}`}>
                                                                            {belt} Belt
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{athlete.email}</p>

                                                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                                    {age !== '—' && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Age</span>
                                                                            <span className="text-xs font-semibold text-gray-700">{age} yrs</span>
                                                                        </div>
                                                                    )}
                                                                    {profile?.weight_class && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Weight</span>
                                                                            <span className="text-xs font-semibold text-gray-700">{profile.weight_class}</span>
                                                                        </div>
                                                                    )}
                                                                    {profile?.last_grading_date && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Last Grading</span>
                                                                            <span className="text-xs font-semibold text-gray-700">
                                                                                {new Date(profile.last_grading_date).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {!profile && (
                                                                        <span className="text-xs text-gray-400 italic">No profile set up</span>
                                                                    )}
                                                                </div>

                                                                {profile?.medical_info && (
                                                                    <div className="mt-2 px-2.5 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
                                                                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-0.5">Medical Note</p>
                                                                        <p className="text-xs text-amber-800">{profile.medical_info}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
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
