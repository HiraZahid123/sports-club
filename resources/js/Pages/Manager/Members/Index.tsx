import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
import { BELT_OPTIONS, getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

interface AthleteProfile {
    belt_rank?: string | null;
    date_of_birth?: string | null;
}

interface Member {
    id: number;
    name: string;
    email: string;
    id_code?: string | null;
    phone?: string | null;
    city?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    roles: { name: string }[];
    athlete_profile?: AthleteProfile | null;
    parent_profile?: any;
}

const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Coach:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Athlete: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    Parent:  { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
    Manager: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
};

function beltBadge(belt: string | null | undefined) {
    if (!belt) return null;
    const cls = getBeltBadgeStyle(belt);
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`}>
            <span className="inline-block h-2 w-4 rounded-sm border shrink-0" style={getBeltStyle(belt)} />
            {belt}
        </span>
    );
}

export default function MembersIndex({ members }: { members: Member[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [showInviteCoach, setShowInviteCoach] = useState(false);

    const inviteForm = useForm({ email: '', payment_option: 'manual', payment_rate: '0' });

    const submitInvite: FormEventHandler = (e) => {
        e.preventDefault();
        inviteForm.post(route('manager.invitations.coach'), {
            onSuccess: () => {
                setShowInviteCoach(false);
                inviteForm.reset();
            },
        });
    };

    const beltDropdownRef = useRef<HTMLDivElement>(null);
    const [showBeltDropdown, setShowBeltDropdown] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (beltDropdownRef.current && !beltDropdownRef.current.contains(event.target as Node)) {
                setShowBeltDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'Athlete',
        password: 'password123',
        id_code: '',
        phone: '',
        city: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        date_of_birth: '',
        belt_rank: '',
    });

    const openAddForm = () => {
        setEditingMember(null);
        reset();
        clearErrors();
        setIsFormOpen(true);
    };

    const openEditForm = (member: Member) => {
        setEditingMember(member);
        setData({
            name: member.name,
            email: member.email,
            role: member.roles[0]?.name || 'Athlete',
            password: '',
            id_code: member.id_code ?? '',
            phone: member.phone ?? '',
            city: member.city ?? '',
            emergency_contact_name: member.emergency_contact_name ?? '',
            emergency_contact_phone: member.emergency_contact_phone ?? '',
            date_of_birth: member.athlete_profile?.date_of_birth ?? '',
            belt_rank: member.athlete_profile?.belt_rank ?? '',
        });
        clearErrors();
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingMember(null);
        setShowBeltDropdown(false);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingMember) {
            put(route('manager.members.update', editingMember.id), { onSuccess: () => closeForm() });
        } else {
            post(route('manager.members.store'), { onSuccess: () => closeForm() });
        }
    };

    const getRoleStyle = (roleName: string) =>
        roleConfig[roleName] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';

    const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Member Management</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{members.length} total members in your club</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowInviteCoach(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Invite Coach
                        </button>
                        <button
                            onClick={isFormOpen ? closeForm : openAddForm}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                isFormOpen
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                            }`}
                        >
                            {isFormOpen ? (
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
                                    Add Member
                                </>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Members" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Add / Edit Form */}
                    {isFormOpen && (
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900">
                                    {editingMember ? 'Edit Member' : 'Create New Member'}
                                </h3>
                                <p className="text-xs text-indigo-600 mt-0.5">
                                    {editingMember
                                        ? 'Update member details below'
                                        : 'Fill in the details to add a new member to your club'}
                                </p>
                            </div>

                            <form onSubmit={submit} className="p-6 space-y-6">
                                {/* Basic info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Basic Information</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className={labelClass}>Full Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. John Smith"
                                                className={inputClass}
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Email Address</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@example.com"
                                                className={inputClass}
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Club Role</label>
                                            <select
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="Athlete">Athlete</option>
                                                <option value="Coach">Coach</option>
                                                <option value="Parent">Parent</option>
                                            </select>
                                        </div>
                                        {!editingMember && (
                                            <div>
                                                <label className={labelClass}>Password</label>
                                                <input
                                                    type="text"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Min. 8 characters"
                                                    className={inputClass}
                                                />
                                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Details</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className={labelClass}>Phone Number</label>
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 555 000 0000"
                                                className={inputClass}
                                            />
                                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>City</label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="e.g. London"
                                                className={inputClass}
                                            />
                                            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>ID Code</label>
                                            <input
                                                type="text"
                                                value={data.id_code}
                                                onChange={(e) => setData('id_code', e.target.value)}
                                                placeholder="National / membership ID"
                                                className={inputClass}
                                            />
                                            {errors.id_code && <p className="mt-1 text-xs text-red-600">{errors.id_code}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency contact */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Emergency Contact</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Contact Name</label>
                                            <input
                                                type="text"
                                                value={data.emergency_contact_name}
                                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                placeholder="e.g. Jane Smith"
                                                className={inputClass}
                                            />
                                            {errors.emergency_contact_name && (
                                                <p className="mt-1 text-xs text-red-600">{errors.emergency_contact_name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Contact Phone</label>
                                            <input
                                                type="text"
                                                value={data.emergency_contact_phone}
                                                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                                placeholder="+1 555 000 0001"
                                                className={inputClass}
                                            />
                                            {errors.emergency_contact_phone && (
                                                <p className="mt-1 text-xs text-red-600">{errors.emergency_contact_phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Athlete-only fields */}
                                {data.role === 'Athlete' && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Athlete Details</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={data.date_of_birth}
                                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                                    className={inputClass}
                                                />
                                                {errors.date_of_birth && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.date_of_birth}</p>
                                                )}
                                            </div>
                                            <div className="relative" ref={beltDropdownRef}>
                                                <label className={labelClass}>Belt</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowBeltDropdown(!showBeltDropdown)}
                                                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-left shadow-sm"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {data.belt_rank ? (
                                                            <>
                                                                <span className="inline-block h-3.5 w-7 rounded border shadow-sm shrink-0" style={getBeltStyle(data.belt_rank)} />
                                                                <span className="font-semibold text-gray-800">{data.belt_rank}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Select Belt</span>
                                                        )}
                                                    </span>
                                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showBeltDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {showBeltDropdown && (
                                                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg focus:outline-none">
                                                        {BELT_OPTIONS.map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setData('belt_rank', opt.value);
                                                                    setShowBeltDropdown(false);
                                                                }}
                                                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                                                    data.belt_rank === opt.value
                                                                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                                                                        : 'text-gray-700 hover:bg-slate-50'
                                                                }`}
                                                            >
                                                                <span className="inline-block h-3.5 w-7 rounded border shadow-sm shrink-0" style={getBeltStyle(opt.value)} />
                                                                <span>{opt.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {errors.belt_rank && (
                                                    <p className="mt-1 text-xs text-red-600">{errors.belt_rank}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        {processing ? 'Saving…' : editingMember ? 'Update Member' : 'Save Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Members Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Member</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">City</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Belt</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Emergency Contact</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {members.map((member) => {
                                        const roleName = member.roles[0]?.name || 'Member';
                                        const style = getRoleStyle(roleName);
                                        return (
                                            <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100 shrink-0">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {member.id_code
                                                                    ? <span className="font-mono">{member.id_code}</span>
                                                                    : <span className="italic">No ID</span>}
                                                                {' · '}
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                        {roleName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {member.phone || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {member.city || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {roleName === 'Athlete'
                                                        ? (beltBadge(member.athlete_profile?.belt_rank) ?? <span className="text-gray-300 text-sm">—</span>)
                                                        : <span className="text-gray-300 text-sm">—</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {member.emergency_contact_name ? (
                                                        <div>
                                                            <p className="text-sm text-gray-700 font-medium">{member.emergency_contact_name}</p>
                                                            <p className="text-xs text-gray-400">{member.emergency_contact_phone || '—'}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditForm(member)}
                                                            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <Link
                                                            href={route('manager.members.destroy', member.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            Remove
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {members.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">👥</div>
                                    <p className="font-semibold text-gray-900 mb-1">No members yet</p>
                                    <p className="text-sm text-gray-500">Add your first member to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Invite Coach Modal */}
            {showInviteCoach && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-amber-900">Invite a Coach</h3>
                                <p className="text-xs text-amber-600 mt-0.5">They'll receive an email with an activation link</p>
                            </div>
                            <button
                                onClick={() => { setShowInviteCoach(false); inviteForm.reset(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={submitInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Coach Email Address</label>
                                <input
                                    type="email"
                                    value={inviteForm.data.email}
                                    onChange={(e) => inviteForm.setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    placeholder="coach@example.com"
                                    required
                                />
                                {inviteForm.errors.email && <p className="mt-2 text-xs text-red-600">{inviteForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary / Revenue Option</label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'athlete', icon: '👤', label: 'Option 1 — Per Athlete × EUR', desc: 'Paid per athlete in their training groups.' },
                                        { value: 'hourly',  icon: '⏱️', label: 'Option 2 — EUR Per Hour (Schedule)', desc: 'Paid based on scheduled training hours.' },
                                        { value: 'manual',  icon: '💰', label: 'Option 3 — Fixed / Manual Amount', desc: 'Manager sets the amount manually each payout.' },
                                    ].map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                inviteForm.data.payment_option === opt.value
                                                    ? 'border-amber-500 bg-amber-50/60'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="invite_payment_option"
                                                value={opt.value}
                                                checked={inviteForm.data.payment_option === opt.value}
                                                onChange={() => inviteForm.setData('payment_option', opt.value)}
                                                className="mt-0.5 text-amber-500 focus:ring-amber-400"
                                            />
                                            <span className="text-base leading-none mt-0.5">{opt.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{opt.label}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {inviteForm.data.payment_option !== 'manual' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        {inviteForm.data.payment_option === 'athlete' ? 'Price per Athlete (€)' : 'Price per Hour (€)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={inviteForm.data.payment_rate}
                                        onChange={(e) => inviteForm.setData('payment_rate', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                    {inviteForm.errors.payment_rate && <p className="mt-1 text-xs text-red-600">{inviteForm.errors.payment_rate}</p>}
                                </div>
                            )}

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                                The coach will receive an email with a secure activation link valid for 7 days. They cannot self-register — this is the only way to create a coach account.
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => { setShowInviteCoach(false); inviteForm.reset(); }}
                                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteForm.processing}
                                    className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-200 disabled:opacity-60"
                                >
                                    {inviteForm.processing ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
