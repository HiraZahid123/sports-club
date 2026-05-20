import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex">
            {/* Brand Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/3 right-8 w-32 h-32 bg-white/5 rounded-full"></div>

                <Link href="/" className="relative flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-black text-xl text-white border border-white/25 shadow-lg">S</div>
                    <span className="text-xl font-black text-white tracking-tight">Sport<span className="text-indigo-200">Club</span></span>
                </Link>

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span className="text-white/80 text-xs font-semibold">Trusted by 50+ sports clubs</span>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight mb-5">
                        Your Club,<br />Fully Managed.
                    </h2>
                    <p className="text-indigo-200 text-base leading-relaxed mb-10">
                        Athlete tracking, billing automation, and coach coordination — all in one powerful platform built for modern sports clubs.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { val: '500+', label: 'Active Athletes' },
                            { val: '50+', label: 'Clubs Using' },
                            { val: '99.9%', label: 'Uptime' },
                        ].map((s) => (
                            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                                <p className="text-2xl font-black text-white">{s.val}</p>
                                <p className="text-xs text-indigo-300 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-indigo-400 text-xs">&copy; 2026 SportClub Advanced. All rights reserved.</p>
            </div>

            {/* Form Panel */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
                <div className="lg:hidden flex items-center gap-2 mb-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-sm">S</div>
                        <span className="font-black text-gray-900 text-lg">Sport<span className="text-indigo-600">Club</span></span>
                    </Link>
                </div>
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
