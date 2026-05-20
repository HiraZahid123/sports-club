import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ManagerDashboard({ stats }: { stats: any }) {
    const statCards = [
        {
            name: 'Total Athletes',
            value: stats.totalMembers,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            change: '+12%',
            changeType: 'increase' as const,
            iconBg: 'bg-blue-50 text-blue-600',
            accent: 'border-blue-500',
            valueCls: 'text-blue-600',
        },
        {
            name: 'Active Groups',
            value: stats.activeGroups,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            change: '+2',
            changeType: 'increase' as const,
            iconBg: 'bg-indigo-50 text-indigo-600',
            accent: 'border-indigo-500',
            valueCls: 'text-indigo-600',
        },
        {
            name: 'Monthly Revenue',
            value: `$${stats.monthlyRevenue}`,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            change: '+18%',
            changeType: 'increase' as const,
            iconBg: 'bg-emerald-50 text-emerald-600',
            accent: 'border-emerald-500',
            valueCls: 'text-emerald-600',
        },
        {
            name: 'Unpaid Dues',
            value: stats.overdueCount,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            change: '-5',
            changeType: 'decrease' as const,
            iconBg: 'bg-amber-50 text-amber-600',
            accent: 'border-amber-500',
            valueCls: 'text-amber-600',
        },
    ];

    const quickActions = [
        { label: 'Add New Athlete', href: route('manager.members.index'), icon: '👤', color: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200' },
        { label: 'Manage Training Groups', href: route('manager.groups.index'), icon: '🏆', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
        { label: 'View Financial Reports', href: route('manager.reports.index'), icon: '📊', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
        { label: 'Billing & Payments', href: route('manager.billing.index'), icon: '💳', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Club Manager Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening today.</p>
                </div>
            }
        >
            <Head title="Manager Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCards.map((card) => (
                            <div key={card.name} className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden border-b-4 ${card.accent}`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                                            {card.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {card.change}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{card.name}</p>
                                    <p className={`text-3xl font-black ${card.valueCls}`}>{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="p-6 border-b border-gray-50">
                                <h3 className="text-base font-bold text-gray-900">Recent Club Activity</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Latest registrations and events</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { initial: 'A', name: 'Alex Johnson', action: 'joined Beginners Taekwondo group', time: '2h ago', color: 'bg-blue-100 text-blue-700' },
                                    { initial: 'S', name: 'Sarah Lee', action: 'payment recorded — $85.00', time: '4h ago', color: 'bg-emerald-100 text-emerald-700' },
                                    { initial: 'M', name: 'Mike Chen', action: 'advanced to Intermediate group', time: '1d ago', color: 'bg-indigo-100 text-indigo-700' },
                                    { initial: 'J', name: 'Jamie Smith', action: 'upcoming belt grading scheduled', time: '1d ago', color: 'bg-amber-100 text-amber-700' },
                                    { initial: 'R', name: 'Rachel Park', action: 'new parent registration completed', time: '2d ago', color: 'bg-purple-100 text-purple-700' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${item.color}`}>
                                            {item.initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{item.action}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions + Notice */}
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-gray-900 mb-5">Quick Actions</h3>
                                <div className="space-y-3">
                                    {quickActions.map((action) => (
                                        <Link
                                            key={action.label}
                                            href={action.href}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${action.color}`}
                                        >
                                            <span>{action.icon}</span>
                                            {action.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg shrink-0">🏅</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900 mb-1">Upcoming Event</h4>
                                        <p className="text-xs text-amber-700 leading-relaxed">Regional Championship — Registration closes in <span className="font-bold">3 days</span>. Ensure all athletes are enrolled.</p>
                                        <button className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors">View Details →</button>
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
