import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import mlSportsLogo from '../ml-sports.png';

export default function Welcome({ auth }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <div className="bg-white text-gray-900 min-h-screen font-sans">
            <Head title="Welcome to Elite Sports Club" />

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <img src={mlSportsLogo} alt="ML Sports" className="h-10 w-auto object-contain" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Sign In</Link>
                                <Link href={route('register')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                {/* Decorative blobs */}
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-60 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            Next-Generation Club Management
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight text-gray-900">
                            Elevate Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Sports Club</span>
                        </h1>

                        <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl">
                            The all-in-one platform for Taekwondo academies and sports clubs. Manage athletes, automate billing, and coordinate coaches — all from one professional dashboard.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href={route('register')} className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-indigo-200">
                                Start For Free
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <a href="#features" className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-base transition-all border border-gray-200 shadow-sm">
                                See How It Works
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="border-y border-gray-100 bg-white py-10">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { val: '500+', label: 'Active Athletes' },
                            { val: '50+', label: 'Sports Clubs' },
                            { val: '$2M+', label: 'Revenue Managed' },
                            { val: '99.9%', label: 'Platform Uptime' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl lg:text-4xl font-black text-indigo-600">{stat.val}</p>
                                <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Features</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Everything Your Club Needs</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">From athlete onboarding to financial reporting, we've built every tool your sports club needs to run at its best.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '🏆',
                            color: 'bg-amber-50 text-amber-600 border-amber-100',
                            title: 'Athlete Grading & Tracking',
                            desc: 'Track belt progression, attendance records, and technical skills with dynamic progress visualizers and performance analytics.',
                        },
                        {
                            icon: '💳',
                            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            title: 'Automated Billing',
                            desc: 'Recurring subscriptions, smart payment tracking, and automatic access locking for overdue accounts. Never chase a payment again.',
                        },
                        {
                            icon: '📅',
                            color: 'bg-blue-50 text-blue-600 border-blue-100',
                            title: 'Smart Scheduling',
                            desc: 'Coordinate multiple training groups and coaches with conflict-aware calendars, event management, and automated notifications.',
                        },
                        {
                            icon: '👥',
                            color: 'bg-purple-50 text-purple-600 border-purple-100',
                            title: 'Role-Based Access',
                            desc: 'Separate portals for managers, coaches, athletes, and parents. Everyone sees exactly what they need, nothing more.',
                        },
                        {
                            icon: '📊',
                            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                            title: 'Financial Analytics',
                            desc: 'Revenue trends, coach compensation tracking, payout history, and monthly reports to keep your club financially healthy.',
                        },
                        {
                            icon: '🔒',
                            color: 'bg-rose-50 text-rose-600 border-rose-100',
                            title: 'Secure & Reliable',
                            desc: 'Enterprise-grade security with role-based permissions, data encryption, and 99.9% uptime SLA for mission-critical operations.',
                        },
                    ].map((feature) => (
                        <div key={feature.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8 group">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl border ${feature.color} mb-5`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div id="how-it-works" className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-white text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 mb-4">Simple Process</span>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Up and Running in Minutes</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">No complex setup. No IT team required. Start managing your club professionally today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Club',
                                desc: 'Register your club, add your information, and configure your subscription plans in under 5 minutes.',
                            },
                            {
                                step: '02',
                                title: 'Add Your Members',
                                desc: 'Invite athletes, coaches, and parents. They get role-specific portals with exactly the access they need.',
                            },
                            {
                                step: '03',
                                title: 'Run at Full Speed',
                                desc: 'Automate billing, track progress, manage schedules, and generate reports — all from your dashboard.',
                            },
                        ].map((step, i) => (
                            <div key={step.step} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-12 -right-4 z-10 text-gray-300">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                                <span className="text-5xl font-black text-indigo-50 block mb-4">{step.step}</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2"></div>
                </div>
                <div className="relative max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                        Ready to Transform Your Club?
                    </h2>
                    <p className="text-indigo-200 text-lg mb-10 leading-relaxed">
                        Join 50+ sports clubs already using SportClub to streamline operations, delight members, and grow their programs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={route('register')} className="px-8 py-4 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold text-base transition-all shadow-lg">
                            Start Free Trial
                        </Link>
                        <Link href={route('login')} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-base transition-all border border-white/20">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-blue-50 to-blue-100 border-t border-blue-100 py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <img 
                            src={mlSportsLogo} 
                            alt="ML SPORT Technologies" 
                            className="h-8 w-auto mb-1" 
                        />
                        <p className="text-gray-600 text-xs">
                            &copy; 2026 ML SPORT Technologies OÜ. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                            <span className="text-gray-300">|</span>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
