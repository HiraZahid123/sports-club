import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const skillColors: Record<string, string> = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-100',
    Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Elite: 'bg-amber-50 text-amber-700 border-amber-100',
};

export default function CoachDashboard({ groups }: { groups: any[] }) {
    const totalAthletes = groups.reduce((sum, g) => sum + (g.athletes?.length || 0), 0);

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

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Training Groups */}
                        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                                    return (
                                        <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-sm border border-emerald-100">
                                                    {group.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{group.name}</p>
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
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Athletes</p>
                                                <p className="text-lg font-black text-gray-900">{group.athletes?.length || 0}</p>
                                            </div>
                                        </div>
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

                        {/* Performance Panel */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-gray-900 mb-5">Group Performance</h3>

                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Overall Stamina</span>
                                            <span className="text-sm font-bold text-indigo-600">82%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Technical Skills</span>
                                            <span className="text-sm font-bold text-amber-500">65%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                                            <span className="text-sm font-bold text-emerald-600">91%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '91%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">💬</div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 mb-1">Team Update</p>
                                        <p className="text-sm text-blue-700 leading-relaxed italic">
                                            "Great work last week! The team shows a 15% improvement in sparring speed. Keep up the momentum!"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
