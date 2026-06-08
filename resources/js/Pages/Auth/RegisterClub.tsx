import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import mlSportsLogo from '../../ml-sports.png';

export default function RegisterClub() {
    const { data, setData, post, processing, errors, reset } = useForm({
        club_name: '',
        club_email: '',
        club_phone: '',
        club_address: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.club'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

    return (
        <div className="min-h-screen flex">
            <Head title="Register Your Club" />

            {/* Brand panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" />

                <Link href="/">
                    <img src={mlSportsLogo} alt="ML Sports" className="h-11 w-auto object-contain brightness-0 invert" />
                </Link>

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold">Setting up your club</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-5">
                        Launch Your Club<br />in Minutes
                    </h2>
                    <p className="text-indigo-200 text-base leading-relaxed mb-8">
                        Create your club profile, get a unique joining code, and start inviting athletes, parents, and coaches right away.
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Unique club joining code generated automatically',
                            'Invite coaches via email invitation',
                            'Full billing and subscription management',
                            'Training group and schedule management',
                        ].map((f) => (
                            <li key={f} className="flex items-start gap-3 text-indigo-100 text-sm">
                                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-indigo-400 text-xs">&copy; 2026 ML SPORT Technologies OÜ.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto">
                <div className="lg:hidden flex items-center mb-8">
                    <Link href="/"><img src={mlSportsLogo} alt="ML Sports" className="h-10 w-auto object-contain" /></Link>
                </div>

                <div className="w-full max-w-lg">
                    <div className="mb-2">
                        <Link href={route('register')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to options
                        </Link>
                    </div>

                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 mb-3">Club Manager</span>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">Register Your Club</h1>
                        <p className="text-sm text-gray-500">Fill in your club details and create your manager account.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Club Info */}
                        <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Club Information</p>

                            <div>
                                <label className={labelClass}>Club Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.club_name}
                                    onChange={(e) => setData('club_name', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Elite Taekwondo Academy"
                                    required
                                />
                                <InputError message={errors.club_name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Club Email</label>
                                    <input
                                        type="email"
                                        value={data.club_email}
                                        onChange={(e) => setData('club_email', e.target.value)}
                                        className={inputClass}
                                        placeholder="club@example.com"
                                    />
                                    <InputError message={errors.club_email} className="mt-2" />
                                </div>
                                <div>
                                    <label className={labelClass}>Club Phone</label>
                                    <input
                                        type="tel"
                                        value={data.club_phone}
                                        onChange={(e) => setData('club_phone', e.target.value)}
                                        className={inputClass}
                                        placeholder="+1 555 000 0000"
                                    />
                                    <InputError message={errors.club_phone} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Club Address</label>
                                <input
                                    type="text"
                                    value={data.club_address}
                                    onChange={(e) => setData('club_address', e.target.value)}
                                    className={inputClass}
                                    placeholder="123 Main Street, City, Country"
                                />
                                <InputError message={errors.club_address} className="mt-2" />
                            </div>
                        </div>

                        {/* Manager Account */}
                        <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Manager Account</p>

                            <div>
                                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass}
                                    placeholder="John Smith"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating your club...' : 'Create Club & Manager Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href={route('login')} className="font-semibold text-indigo-600 hover:text-indigo-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
