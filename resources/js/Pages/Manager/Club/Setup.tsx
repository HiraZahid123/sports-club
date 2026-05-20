import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ClubSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('manager.club.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Club Setup</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Let's get your club set up in just a few steps</p>
                </div>
            }
        >
            <Head title="Club Setup" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white mb-6 shadow-lg shadow-indigo-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <div className="text-3xl mb-3">🏟️</div>
                            <h3 className="text-xl font-black mb-2">Welcome to SportClub!</h3>
                            <p className="text-indigo-200 text-sm leading-relaxed">
                                You're almost ready. Fill in your club's basic details and you'll be up and running in minutes.
                            </p>
                        </div>
                    </div>

                    {/* Setup Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h3 className="text-base font-bold text-gray-900">Club Information</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Provide the basic details of your sports club</p>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Club Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Elite Taekwondo Academy"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Official Email</label>
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

                            <div className="flex items-center justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-sm shadow-indigo-200"
                                >
                                    {processing ? 'Creating...' : 'Create Club & Continue'}
                                    {!processing && (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
