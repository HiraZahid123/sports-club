import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Group {
    id: number;
    name: string;
    description: string;
    monthly_price: string;
    capacity: number;
    skill_level: string;
    age_range: string;
    athletes_count: number;
    coaches: any[];
}

interface Coach {
    id: number;
    name: string;
}

const skillConfig: Record<string, { bg: string; text: string; border: string }> = {
    Beginner: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Advanced: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    Elite: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export default function GroupsIndex({ groups, coaches, athletes }: { groups: Group[], coaches: Coach[], athletes: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        monthly_price: '',
        capacity: '',
        skill_level: 'Beginner',
        age_range: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('manager.groups.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Training Groups</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{groups.length} groups active</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isCreating
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                        }`}
                    >
                        {isCreating ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Group
                            </>
                        )}
                    </button>
                </div>
            }
        >
            <Head title="Training Groups" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Create Group Form */}
                    {isCreating && (
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900">Create Training Group</h3>
                                <p className="text-xs text-indigo-600 mt-0.5">Define a new group for your club members</p>
                            </div>
                            <form onSubmit={submit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Group Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Juniors Elite"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price ($)</label>
                                        <input
                                            type="number"
                                            value={data.monthly_price}
                                            onChange={(e) => setData('monthly_price', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Skill Level</label>
                                        <select
                                            value={data.skill_level}
                                            onChange={(e) => setData('skill_level', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Elite">Elite</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Age Range</label>
                                        <input
                                            type="text"
                                            value={data.age_range}
                                            onChange={(e) => setData('age_range', e.target.value)}
                                            placeholder="e.g. 6–12 Years"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Max Capacity</label>
                                        <input
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            placeholder="20"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={processing} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
                                        {processing ? 'Saving...' : 'Create Group'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Groups Grid */}
                    {groups.length === 0 && !isCreating ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏆</div>
                            <p className="font-semibold text-gray-900 mb-1">No training groups yet</p>
                            <p className="text-sm text-gray-500 mb-5">Create your first group to start organizing athletes.</p>
                            <button onClick={() => setIsCreating(true)} className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                                Create Your First Group
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {groups.map((group) => {
                                const skillStyle = skillConfig[group.skill_level] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                                const fillRatio = group.capacity ? (group.athletes_count / group.capacity) : 0;
                                const fillColor = fillRatio >= 0.9 ? 'bg-red-400' : fillRatio >= 0.6 ? 'bg-amber-400' : 'bg-emerald-400';

                                return (
                                    <div key={group.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                                        <div className="p-6 flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{group.name}</h3>
                                                <span className={`ml-2 shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border ${skillStyle.bg} ${skillStyle.text} ${skillStyle.border}`}>
                                                    {group.skill_level}
                                                </span>
                                            </div>

                                            {group.age_range && (
                                                <p className="text-xs text-gray-400 font-medium mb-3">Ages: {group.age_range}</p>
                                            )}

                                            <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                                                {group.description || 'No description provided.'}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mb-5">
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Athletes</p>
                                                    <p className="text-xl font-black text-gray-900">{group.athletes_count}<span className="text-sm font-medium text-gray-400">/{group.capacity || '∞'}</span></p>
                                                    {group.capacity > 0 && (
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                            <div className={`h-1.5 rounded-full ${fillColor} transition-all`} style={{ width: `${Math.min(fillRatio * 100, 100)}%` }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="bg-emerald-50 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Monthly Fee</p>
                                                    <p className="text-xl font-black text-emerald-700">${group.monthly_price}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Coaches</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-1.5">
                                                        {group.coaches.slice(0, 4).map((coach, i) => (
                                                            <div key={i} title={coach.name} className="w-7 h-7 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                                                {coach.name.charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {group.coaches.length === 0 && (
                                                        <span className="text-xs text-gray-400 italic">No coach assigned</span>
                                                    )}
                                                    {group.coaches.length > 4 && (
                                                        <span className="text-xs text-gray-500 font-medium">+{group.coaches.length - 4} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 py-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                                            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Manage Group</button>
                                            <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Settings</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
