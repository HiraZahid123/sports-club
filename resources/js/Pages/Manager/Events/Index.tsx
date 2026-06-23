import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Group { id: number; name: string }
interface Coach { id: number; name: string }

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
    pdf_path: string | null;
    pdf_url: string | null;
    groups: Group[];
    coaches: Coach[];
    registrations_count: number;
    attended_count: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
const fmtDate   = (d: string | null) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const isFree    = (e: Event) => !e.price || parseFloat(e.price) === 0;

// ── Component ──────────────────────────────────────────────────────────────
export default function EventsIndex({ events, groups, coaches }: {
    events: Event[];
    groups: Group[];
    coaches: Coach[];
}) {
    const [isCreating, setIsCreating]     = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deleting, setDeleting]         = useState<number | null>(null);

    const createFileRef = useRef<HTMLInputElement>(null);
    const editFileRef   = useRef<HTMLInputElement>(null);

    // ── Create form ────────────────────────────────────────────────────────
    const createForm = useForm({
        name: '', description: '', location: '',
        start_date: '', end_date: '', price: '',
        stripe_payment_link: '', points: '0',
        group_ids: [] as string[], coach_ids: [] as string[],
        pdf: null as File | null, remove_pdf: '0',
    });

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(createForm.data).forEach(([k, v]) => {
            if (k === 'group_ids' || k === 'coach_ids') {
                (v as string[]).forEach(id => fd.append(`${k}[]`, id));
            } else if (k === 'pdf' && v instanceof File) {
                fd.append('pdf', v);
            } else if (v !== null) {
                fd.append(k, String(v));
            }
        });
        router.post(route('manager.events.store'), fd, {
            forceFormData: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
                if (createFileRef.current) createFileRef.current.value = '';
            },
        });
    };

    // ── Edit form ──────────────────────────────────────────────────────────
    const editForm = useForm({
        name: '', description: '', location: '',
        start_date: '', end_date: '', price: '',
        stripe_payment_link: '', points: '0',
        group_ids: [] as string[], coach_ids: [] as string[],
        pdf: null as File | null, remove_pdf: '0',
    });

    const openEdit = (ev: Event) => {
        editForm.setData({
            name:                ev.name,
            description:         ev.description ?? '',
            location:            ev.location ?? '',
            start_date:          ev.start_date?.split('T')[0] ?? '',
            end_date:            ev.end_date?.split('T')[0] ?? '',
            price:               ev.price ?? '',
            stripe_payment_link: ev.stripe_payment_link ?? '',
            points:              String(ev.points),
            group_ids:           ev.groups.map(g => String(g.id)),
            coach_ids:           ev.coaches.map(c => String(c.id)),
            pdf:                 null,
            remove_pdf:          '0',
        });
        setEditingEvent(ev);
        setIsCreating(false);
        if (editFileRef.current) editFileRef.current.value = '';
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingEvent) return;
        const fd = new FormData();
        Object.entries(editForm.data).forEach(([k, v]) => {
            if (k === 'group_ids' || k === 'coach_ids') {
                (v as string[]).forEach(id => fd.append(`${k}[]`, id));
            } else if (k === 'pdf' && v instanceof File) {
                fd.append('pdf', v);
            } else if (v !== null) {
                fd.append(k, String(v));
            }
        });
        router.post(route('manager.events.update', editingEvent.id), fd, {
            forceFormData: true,
            onSuccess: () => {
                setEditingEvent(null);
                editForm.reset();
                if (editFileRef.current) editFileRef.current.value = '';
            },
        });
    };

    const handleDelete = (ev: Event) => {
        if (!confirm(`Delete event "${ev.name}"? This cannot be undone.`)) return;
        setDeleting(ev.id);
        router.delete(route('manager.events.destroy', ev.id), {
            onFinish: () => setDeleting(null),
        });
    };

    // ── Render helpers ─────────────────────────────────────────────────────
    const GroupToggle = ({ id, form }: { id: number; form: typeof createForm | typeof editForm }) => {
        const active = (form.data.group_ids).includes(String(id));
        const g = groups.find(x => x.id === id)!;
        const toggle = () => {
            const cur = form.data.group_ids;
            form.setData({ ...form.data, group_ids: active ? cur.filter(x => x !== String(id)) : [...cur, String(id)] });
        };
        return (
            <button type="button" onClick={toggle}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
                {g.name}
            </button>
        );
    };

    const CoachToggle = ({ id, form }: { id: number; form: typeof createForm | typeof editForm }) => {
        const active = (form.data.coach_ids).includes(String(id));
        const c = coaches.find(x => x.id === id)!;
        const toggle = () => {
            const cur = form.data.coach_ids;
            form.setData({ ...form.data, coach_ids: active ? cur.filter(x => x !== String(id)) : [...cur, String(id)] });
        };
        return (
            <button type="button" onClick={toggle}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
                {c.name}
            </button>
        );
    };

    // ── Shared form body ───────────────────────────────────────────────────
    const renderForm = (
        form: typeof createForm,
        onSubmit: FormEventHandler,
        fileRef: React.RefObject<HTMLInputElement>,
        editing: Event | null,
    ) => {
        const showStripe = form.data.price !== '' && parseFloat(form.data.price || '0') > 0;
        return (
            <form onSubmit={onSubmit} className="p-6 space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Event Name *</label>
                        <input type="text" value={form.data.name} onChange={e => form.setData({ ...form.data, name: e.target.value })} placeholder="e.g. Regional Championship 2026" className={inputClass} />
                        {form.errors.name && <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Location</label>
                        <input type="text" value={form.data.location} onChange={e => form.setData({ ...form.data, location: e.target.value })} placeholder="e.g. Sports Hall A, Dublin" className={inputClass} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Start Date *</label>
                        <input type="date" value={form.data.start_date} onChange={e => form.setData({ ...form.data, start_date: e.target.value })} className={inputClass} />
                        {form.errors.start_date && <p className="mt-1 text-xs text-red-600">{form.errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">End Date</label>
                        <input type="date" value={form.data.end_date} onChange={e => form.setData({ ...form.data, end_date: e.target.value })} className={inputClass} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Price (€) — blank = free</label>
                        <input type="number" min="0" step="0.01" value={form.data.price} onChange={e => form.setData({ ...form.data, price: e.target.value })} placeholder="0.00" className={inputClass} />
                    </div>
                    {showStripe && (
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Stripe Payment Link *</label>
                            <input type="url" value={form.data.stripe_payment_link} onChange={e => form.setData({ ...form.data, stripe_payment_link: e.target.value })} placeholder="https://buy.stripe.com/…" className={inputClass} />
                            {form.errors.stripe_payment_link && <p className="mt-1 text-xs text-red-600">{form.errors.stripe_payment_link}</p>}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Points Awarded *</label>
                        <input type="number" min="0" value={form.data.points} onChange={e => form.setData({ ...form.data, points: e.target.value })} placeholder="10" className={inputClass} />
                        {form.errors.points && <p className="mt-1 text-xs text-red-600">{form.errors.points}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                    <textarea value={form.data.description} onChange={e => form.setData({ ...form.data, description: e.target.value })} rows={3} placeholder="Event details, rules, schedule…" className={inputClass} />
                </div>

                {/* PDF */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Event PDF (optional)</label>
                    {editing?.pdf_url && form.data.remove_pdf !== '1' && (
                        <div className="flex items-center gap-3 mb-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            <a href={editing.pdf_url} target="_blank" rel="noopener" className="text-xs font-semibold text-amber-700 hover:underline truncate">Current PDF attached</a>
                            <button type="button" onClick={() => form.setData({ ...form.data, remove_pdf: '1' })} className="ml-auto text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        </div>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf"
                        onChange={e => form.setData({ ...form.data, pdf: e.target.files?.[0] ?? null })}
                        className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-xs file:font-semibold hover:file:bg-indigo-100 transition-all"
                    />
                </div>

                {/* Groups */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Visible to Groups * <span className="text-gray-400 font-normal normal-case">(select at least one)</span>
                    </label>
                    {groups.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No groups yet — create groups first.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {groups.map(g => <GroupToggle key={g.id} id={g.id} form={form} />)}
                        </div>
                    )}
                    {form.errors.group_ids && <p className="mt-1 text-xs text-red-600">{(form.errors as Record<string, string>).group_ids}</p>}
                </div>

                {/* Coaches */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Assigned Coaches</label>
                    {coaches.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No coaches in this club yet.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {coaches.map(c => <CoachToggle key={c.id} id={c.id} form={form} />)}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => { setIsCreating(false); setEditingEvent(null); }} className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                    <button type="submit" disabled={form.processing} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
                        {form.processing ? 'Saving…' : editing ? 'Save Changes' : 'Create Event'}
                    </button>
                </div>
            </form>
        );
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Events</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => { setIsCreating(!isCreating); setEditingEvent(null); }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCreating ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'}`}
                    >
                        {isCreating ? (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Event</>
                        )}
                    </button>
                </div>
            }
        >
            <Head title="Events" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ── Create Form ──────────────────────────────────── */}
                    {isCreating && (
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900">Create New Event</h3>
                                <p className="text-xs text-indigo-600 mt-0.5">Set up a club event for your athletes</p>
                            </div>
                            {renderForm(createForm, submitCreate, createFileRef, null)}
                        </div>
                    )}

                    {/* ── Edit Form ────────────────────────────────────── */}
                    {editingEvent && (
                        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-amber-900">Edit Event — {editingEvent.name}</h3>
                                    <p className="text-xs text-amber-600 mt-0.5">Update event details</p>
                                </div>
                                <button onClick={() => setEditingEvent(null)} className="text-amber-400 hover:text-amber-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            {renderForm(editForm, submitEdit, editFileRef, editingEvent)}
                        </div>
                    )}

                    {/* ── Events Grid ──────────────────────────────────── */}
                    {events.length === 0 && !isCreating ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏅</div>
                            <p className="font-semibold text-gray-900 mb-1">No events yet</p>
                            <p className="text-sm text-gray-500 mb-5">Create your first event to engage athletes and award points.</p>
                            <button onClick={() => setIsCreating(true)} className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                                Create First Event
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {events.map((ev) => {
                                const free   = isFree(ev);
                                const isEdit = editingEvent?.id === ev.id;
                                return (
                                    <div key={ev.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${isEdit ? 'border-amber-300 ring-2 ring-amber-200' : 'border-gray-100'}`}>
                                        <div className="p-5 flex-1 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-base font-bold text-gray-900 leading-tight">{ev.name}</h3>
                                                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${free ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                    {free ? 'Free' : `€${parseFloat(ev.price!).toFixed(2)}`}
                                                </span>
                                            </div>

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

                                            {ev.description && <p className="text-xs text-gray-500 line-clamp-2">{ev.description}</p>}

                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
                                                    <p className="text-lg font-black text-indigo-700">{ev.points}</p>
                                                    <p className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wide">Points</p>
                                                </div>
                                                <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                                                    <p className="text-lg font-black text-blue-700">{ev.registrations_count}</p>
                                                    <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide">Registered</p>
                                                </div>
                                                <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                                                    <p className="text-lg font-black text-emerald-700">{ev.attended_count}</p>
                                                    <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wide">Attended</p>
                                                </div>
                                            </div>

                                            {ev.groups.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Groups</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ev.groups.map(g => <span key={g.id} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-md">{g.name}</span>)}
                                                    </div>
                                                </div>
                                            )}

                                            {ev.coaches.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Coaches</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ev.coaches.map(c => <span key={c.id} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-md">{c.name}</span>)}
                                                    </div>
                                                </div>
                                            )}

                                            {ev.pdf_url && (
                                                <a href={ev.pdf_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                    View PDF
                                                </a>
                                            )}
                                        </div>

                                        <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                                            <button onClick={() => openEdit(ev)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(ev)} disabled={deleting === ev.id} className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                {deleting === ev.id ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
