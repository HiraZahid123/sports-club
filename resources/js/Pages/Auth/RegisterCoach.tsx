import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import mlSportsLogo from '../../ml-sports.png';

interface Props {
    token: string;
    club: { id: number; name: string };
    email: string;
}

export default function RegisterCoach({ token, club, email }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.coach', token), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

    return (
        <div className="min-h-screen flex">
            <Head title="Activate Coach Account" />

            {/* Brand panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" />

                <Link href="/">
                    <img src={mlSportsLogo} alt="ML Sports" className="h-11 w-auto object-contain brightness-0 invert" />
                </Link>

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold">You've been invited</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-5">
                        Welcome to<br />{club.name}
                    </h2>
                    <p className="text-amber-100 text-base leading-relaxed mb-8">
                        Complete your account setup to access your coach dashboard. You'll be automatically connected to <strong>{club.name}</strong>.
                    </p>

                    <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                        <p className="text-white font-bold text-sm mb-1">Your club</p>
                        <p className="text-2xl font-black text-white">{club.name}</p>
                        <p className="text-amber-200 text-xs mt-2">Your account will be linked to this club automatically.</p>
                    </div>

                    <ul className="space-y-3 mt-6">
                        {[
                            'Manage your assigned training groups',
                            'Track athlete progress and goals',
                            'View your schedule and payouts',
                        ].map((f) => (
                            <li key={f} className="flex items-start gap-3 text-amber-100 text-sm">
                                <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-amber-300 text-xs">&copy; 2026 ML SPORT Technologies OÜ.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
                <div className="lg:hidden flex items-center mb-8">
                    <Link href="/"><img src={mlSportsLogo} alt="ML Sports" className="h-10 w-auto object-contain" /></Link>
                </div>

                <div className="w-full max-w-md">
                    {/* Club badge */}
                    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-amber-600 font-bold uppercase tracking-wide">Coach Invitation</p>
                            <p className="text-base font-black text-gray-900">{club.name}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-gray-900 mb-1">Activate Your Coach Account</h1>
                        <p className="text-sm text-gray-500">
                            You've been invited by the manager of <strong>{club.name}</strong>. Set your name and password to complete registration.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                placeholder="Coach John Smith"
                                autoFocus
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
                                className={`${inputClass} ${email ? 'bg-gray-100 text-gray-500' : ''}`}
                                placeholder="you@example.com"
                                required
                            />
                            {email && <p className="text-xs text-gray-400 mt-1">You can change the email address if needed.</p>}
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
                                <label className={labelClass}>Confirm <span className="text-red-500">*</span></label>
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-amber-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Activating account...' : 'Activate Coach Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
