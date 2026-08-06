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
    image_url: string | null;
    is_free: boolean;
    groups: Group[];
    registrations: Registration[];
    coach_salary_type?: string | null;
    coach_salary_rate?: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d: string | null) => {
    if (!d) return '';
    try {
        const dateOnly = d.split('T')[0];
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
            return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        }
        const date = new Date(d);
        if (isNaN(date.getTime())) return d;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return d;
    }
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending_approval: { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
    registered:       { label: 'Registered', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
    attended:         { label: 'Attended',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected:         { label: 'Rejected',   bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function CoachEvents({ events }: { events: Event[] }) {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [processing, setProcessing] = useState<string | null>(null);

    const activeEvent = events.find(e => e.id === selectedEventId);

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

    const renderEventCard = (ev: Event) => {
        const pendingCount = ev.registrations.filter(r => r.status === 'pending_approval' || r.status === 'registered').length;
        const attendedCount= ev.registrations.filter(r => r.status === 'attended').length;

        return (
            <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
                {/* Poster Display */}
                {ev.image_url ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-gray-50">
                        <img src={ev.image_url} alt={ev.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        {pendingCount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg animate-pulse">
                                🔔 {pendingCount} Pending
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 border-b border-gray-50 flex flex-col justify-between p-4 text-white">
                        <div className="flex justify-between items-start">
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                Event
                            </span>
                            {pendingCount > 0 && (
                                <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg animate-pulse">
                                    🔔 {pendingCount} Pending
                                </span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-sm leading-snug drop-shadow-sm line-clamp-2">{ev.name}</h4>
                            <p className="text-[10px] text-white/80 font-medium">🏆 Earn {ev.points} Points</p>
                        </div>
                    </div>
                )}

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

                    {/* Coach Salary/Payout Settings */}
                    {ev.coach_salary_type && ev.coach_salary_type !== 'free' && (
                        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-xs font-bold text-indigo-700">
                                Pay: {ev.coach_salary_type === 'per_athlete' ? `€${parseFloat(ev.coach_salary_rate!).toFixed(2)}/ath` :
                                      ev.coach_salary_type === 'fixed' ? `€${parseFloat(ev.coach_salary_rate!).toFixed(2)}` :
                                      ev.coach_salary_type === 'per_hour' ? `€${parseFloat(ev.coach_salary_rate!).toFixed(2)}/hr` : '—'}
                            </span>
                        </div>
                    )}

                    {/* Groups assigned */}
                    {ev.groups.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Target Groups</p>
                            <div className="flex flex-wrap gap-1">
                                {ev.groups.map(g => (
                                    <span key={g.id} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-md">{g.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PDF link */}
                    {ev.pdf_url && (
                        <a href={ev.pdf_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold mt-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Download Event PDF
                        </a>
                    )}
                </div>

                {/* Footer: registration action */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2 text-xs font-semibold text-gray-500">
                        <span>{ev.registrations.length} registered</span>
                        <span>•</span>
                        <span className="text-emerald-600">{attendedCount} attended</span>
                    </div>
                    <button
                        onClick={() => setSelectedEventId(ev.id)}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1"
                    >
                        Manage Attendance →
                    </button>
                </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {upcoming.map(renderEventCard)}
                                    </div>
                                </div>
                            )}
                            {past.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Past Events</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
                                        {past.map(renderEventCard)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            {/* Attendance Modal */}
            {activeEvent && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{activeEvent.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {fmtDate(activeEvent.start_date)} {activeEvent.location && `· ${activeEvent.location}`}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEventId(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                                    Registrations ({activeEvent.registrations.length})
                                </h4>

                                {activeEvent.registrations.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-500 font-semibold">No registrations yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Athletes will appear here after registering for this event.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {activeEvent.registrations.map((reg) => {
                                            const cfg = STATUS_CONFIG[reg.status];
                                            const accKey = `${activeEvent.id}-${reg.id}`;
                                            const rejKey = `r-${activeEvent.id}-${reg.id}`;
                                            const canAct = reg.status === 'pending_approval' || reg.status === 'registered';

                                            return (
                                                <div
                                                    key={reg.id}
                                                    className={`flex items-center justify-between rounded-xl px-4 py-3 border.5 transition-all ${
                                                        reg.status === 'attended'
                                                            ? 'bg-emerald-50/50 border-emerald-100'
                                                            : reg.status === 'rejected'
                                                            ? 'bg-red-50/30 border-red-100'
                                                            : 'bg-white border-gray-100 shadow-sm'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                                            {reg.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{reg.user.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{reg.user.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                                                            {cfg.label}
                                                        </span>

                                                        {canAct && (
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleAccept(activeEvent.id, reg.id)}
                                                                    disabled={processing === accKey}
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    {processing === accKey ? '…' : 'Accept'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(activeEvent.id, reg.id)}
                                                                    disabled={processing === rejKey}
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                    {processing === rejKey ? '…' : 'Reject'}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {reg.status === 'attended' && (
                                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                                                +{activeEvent.points} pts
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedEventId(null)}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
