import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Group { id: number; name: string }
interface Coach { id: number; name: string }

interface Registration {
    id: number;
    status: 'pending_approval' | 'registered' | 'attended' | 'rejected';
    registered_at: string | null;
    attended_at: string | null;
}

interface Event {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    start_date: string;
    end_date: string | null;
    price: string | null;
    stripe_payment_link: string | null;
    points: number;
    pdf_url: string | null;
    is_free: boolean;
    groups: Group[];
    coaches: Coach[];
    registration: Registration | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    pending_approval: { label: 'Pending Approval', bg: 'bg-amber-50', text: 'text-amber-700' },
    registered:       { label: 'Registered',        bg: 'bg-blue-50',   text: 'text-blue-700'   },
    attended:         { label: 'Attended',           bg: 'bg-emerald-50',text: 'text-emerald-700'},
    rejected:         { label: 'Rejected',           bg: 'bg-red-50',    text: 'text-red-600'    },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function AthleteEvents({ events, event_points }: {
    events: Event[];
    event_points: number;
}) {
    const [joining, setJoining] = useState<number | null>(null);

    const handleJoin = (ev: Event) => {
        setJoining(ev.id);
        router.post(
            route('athlete.events.join', ev.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setJoining(null),
            }
        );
    };

    const handlePay = (ev: Event) => {
        // First register (pending_approval will be skipped for paid — backend sets registered)
        setJoining(ev.id);
        router.post(
            route('athlete.events.join', ev.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Open Stripe payment link in new tab
                    if (ev.stripe_payment_link) {
                        window.open(ev.stripe_payment_link, '_blank', 'noopener,noreferrer');
                    }
                },
                onFinish: () => setJoining(null),
            }
        );
    };

    const upcoming = events.filter(e => new Date(e.start_date) >= new Date(new Date().toDateString()));
    const past     = events.filter(e => new Date(e.start_date) < new Date(new Date().toDateString()));

    const renderEvent = (ev: Event) => {
        const reg    = ev.registration;
        const status = reg?.status;
        const cfg    = status ? STATUS_CONFIG[status] : null;

        return (
            <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                <div className="p-5 flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-gray-900 leading-tight">{ev.name}</h3>
                        <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${ev.is_free ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {ev.is_free ? 'Free' : `€${parseFloat(ev.price!).toFixed(2)}`}
                        </span>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {fmtDate(ev.start_date)}{ev.end_date && ev.end_date !== ev.start_date ? ` – ${fmtDate(ev.end_date)}` : ''}
                    </p>

                    {ev.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {ev.location}
                        </p>
                    )}

                    {ev.description && <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{ev.description}</p>}

                    {/* Points badge */}
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xs font-bold text-indigo-700">{ev.points} points on attendance</span>
                    </div>

                    {/* Coaches */}
                    {ev.coaches.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Coaches</p>
                            <div className="flex flex-wrap gap-1">
                                {ev.coaches.map(c => (
                                    <span key={c.id} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-md">{c.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PDF */}
                    {ev.pdf_url && (
                        <a href={ev.pdf_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Download Event PDF
                        </a>
                    )}
                </div>

                {/* Footer: registration action */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-gray-100">
                    {reg ? (
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cfg?.bg} ${cfg?.text}`}>
                                {status === 'attended' && (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                                {cfg?.label}
                            </span>
                            {status === 'attended' && (
                                <span className="text-xs font-bold text-indigo-600">+{ev.points} pts earned</span>
                            )}
                            {/* If paid event is registered but stripe link exists, show pay link again */}
                            {status === 'registered' && !ev.is_free && ev.stripe_payment_link && (
                                <a href={ev.stripe_payment_link} target="_blank" rel="noopener" className="text-xs font-semibold text-amber-600 hover:text-amber-800">
                                    Complete Payment
                                </a>
                            )}
                        </div>
                    ) : (
                        ev.is_free ? (
                            <button
                                onClick={() => handleJoin(ev)}
                                disabled={joining === ev.id}
                                className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                            >
                                {joining === ev.id ? 'Registering…' : 'Register'}
                            </button>
                        ) : (
                            <button
                                onClick={() => handlePay(ev)}
                                disabled={joining === ev.id}
                                className="w-full py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                {joining === ev.id ? 'Processing…' : `Pay & Register — €${parseFloat(ev.price!).toFixed(2)}`}
                            </button>
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Club Events</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''} available to your groups</p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        <span className="text-sm font-bold text-indigo-700">{event_points} pts total</span>
                    </div>
                </div>
            }
        >
            <Head title="Events" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {events.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏅</div>
                            <p className="font-semibold text-gray-900 mb-1">No events yet</p>
                            <p className="text-sm text-gray-500">Your coach will add events when they're available.</p>
                        </div>
                    ) : (
                        <>
                            {upcoming.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Upcoming Events</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {upcoming.map(renderEvent)}
                                    </div>
                                </div>
                            )}

                            {past.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Past Events</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
                                        {past.map(renderEvent)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
