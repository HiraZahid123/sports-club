import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
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
    Beginner:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Intermediate: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
    Advanced:     { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200'  },
    Elite:        { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";

export default function GroupsIndex({ groups, coaches, athletes }: { groups: Group[], coaches: Coach[], athletes: any[] }) {
    const [isCreating, setIsCreating]       = useState(false);
    const [editingGroup, setEditingGroup]   = useState<Group | null>(null);

    // ── Create form ──────────────────────────────────────────────
    const createForm = useForm({
        name: '', description: '', monthly_price: '',
        capacity: '', skill_level: 'Beginner', age_range: '',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route('manager.groups.store'), {
            onSuccess: () => { setIsCreating(false); createForm.reset(); },
        });
    };

    // ── Edit form ─────────────────────────────────────────────────
    const editForm = useForm({
        name: '', description: '', monthly_price: '',
        capacity: '', skill_level: 'Beginner', age_range: '',
    });

    const openEdit = (group: Group) => {
        editForm.setData({
            name:          group.name,
            description:   group.description ?? '',
            monthly_price: group.monthly_price,
            capacity:      group.capacity ? String(group.capacity) : '',
            skill_level:   group.skill_level ?? 'Beginner',
            age_range:     group.age_range ?? '',
        });
        setEditingGroup(group);
        setIsCreating(false);
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingGroup) return;
        editForm.put(route('manager.groups.update', editingGroup.id), {
            onSuccess: () => { setEditingGroup(null); editForm.reset(); },
        });
    };

    // ── Coach actions (only used inside Edit form) ────────────────
    const handleAssignCoach = (groupId: number, coachId: string) => {
        if (!coachId) return;
        router.post(
            route('manager.groups.assign', groupId),
            { user_id: coachId, role_in_group: 'Coach' },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Refresh editingGroup coaches from updated props
                    const updated = (page.props.groups as Group[]).find(g => g.id === groupId);
                    if (updated) setEditingGroup(updated);
                },
            }
        );
    };

    const handleRemoveCoach = (groupId: number, coachId: number, coachName: string) => {
        if (!confirm(`Remove Coach ${coachName} from this group?`)) return;
        router.post(
            route('manager.groups.remove', groupId),
            { user_id: coachId },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.groups as Group[]).find(g => g.id === groupId);
                    if (updated) setEditingGroup(updated);
                },
            }
        );
    };

    // ─────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Training Groups</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{groups.length} groups active</p>
                    </div>
                    <button
                        onClick={() => { setIsCreating(!isCreating); setEditingGroup(null); }}
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

                    {/* ── Create Group Form ─────────────────────────────── */}
                    {isCreating && (
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900">Create Training Group</h3>
                                <p className="text-xs text-indigo-600 mt-0.5">Define a new group for your club members</p>
                            </div>
                            <form onSubmit={submitCreate} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Group Name</label>
                                        <input
                                            type="text"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="e.g. Juniors Elite"
                                            className={inputClass}
                                        />
                                        {createForm.errors.name && <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price ($)</label>
                                        <input
                                            type="number"
                                            value={createForm.data.monthly_price}
                                            onChange={(e) => createForm.setData('monthly_price', e.target.value)}
                                            placeholder="0.00"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Skill Level</label>
                                        <select value={createForm.data.skill_level} onChange={(e) => createForm.setData('skill_level', e.target.value)} className={inputClass}>
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
                                            value={createForm.data.age_range}
                                            onChange={(e) => createForm.setData('age_range', e.target.value)}
                                            placeholder="e.g. 6–12 Years"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Max Capacity</label>
                                        <input
                                            type="number"
                                            value={createForm.data.capacity}
                                            onChange={(e) => createForm.setData('capacity', e.target.value)}
                                            placeholder="20"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={createForm.processing} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
                                        {createForm.processing ? 'Saving...' : 'Create Group'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Edit Group Form (with Coach Management) ────────── */}
                    {editingGroup && (
                        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-amber-900">Edit Group — {editingGroup.name}</h3>
                                    <p className="text-xs text-amber-600 mt-0.5">Update group info and manage coaches</p>
                                </div>
                                <button onClick={() => setEditingGroup(null)} className="text-amber-400 hover:text-amber-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Group Info Fields */}
                            <form onSubmit={submitEdit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Group Name</label>
                                        <input
                                            type="text"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className={inputClass}
                                        />
                                        {editForm.errors.name && <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price ($)</label>
                                        <input
                                            type="number"
                                            value={editForm.data.monthly_price}
                                            onChange={(e) => editForm.setData('monthly_price', e.target.value)}
                                            className={inputClass}
                                        />
                                        {editForm.errors.monthly_price && <p className="mt-1 text-xs text-red-600">{editForm.errors.monthly_price}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        rows={2}
                                        placeholder="Optional description..."
                                        className={inputClass}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Skill Level</label>
                                        <select value={editForm.data.skill_level} onChange={(e) => editForm.setData('skill_level', e.target.value)} className={inputClass}>
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
                                            value={editForm.data.age_range}
                                            onChange={(e) => editForm.setData('age_range', e.target.value)}
                                            placeholder="e.g. 6–12 Years"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Max Capacity</label>
                                        <input
                                            type="number"
                                            value={editForm.data.capacity}
                                            onChange={(e) => editForm.setData('capacity', e.target.value)}
                                            placeholder="20"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* ── Coach Management Section ────────────────── */}
                                <div className="border-t border-gray-100 pt-5">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Coaches
                                    </p>

                                    {/* Assigned coaches list */}
                                    <div className="space-y-2 mb-3">
                                        {editingGroup.coaches.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-xl">
                                                No coaches assigned yet.
                                            </p>
                                        ) : (
                                            editingGroup.coaches.map((coach) => (
                                                <div key={coach.id} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0">
                                                            {coach.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-indigo-900">{coach.name}</span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-semibold">Coach</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCoach(editingGroup.id, coach.id, coach.name)}
                                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all font-medium"
                                                        title="Remove Coach"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Assign new coach dropdown */}
                                    {coaches.filter(c => !editingGroup.coaches.some(gc => gc.id === c.id)).length > 0 && (
                                        <div className="flex gap-2 items-center">
                                            <select
                                                defaultValue=""
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAssignCoach(editingGroup.id, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="flex-1 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-sm text-indigo-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            >
                                                <option value="" disabled>＋ Assign a coach to this group…</option>
                                                {coaches
                                                    .filter(c => !editingGroup.coaches.some(gc => gc.id === c.id))
                                                    .map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    )}

                                    {coaches.filter(c => !editingGroup.coaches.some(gc => gc.id === c.id)).length === 0 && (
                                        <p className="text-xs text-gray-400 italic">All available coaches have been assigned.</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-1">
                                    <button type="button" onClick={() => setEditingGroup(null)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={editForm.processing} className="px-6 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm">
                                        {editForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Groups Grid ───────────────────────────────────── */}
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
                                const fillRatio  = group.capacity ? (group.athletes_count / group.capacity) : 0;
                                const fillColor  = fillRatio >= 0.9 ? 'bg-red-400' : fillRatio >= 0.6 ? 'bg-amber-400' : 'bg-emerald-400';
                                const isEditing  = editingGroup?.id === group.id;

                                return (
                                    <div key={group.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${isEditing ? 'border-amber-300 ring-2 ring-amber-200' : 'border-gray-100'}`}>
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

                                            {/* Coaches — read-only display on card */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Coaches</p>
                                                {group.coaches.length === 0 ? (
                                                    <p className="text-xs text-gray-400 italic">No coaches assigned</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {group.coaches.map((coach) => (
                                                            <span key={coach.id} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                                                    {coach.name.charAt(0).toUpperCase()}
                                                                </span>
                                                                {coach.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-6 py-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                                            <button
                                                onClick={() => openEdit(group)}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Group
                                            </button>
                                            <span className="text-xs text-gray-300 font-medium">ID #{group.id}</span>
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
