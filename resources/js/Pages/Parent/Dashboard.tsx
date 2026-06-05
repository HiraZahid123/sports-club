import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

export default function ParentDashboard() {
    const children = [
        { name: 'Alex Smith', group: 'Juniors Taekwondo', status: 'Active', belt: '8. YELLOW', progress: 60, classes: 18 },
        { name: 'Sarah Smith', group: 'Elite Sparring', status: 'Active', belt: '4. BLUE', progress: 45, classes: 24 },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Parent Portal</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Monitor your children's training and manage payments</p>
                </div>
            }
        >
            <Head title="Parent Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Children Enrolled</p>
                            <p className="text-3xl font-black text-indigo-600">{children.length}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Next Payment Due</p>
                            <p className="text-xl font-black text-emerald-600">June 01</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Amount Due</p>
                            <p className="text-3xl font-black text-amber-600">$85</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Children Cards */}
                        <div className="lg:col-span-2 space-y-5">
                            <h3 className="text-base font-bold text-gray-900">My Children</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {children.map((child, idx) => {
                                    return (
                                        <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100">
                                                            {child.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{child.name}</p>
                                                            <p className="text-xs text-gray-500">{child.group}</p>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                        {child.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getBeltBadgeStyle(child.belt)}`}>
                                                        <span className="inline-block h-2 w-4 rounded-sm border shrink-0" style={getBeltStyle(child.belt)} />
                                                        {child.belt}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{child.classes} classes attended</span>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-gray-500">Belt Progress</span>
                                                        <span className="font-bold text-indigo-600">{child.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${child.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100">
                                                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                                                    View Full Progress
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Billing & Notices */}
                        <div className="space-y-5">
                            {/* Billing Summary */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-50">
                                    <h4 className="text-base font-bold text-gray-900">Billing Summary</h4>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Next Payment Due:</span>
                                        <span className="font-bold text-gray-900 text-sm">June 01, 2026</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Children:</span>
                                        <span className="font-semibold text-gray-700 text-sm">{children.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                                        <span className="text-xl font-black text-indigo-600">$85.00</span>
                                    </div>
                                    <Link
                                        href={route('parent.billing')}
                                        className="flex items-center justify-center gap-2 mt-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200"
                                    >
                                        Pay Now
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Notices */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-50">
                                    <h4 className="text-base font-bold text-gray-900">Recent Notices</h4>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[
                                        { title: 'Summer Camp Registration', msg: 'Registration for the July summer camp is now open for all juniors.', dot: 'bg-blue-400', time: '2d ago' },
                                        { title: 'Belt Grading Scheduled', msg: 'The next belt grading ceremony is set for June 15th.', dot: 'bg-amber-400', time: '4d ago' },
                                    ].map((notice, i) => (
                                        <div key={i} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start gap-2.5">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.dot}`}></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{notice.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notice.msg}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5">{notice.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
