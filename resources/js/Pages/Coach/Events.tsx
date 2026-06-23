import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Group { id: number; name: string }

interface RegistrationUser { id: number; name: string; email: string }

interface Registration {
    id: number;
    user_id: number;
    status: 'pending_approval' | 'registered' | 'attended' | 'rejected';
    registered_at: string | null;
    attended_at: string | null;
    user: RegistrationUser;
}

interface Event {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    start_date: string;
    end_date: string | null;
    price: string | null;
    points: number;
    pdf_url: string | null;
    is_free: boolean;
    groups: Group[];
    registrations: Registration[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending_approval: { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
    registered:       { label: 'Registered', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
    attended:         { label: 'Attended',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected:         { label: 'Rejected',   bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function CoachEvents({ events }: { events: Event[] }) {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleAccept = (eventId: number, regId: number) => {
        const key = `${eventId}-${regId}`;
        setProcessing(key);
        router.post(
            route('coach.events.attendance.accept', { event: eventId, registration: regId }),
            {},
            { preserveScroll: true, onFinish: () => setProcessing(null) }
        );
    };

    const handleReject = (eventId: number, regId: number) => {
        const key = `r-${eventId}-${regId}`;
        if (!confirm('Reject this athlete\'s attendance?')) return;
        setProcessing(key);
        router.post(
            route('coach.events.attendance.reject', { event: eventId, registration: regId }),
            {},
            { preserveScroll: true, onFinish: () => setProcessing(null) }
        );
    };

    const upcoming = events.filter(e => new Date(e.start_date) >= new Date(new Date().toDateString()));
    const past     = events.filter(e => new Date(e.start_date) < new Date(new Date().toDateString()));

    const renderEvent = (ev: Event) => {
        const isOpen       = expanded === ev.id;
        const pendingCount = ev.registrations.filter(r => r.status === 'pending_approval' || r.status === 'registered').length;
        const attendedCount= ev.registrations.filter(r => r.status === 'attended').length;

        return (
            <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <button
                    onClick={() => setExpanded(isOpen ? null : ev.id)}
                    className="w-full text-left px-6 py-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-base font-bold text-gray-900">{ev.name}</h3>
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${ev.is_free ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                    {ev.is_free ? 'Free' : `€${parseFloat(ev.price!).toFixed(2)}`}
                                </span>
                                {pendingCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                        {pendingCount} pending
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {fmtDate(ev.start_date)}{ev.end_date && ev.end_date !== ev.start_date ? ` – ${fmtDate(ev.end_date)}` : ''}
                                {ev.location && <span className="text-gray-400"> · {ev.location}</span>}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="flex gap-2 text-xs font-semibold">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{ev.registrations.length} reg</span>
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">{attendedCount} attended</span>
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">{ev.points} pts</span>
                            </div>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </button>

                {/* Expanded: registrations */}
                {isOpen && (
                    <div className="border-t border-gray-100 px-6 py-5 space-y-3">
                        {ev.pdf_url && (
                            <a href={ev.pdf_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold mb-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                Event PDF
                            </a>
                        )}

                        {ev.description && <p className="text-xs text-gray-500 leading-relaxed mb-2">{ev.description}</p>}

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Registrations ({ev.registrations.length})</p>

                        {ev.registrations.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-sm text-gray-500 font-medium">No registrations yet</p>
                                <p className="text-xs text-gray-400 mt-1">Athletes will appear here after joining the event.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {ev.registrations.map((reg) => {
                                    const cfg     = STATUS_CONFIG[reg.status];
                                    const accKey  = `${ev.id}-${reg.id}`;
                                    const rejKey  = `r-${ev.id}-${reg.id}`;
                                    const canAct  = reg.status === 'pending_approval' || reg.status === 'registered';

                                    return (
                                        <div key={reg.id} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${cfg.bg} ${cfg.border}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {reg.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{reg.user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{reg.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>

                                                {canAct && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAccept(ev.id, reg.id)}
                                                            disabled={processing === accKey}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            {processing === accKey ? '…' : 'Accept'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(ev.id, reg.id)}
                                                            disabled={processing === rejKey}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            {processing === rejKey ? '…' : 'Reject'}
                                                        </button>
                                                    </>
                                                )}

                                                {reg.status === 'attended' && (
                                                    <span className="text-xs font-bold text-indigo-600">+{ev.points} pts</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Events</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''} assigned to you</p>
                </div>
            }
        >
            <Head title="Events" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {events.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏅</div>
                            <p className="font-semibold text-gray-900 mb-1">No events assigned</p>
                            <p className="text-sm text-gray-500">Your manager will assign you to events when they're created.</p>
                        </div>
                    ) : (
                        <>
                            {upcoming.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Upcoming Events</h3>
                                    <div className="space-y-4">{upcoming.map(renderEvent)}</div>
                                </div>
                            )}
                            {past.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Past Events</h3>
                                    <div className="space-y-4 opacity-75">{past.map(renderEvent)}</div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
