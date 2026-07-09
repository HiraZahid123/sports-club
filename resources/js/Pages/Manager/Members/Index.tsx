import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
import { BELT_OPTIONS, getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

interface AthleteProfile {
    belt_rank?: string | null;
    date_of_birth?: string | null;
}

interface Subscription {
    id: number;
    plan_name: string;
    amount: string;
    billing_cycle: string;
    status: string;
    starts_at: string;
    ends_at: string | null;
    next_payment_at: string | null;
    training_group?: { name: string } | null;
    payments?: {
        id: number;
        amount: string;
        payment_date: string;
        payment_method: string;
        status: string;
    }[];
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
    subscriptions?: Subscription[];
}

const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Coach:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Coach Assistant': { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
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
        roles: [] as string[],
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
        setData('roles', ['Athlete']);
        setIsFormOpen(true);
    };

    const openEditForm = (member: Member) => {
        setEditingMember(member);
        setData({
            name: member.name,
            email: member.email,
            roles: member.roles.map(r => r.name),
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
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Club Roles</label>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                {['Athlete', 'Parent', 'Coach', 'Coach Assistant'].map((roleOpt) => {
                                                    const isChecked = data.roles.includes(roleOpt);
                                                    return (
                                                        <label key={roleOpt} className="inline-flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                value={roleOpt}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setData('roles', [...data.roles, roleOpt]);
                                                                    } else {
                                                                        setData('roles', data.roles.filter(r => r !== roleOpt));
                                                                    }
                                                                }}
                                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                            />
                                                            <span>{roleOpt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles}</p>}
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
                                {data.roles.includes('Athlete') && (
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

                                {editingMember && editingMember.subscriptions && editingMember.subscriptions.length > 0 && (
                                    <div className="border-t border-gray-100 pt-6">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Active Subscriptions & Invoice History</p>
                                        <div className="space-y-4">
                                            {editingMember.subscriptions.map((sub) => (
                                                <div key={sub.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <div className="flex justify-between items-start gap-4 mb-3">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{sub.plan_name}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {sub.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly'} billing · €{Number(sub.amount).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                            sub.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                        }`}>
                                                            {sub.status}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Invoices list */}
                                                    {sub.payments && sub.payments.length > 0 ? (
                                                        <div className="space-y-2 mt-2">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payments / Invoices</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {sub.payments.map((p) => (
                                                                    <div key={p.id} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-100 text-xs">
                                                                        <div>
                                                                            <p className="font-semibold text-gray-800">Invoice #{p.id}</p>
                                                                            <p className="text-[10px] text-gray-400 mt-0.5">{p.payment_date}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-bold text-gray-950">€{Number(p.amount).toFixed(2)}</span>
                                                                            <a
                                                                                href={route('invoices.download', p.id)}
                                                                                className="p-1 rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                                                                                title="Download PDF Invoice"
                                                                            >
                                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic mt-1">No payment logged yet.</p>
                                                    )}
                                                </div>
                                            ))}
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
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {member.roles.map(r => {
                                                            const style = getRoleStyle(r.name);
                                                            return (
                                                                <span key={r.name} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${style.bg} ${style.text}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                                    {r.name}
                                                                </span>
                                                            );
                                                        })}
                                                        {member.roles.length === 0 && (
                                                            <span className="text-gray-300 italic text-xs">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {member.phone || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {member.city || <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {member.roles.some(r => r.name === 'Athlete')
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
        </AuthenticatedLayout>
    );
}
