import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import mlSportsLogo from '../../ml-sports.png';

interface Props {
    club: { id: number; name: string; join_code: string } | null;
    prefill_code: string;
}

export default function RegisterJoin({ club: initialClub, prefill_code }: Props) {
    const [resolvedClub, setResolvedClub] = useState(initialClub);
    const [codeError, setCodeError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        join_code: prefill_code || '',
        role: 'Athlete' as 'Athlete' | 'Parent',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        child_email: '',
    });

    const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

    const validateCode = async () => {
        setCodeError('');
        setResolvedClub(null);
        if (!data.join_code.trim()) return;

        try {
            const res = await fetch(`/api/clubs/validate-code?code=${encodeURIComponent(data.join_code.trim().toUpperCase())}`);
            if (res.ok) {
                const json = await res.json();
                setResolvedClub(json.club);
            } else {
                setCodeError('No active club found with that code. Double-check and try again.');
            }
        } catch {
            setCodeError('Could not verify the code. Please try again.');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.join'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Join a Club" />

            {/* Brand panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full" />

                <Link href="/">
                    <img src={mlSportsLogo} alt="ML Sports" className="h-11 w-auto object-contain brightness-0 invert" />
                </Link>

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold">Join your club today</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-5">
                        Athletes &<br />Parents Welcome
                    </h2>
                    <p className="text-emerald-100 text-base leading-relaxed mb-8">
                        Enter your club joining code to create your account and get instant access to your training portal.
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Join with your club\'s unique code',
                            'Athlete portal: track progress & goals',
                            'Parent portal: manage multiple children',
                            'View schedules and billing in one place',
                        ].map((f) => (
                            <li key={f} className="flex items-start gap-3 text-emerald-100 text-sm">
                                <svg className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-emerald-400 text-xs">&copy; 2026 ML SPORT Technologies OÜ.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto">
                <div className="lg:hidden flex items-center mb-8">
                    <Link href="/"><img src={mlSportsLogo} alt="ML Sports" className="h-10 w-auto object-contain" /></Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-2">
                        <Link href={route('register')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to options
                        </Link>
                    </div>

                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 mb-3">Athletes & Parents</span>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">Join a Club</h1>
                        <p className="text-sm text-gray-500">Enter your club code and create your account.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Club Code */}
                        <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 1 — Enter Your Club Code</p>

                            <div>
                                <label className={labelClass}>Club Joining Code <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.join_code}
                                        onChange={(e) => {
                                            setData('join_code', e.target.value.toUpperCase());
                                            setResolvedClub(null);
                                            setCodeError('');
                                        }}
                                        className={`${inputClass} uppercase tracking-widest font-mono`}
                                        placeholder="e.g. ABC12345"
                                        maxLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={validateCode}
                                        className="shrink-0 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                                    >
                                        Verify
                                    </button>
                                </div>
                                {codeError && <p className="mt-2 text-xs text-red-600">{codeError}</p>}
                                <InputError message={errors.join_code} className="mt-2" />
                            </div>

                            {resolvedClub && (
                                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm font-semibold text-emerald-800">Club found: <span className="font-black">{resolvedClub.name}</span></p>
                                </div>
                            )}
                        </div>

                        {/* Role selection */}
                        <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 2 — Your Role</p>
                            <div className="grid grid-cols-2 gap-3">
                                {(['Athlete', 'Parent'] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setData('role', r)}
                                        className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                                            data.role === r
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        {r === 'Athlete' ? '🏃 Athlete' : '👨‍👧 Parent'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Account details */}
                        <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Step 3 — Your Account</p>

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

                            {/* Parent: link child */}
                            {data.role === 'Parent' && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                                    <label className="block text-sm font-semibold text-yellow-800 mb-2">
                                        Link Existing Athlete (optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={data.child_email}
                                        onChange={(e) => setData('child_email', e.target.value)}
                                        className={inputClass}
                                        placeholder="child@example.com"
                                    />
                                    <p className="text-xs text-yellow-700 mt-2">
                                        Enter your child's registered email to link them to your parent account. You can also add children later from your dashboard.
                                    </p>
                                    <InputError message={errors.child_email} className="mt-2" />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating account...' : `Create ${data.role} Account`}
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
