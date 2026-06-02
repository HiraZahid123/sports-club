import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Member {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
    athlete_profile?: any;
    parent_profile?: any;
}

const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Coach: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Athlete: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    Parent: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
    Manager: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
};

export default function MembersIndex({ members }: { members: Member[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'Athlete',
        password: 'password123',
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
            password: '', // Not updating password here
        });
        clearErrors();
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingMember(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingMember) {
            put(route('manager.members.update', editingMember.id), {
                onSuccess: () => closeForm(),
            });
        } else {
            post(route('manager.members.store'), {
                onSuccess: () => closeForm(),
            });
        }
    };

    const getRoleStyle = (roleName: string) => roleConfig[roleName] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Member Management</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{members.length} total members in your club</p>
                    </div>
                    <button
                        onClick={isFormOpen ? closeForm : openAddForm}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isFormOpen
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
            }
        >
            <Head title="Members" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Add/Edit Member Form */}
                    {isFormOpen && (
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900">{editingMember ? 'Edit Member' : 'Create New Member'}</h3>
                                <p className="text-xs text-indigo-600 mt-0.5">{editingMember ? 'Update member details below' : 'Fill in the details to add a new member to your club'}</p>
                            </div>
                            <form onSubmit={submit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. John Smith"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Club Role</label>
                                        <select
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        >
                                            <option value="Athlete">Athlete</option>
                                            <option value="Coach">Coach</option>
                                            <option value="Parent">Parent</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        {processing ? 'Saving...' : (editingMember ? 'Update Member' : 'Save Member')}
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
                                        <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
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
                                                            <p className="text-xs text-gray-400">ID #{member.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style.bg} ${style.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                                                        {roleName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
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
