import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Club {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
}

export default function ClubEdit({ club, status }: { club: Club, status?: string }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: club.name || '',
        email: club.email || '',
        phone: club.phone || '',
        address: club.address || '',
        description: club.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('manager.club.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Club Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your club's profile and contact information</p>
                </div>
            }
        >
            <Head title="Club Settings" />

            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Profile Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">🏟️</div>
                                <div>
                                    <h3 className="text-base font-bold text-indigo-900">Club Profile</h3>
                                    <p className="text-xs text-indigo-600 mt-0.5">Update your club's public-facing information</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Club Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dragon Taekwondo Academy"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="club@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Address</label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="123 Sports Ave, City, State 12345"
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Club Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tell athletes and parents about your club..."
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm shadow-indigo-200"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>

                                {recentlySuccessful && (
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Saved successfully
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-sm font-bold text-red-800">Danger Zone</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-5">
                                Permanently delete this club and all associated data — members, groups, billing history. <strong>This action cannot be undone.</strong>
                            </p>
                            <button className="px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all">
                                Delete Club
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
