import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface ScheduleSlot {
    [key: string]: any;
    id?: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string;
    notes: string;
    facility_id: string;
    facility?: Facility | null;
}

interface AgeCategory {
    id: number;
    name: string;
    min_age: number | null;
    max_age: number | null;
}

interface Facility {
    id: number;
    name: string;
    type: string | null;
}

interface Group {
    id: number;
    name: string;
    description: string;
    monthly_price: string;
    capacity: number;
    skill_level: string;
    age_range: string;
    age_category_id: number | null;
    age_category: AgeCategory | null;
    athletes_count: number;
    coaches: any[];
    athletes: any[];
    schedules: ScheduleSlot[];
}

interface Coach {
    id: number;
    name: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_SHORT: Record<string, string> = {
    Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
    Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

const DAY_COLOR: Record<string, string> = {
    Monday:    'bg-indigo-100 text-indigo-700',
    Tuesday:   'bg-purple-100 text-purple-700',
    Wednesday: 'bg-blue-100   text-blue-700',
    Thursday:  'bg-cyan-100   text-cyan-700',
    Friday:    'bg-emerald-100 text-emerald-700',
    Saturday:  'bg-amber-100  text-amber-700',
    Sunday:    'bg-rose-100   text-rose-700',
};

const skillConfig: Record<string, { bg: string; text: string; border: string }> = {
    Beginner:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Intermediate: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
    Advanced:     { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200'  },
    Elite:        { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
};

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const smallInput = "w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";

const fmt12 = (t: string) => {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
};

const blankSlot = (): ScheduleSlot => ({
    day_of_week: 'Monday', start_time: '09:00', end_time: '10:00', location: '', notes: '', facility_id: '',
});

// ── Component ──────────────────────────────────────────────────────────────
export default function GroupsIndex({ groups, coaches, athletes, ageCategories, facilities }: { groups: Group[], coaches: Coach[], athletes: any[], ageCategories: AgeCategory[], facilities: Facility[] }) {
    const [isCreating, setIsCreating]     = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    // local draft of schedule while editing
    const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
    const [scheduleSaving, setScheduleSaving] = useState(false);

    // ── Create form ────────────────────────────────────────────────────────
    const createForm = useForm({
        name: '', description: '', monthly_price: '',
        capacity: '', skill_level: 'Beginner', age_category_id: '',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route('manager.groups.store'), {
            onSuccess: () => { setIsCreating(false); createForm.reset(); },
        });
    };

    // ── Edit form ──────────────────────────────────────────────────────────
    const editForm = useForm({
        name: '', description: '', monthly_price: '',
        capacity: '', skill_level: 'Beginner', age_category_id: '',
    });

    const openEdit = (group: Group) => {
        editForm.setData({
            name:          group.name,
            description:   group.description ?? '',
            monthly_price: group.monthly_price,
            capacity:      group.capacity ? String(group.capacity) : '',
            skill_level:   group.skill_level ?? 'Beginner',
            age_category_id: group.age_category_id ? String(group.age_category_id) : '',
        });
        setScheduleSlots(
            group.schedules.length > 0
                ? group.schedules.map(s => ({
                    ...s,
                    start_time: s.start_time ? s.start_time.substring(0, 5) : '',
                    end_time: s.end_time ? s.end_time.substring(0, 5) : '',
                    facility_id: s.facility_id ? String(s.facility_id) : '',
                  }))
                : []
        );
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

    // ── Coach actions ──────────────────────────────────────────────────────
    const handleAssignCoach = (groupId: number, coachId: string) => {
        if (!coachId) return;
        router.post(route('manager.groups.assign', groupId),
            { user_id: coachId, role_in_group: 'Coach' },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.groups as Group[]).find(g => g.id === groupId);
                    if (updated) setEditingGroup(updated);
                },
            }
        );
    };

    const handleRemoveCoach = (groupId: number, coachId: number, coachName: string) => {
        if (!confirm(`Remove Coach ${coachName} from this group?`)) return;
        router.post(route('manager.groups.remove', groupId),
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

    // ── Athlete actions ────────────────────────────────────────────────────
    const handleAssignAthlete = (groupId: number, athleteId: string) => {
        if (!athleteId) return;
        router.post(route('manager.groups.assign', groupId),
            { user_id: athleteId, role_in_group: 'Athlete' },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.groups as Group[]).find(g => g.id === groupId);
                    if (updated) setEditingGroup(updated);
                },
            }
        );
    };

    const handleRemoveAthlete = (groupId: number, athleteId: number, athleteName: string) => {
        if (!confirm(`Remove ${athleteName} from this group?`)) return;
        router.post(route('manager.groups.remove', groupId),
            { user_id: athleteId },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.groups as Group[]).find(g => g.id === groupId);
                    if (updated) setEditingGroup(updated);
                },
            }
        );
    };

    const handleMoveAthlete = (fromGroupId: number, toGroupId: string, athleteId: number) => {
        if (!toGroupId) return;
        router.post(route('manager.groups.remove', fromGroupId),
            { user_id: athleteId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.post(route('manager.groups.assign', toGroupId),
                        { user_id: athleteId, role_in_group: 'Athlete' },
                        {
                            preserveScroll: true,
                            onSuccess: (page) => {
                                const updated = (page.props.groups as Group[]).find(g => g.id === fromGroupId);
                                if (updated) setEditingGroup(updated);
                            },
                        }
                    );
                },
            }
        );
    };

    // ── Schedule slot helpers ──────────────────────────────────────────────
    const addSlot = () => setScheduleSlots(prev => [...prev, blankSlot()]);

    const removeSlot = (idx: number) =>
        setScheduleSlots(prev => prev.filter((_, i) => i !== idx));

    const updateSlot = (idx: number, field: keyof ScheduleSlot, value: string) =>
        setScheduleSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));

    const saveSchedule = () => {
        if (!editingGroup) return;
        setScheduleSaving(true);
        router.post(
            route('manager.groups.schedule', editingGroup.id),
            { schedules: scheduleSlots },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.groups as Group[]).find(g => g.id === editingGroup.id);
                    if (updated) {
                        setEditingGroup(updated);
                        setScheduleSlots(updated.schedules.map(s => ({
                            ...s,
                            start_time: s.start_time ? s.start_time.substring(0, 5) : '',
                            end_time: s.end_time ? s.end_time.substring(0, 5) : '',
                        })));
                    }
                    setScheduleSaving(false);
                },
                onError: (errors) => {
                    setScheduleSaving(false);
                    const firstError = Object.values(errors)[0];
                    if (firstError) {
                        alert(firstError);
                    }
                },
            }
        );
    };

    // ──────────────────────────────────────────────────────────────────────
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
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Group</>
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
                                        <input type="text" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="e.g. Juniors Elite" className={inputClass} />
                                        {createForm.errors.name && <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price ($)</label>
                                        <input type="number" value={createForm.data.monthly_price} onChange={e => createForm.setData('monthly_price', e.target.value)} placeholder="0.00" className={inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Skill Level</label>
                                        <select value={createForm.data.skill_level} onChange={e => createForm.setData('skill_level', e.target.value)} className={inputClass}>
                                            {['Beginner','Intermediate','Advanced','Elite'].map(l => <option key={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Age Category</label>
                                        <select value={createForm.data.age_category_id} onChange={e => createForm.setData('age_category_id', e.target.value)} className={inputClass}>
                                            <option value="">— None —</option>
                                            {ageCategories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}{c.min_age != null || c.max_age != null ? ` (${c.min_age ?? '0'}–${c.max_age ?? '∞'})` : ''}</option>
                                            ))}
                                        </select>
                                        {ageCategories.length === 0 && (
                                            <p className="mt-1 text-xs text-gray-400">No age categories yet — add some in Club Setup.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Max Capacity</label>
                                        <input type="number" value={createForm.data.capacity} onChange={e => createForm.setData('capacity', e.target.value)} placeholder="20" className={inputClass} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                                    <button type="submit" disabled={createForm.processing} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
                                        {createForm.processing ? 'Saving...' : 'Create Group'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Edit Group Panel ──────────────────────────────── */}
                    {editingGroup && (
                        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-amber-900">Edit Group — {editingGroup.name}</h3>
                                    <p className="text-xs text-amber-600 mt-0.5">Update group info, coaches and schedule</p>
                                </div>
                                <button onClick={() => setEditingGroup(null)} className="text-amber-400 hover:text-amber-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-8">

                                {/* ── Group Info ─────────────────────────── */}
                                <form onSubmit={submitEdit} className="space-y-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        Group Information
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Group Name</label>
                                            <input type="text" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className={inputClass} />
                                            {editForm.errors.name && <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price ($)</label>
                                            <input type="number" value={editForm.data.monthly_price} onChange={e => editForm.setData('monthly_price', e.target.value)} className={inputClass} />
                                            {editForm.errors.monthly_price && <p className="mt-1 text-xs text-red-600">{editForm.errors.monthly_price}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                                        <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} rows={2} placeholder="Optional description..." className={inputClass} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Skill Level</label>
                                            <select value={editForm.data.skill_level} onChange={e => editForm.setData('skill_level', e.target.value)} className={inputClass}>
                                                {['Beginner','Intermediate','Advanced','Elite'].map(l => <option key={l}>{l}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Age Category</label>
                                            <select value={editForm.data.age_category_id} onChange={e => editForm.setData('age_category_id', e.target.value)} className={inputClass}>
                                                <option value="">— None —</option>
                                                {ageCategories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}{c.min_age != null || c.max_age != null ? ` (${c.min_age ?? '0'}–${c.max_age ?? '∞'})` : ''}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Max Capacity</label>
                                            <input type="number" value={editForm.data.capacity} onChange={e => editForm.setData('capacity', e.target.value)} placeholder="20" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setEditingGroup(null)} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                                        <button type="submit" disabled={editForm.processing} className="px-6 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm">
                                            {editForm.processing ? 'Saving...' : 'Save Group Info'}
                                        </button>
                                    </div>
                                </form>

                                {/* ── Coach Management ───────────────────── */}
                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Coaches
                                    </p>
                                    <div className="space-y-2 mb-3">
                                        {editingGroup.coaches.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-xl">No coaches assigned yet.</p>
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
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        Remove
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {coaches.filter(c => !editingGroup.coaches.some(gc => gc.id === c.id)).length > 0 && (
                                        <select
                                            defaultValue=""
                                            onChange={(e) => { if (e.target.value) { handleAssignCoach(editingGroup.id, e.target.value); e.target.value = ''; } }}
                                            className="w-full rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-sm text-indigo-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                                        >
                                            <option value="" disabled>＋ Assign a coach to this group…</option>
                                            {coaches.filter(c => !editingGroup.coaches.some(gc => gc.id === c.id)).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* ── Athlete Management ─────────────────── */}
                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Athletes
                                        <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">{editingGroup.athletes.length}</span>
                                    </p>

                                    {/* Current athletes list */}
                                    <div className="space-y-2 mb-3">
                                        {editingGroup.athletes.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic py-2 px-3 bg-gray-50 rounded-xl">No athletes assigned yet.</p>
                                        ) : (
                                            editingGroup.athletes.map((athlete) => (
                                                <div key={athlete.id} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0">
                                                            {athlete.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-blue-900 truncate">{athlete.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0 ml-3">
                                                        {/* Move to another group */}
                                                        {groups.filter(g => g.id !== editingGroup.id).length > 0 && (
                                                            <select
                                                                defaultValue=""
                                                                onChange={(e) => {
                                                                    if (e.target.value) {
                                                                        handleMoveAthlete(editingGroup.id, e.target.value, athlete.id);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                                className="text-xs rounded-lg border border-blue-200 bg-white text-blue-700 px-2 py-1 focus:outline-none focus:border-blue-400 transition-all"
                                                            >
                                                                <option value="" disabled>Move to…</option>
                                                                {groups.filter(g => g.id !== editingGroup.id).map(g => (
                                                                    <option key={g.id} value={g.id}>{g.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAthlete(editingGroup.id, athlete.id, athlete.name)}
                                                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all font-medium"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Add athlete dropdown */}
                                    {athletes.filter(a => !editingGroup.athletes.some(ga => ga.id === a.id)).length > 0 && (
                                        <select
                                            defaultValue=""
                                            onChange={(e) => { if (e.target.value) { handleAssignAthlete(editingGroup.id, e.target.value); e.target.value = ''; } }}
                                            className="w-full rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-3 py-2 text-sm text-blue-700 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                        >
                                            <option value="" disabled>＋ Assign an athlete to this group…</option>
                                            {athletes.filter(a => !editingGroup.athletes.some(ga => ga.id === a.id)).map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    )}

                                    {athletes.length === 0 && (
                                        <p className="text-xs text-gray-400 italic">No athletes in your club yet. Add members first.</p>
                                    )}
                                </div>

                                {/* ── Schedule Management ────────────────── */}
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Weekly Schedule
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addSlot}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            Add Slot
                                        </button>
                                    </div>

                                    {scheduleSlots.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            <div className="text-2xl mb-2">📅</div>
                                            <p className="text-sm text-gray-500 font-medium">No schedule yet</p>
                                            <p className="text-xs text-gray-400 mt-1">Click "Add Slot" to add a training session</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Column headers */}
                                            <div className="grid grid-cols-12 gap-2 px-1">
                                                {['Day', 'Start', 'End', 'Location', 'Notes', ''].map((h, i) => (
                                                    <p key={i} className={`text-[10px] font-bold text-gray-400 uppercase tracking-wide ${i === 0 ? 'col-span-2' : i === 3 ? 'col-span-3' : i === 4 ? 'col-span-2' : i === 5 ? 'col-span-1' : 'col-span-2'}`}>{h}</p>
                                                ))}
                                            </div>

                                            {scheduleSlots.map((slot, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                                                    {/* Day */}
                                                    <div className="col-span-2">
                                                        <select
                                                            value={slot.day_of_week}
                                                            onChange={e => updateSlot(idx, 'day_of_week', e.target.value)}
                                                            className={smallInput}
                                                        >
                                                            {DAYS.map(d => <option key={d}>{d}</option>)}
                                                        </select>
                                                    </div>
                                                    {/* Start */}
                                                    <div className="col-span-2">
                                                        <input type="time" value={slot.start_time} onChange={e => updateSlot(idx, 'start_time', e.target.value)} className={smallInput} />
                                                    </div>
                                                    {/* End */}
                                                    <div className="col-span-2">
                                                        <input type="time" value={slot.end_time} onChange={e => updateSlot(idx, 'end_time', e.target.value)} className={smallInput} />
                                                    </div>
                                                    {/* Location */}
                                                    <div className="col-span-3">
                                                        {facilities.length > 0 ? (
                                                            <select value={slot.facility_id} onChange={e => updateSlot(idx, 'facility_id', e.target.value)} className={smallInput}>
                                                                <option value="">— No facility —</option>
                                                                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                                            </select>
                                                        ) : (
                                                            <input type="text" value={slot.location} onChange={e => updateSlot(idx, 'location', e.target.value)} placeholder="e.g. Hall A" className={smallInput} />
                                                        )}
                                                    </div>
                                                    {/* Notes */}
                                                    <div className="col-span-2">
                                                        <input type="text" value={slot.notes} onChange={e => updateSlot(idx, 'notes', e.target.value)} placeholder="Notes…" className={smallInput} />
                                                    </div>
                                                    {/* Remove */}
                                                    <div className="col-span-1 flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSlot(idx)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={saveSchedule}
                                            disabled={scheduleSaving}
                                            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {scheduleSaving ? (
                                                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</>
                                            ) : (
                                                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save Schedule</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>{/* /p-6 */}
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
                                            {/* Name + Skill */}
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{group.name}</h3>
                                                <span className={`ml-2 shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border ${skillStyle.bg} ${skillStyle.text} ${skillStyle.border}`}>
                                                    {group.skill_level}
                                                </span>
                                            </div>

                                            {(group.age_category?.name || group.age_range) && <p className="text-xs text-gray-400 font-medium mb-3">Ages: {group.age_category?.name ?? group.age_range}</p>}
                                            <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">{group.description || 'No description provided.'}</p>

                                            {/* Stats */}
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

                                            {/* Coaches (read-only) */}
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Coaches</p>
                                                {group.coaches.length === 0 ? (
                                                    <p className="text-xs text-gray-400 italic">No coaches assigned</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {group.coaches.map(coach => (
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

                                            {/* Schedule (read-only) */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Schedule</p>
                                                {group.schedules.length === 0 ? (
                                                    <p className="text-xs text-gray-400 italic">No schedule set</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {group.schedules.map((s, i) => (
                                                            <span key={i} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg ${DAY_COLOR[s.day_of_week] ?? 'bg-gray-100 text-gray-600'}`}>
                                                                <span>{DAY_SHORT[s.day_of_week]}</span>
                                                                <span className="opacity-70">{fmt12(s.start_time)}–{fmt12(s.end_time)}</span>
                                                                {(s.facility?.name || s.location) && <span className="opacity-60">· {s.facility?.name ?? s.location}</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-6 py-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                                            <button
                                                onClick={() => openEdit(group)}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
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
