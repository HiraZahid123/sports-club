import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import axios from 'axios';

interface SentMessage {
    id: number;
    title: string;
    body: string;
    recipient_type: 'club' | 'group' | 'user';
    group: { name: string } | null;
    recipient_user: { name: string } | null;
    read_count: number;
    created_at: string;
}

interface InboxMessage {
    id: number;
    title: string;
    body: string;
    sender: { name: string };
    is_read: boolean;
    created_at: string;
}

interface Group { id: number; name: string; }
interface Athlete { id: number; name: string; }

interface SenderProps { isSender: true;  messages: SentMessage[]; groups: Group[]; athletes: Athlete[]; }
interface ReceiverProps { isSender: false; messages: InboxMessage[]; }
type Props = SenderProps | ReceiverProps;

const RECIPIENT_LABELS: Record<string, string> = {
    club:  'All Athletes',
    group: 'Group',
    user:  'Athlete',
};

export default function MessagesIndex(props: Props) {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [showCompose, setShowCompose] = useState(false);

    const form = useForm({
        title: '',
        body: '',
        recipient_type: 'club' as 'club' | 'group' | 'user',
        training_group_id: '',
        recipient_user_id: '',
    });

    const submitMessage: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('messages.store'), {
            onSuccess: () => { setShowCompose(false); form.reset(); },
        });
    };

    const deleteMessage = (id: number) => {
        if (!confirm('Delete this message?')) return;
        router.delete(route('messages.destroy', id));
    };

    const expandMessage = (msg: InboxMessage) => {
        setExpanded(prev => {
            const next = prev === msg.id ? null : msg.id;
            if (next !== null && !msg.is_read) {
                axios.post(route('messages.read', msg.id));
                // Optimistically mark read in local state
                (props as ReceiverProps).messages.forEach(m => {
                    if (m.id === msg.id) m.is_read = true;
                });
            }
            return next;
        });
    };

    const unreadCount = props.isSender
        ? 0
        : (props as ReceiverProps).messages.filter(m => !m.is_read).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {props.isSender
                                ? 'Send notifications to athletes and groups'
                                : `Inbox${unreadCount > 0 ? ` · ${unreadCount} unread` : ''}`}
                        </p>
                    </div>
                    {props.isSender && (
                        <button
                            onClick={() => setShowCompose(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Message
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Messages" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">

                    {/* ── SENDER VIEW ── */}
                    {props.isSender && (
                        <>
                            {props.messages.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                        <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg">No messages sent yet</p>
                                    <p className="text-sm text-gray-500 mt-1 mb-5">Send your first message to athletes or groups.</p>
                                    <button
                                        onClick={() => setShowCompose(true)}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all"
                                    >
                                        Compose Message
                                    </button>
                                </div>
                            ) : (
                                props.messages.map(msg => (
                                    <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                                            msg.recipient_type === 'club'
                                                                ? 'bg-indigo-50 text-indigo-700'
                                                                : msg.recipient_type === 'group'
                                                                ? 'bg-violet-50 text-violet-700'
                                                                : 'bg-sky-50 text-sky-700'
                                                        }`}>
                                                            {msg.recipient_type === 'club' && 'All Athletes'}
                                                            {msg.recipient_type === 'group' && `Group: ${msg.group?.name}`}
                                                            {msg.recipient_type === 'user' && msg.recipient_user?.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{msg.created_at}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-900">{msg.title}</p>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{msg.body}</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Read by</p>
                                                        <p className="text-lg font-black text-emerald-600">{msg.read_count}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteMessage(msg.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {/* ── INBOX VIEW ── */}
                    {!props.isSender && (
                        <>
                            {props.messages.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900">No messages yet</p>
                                    <p className="text-sm text-gray-500 mt-1">Your coach or manager will send messages here.</p>
                                </div>
                            ) : (
                                (props as ReceiverProps).messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                                            !msg.is_read ? 'border-indigo-200' : 'border-gray-100'
                                        }`}
                                    >
                                        <button
                                            className="w-full text-left p-5"
                                            onClick={() => expandMessage(msg)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Unread dot */}
                                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${msg.is_read ? 'bg-transparent' : 'bg-indigo-500'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <p className={`font-bold text-gray-900 truncate ${!msg.is_read ? 'text-indigo-900' : ''}`}>
                                                            {msg.title}
                                                        </p>
                                                        <span className="text-xs text-gray-400 flex-shrink-0">{msg.created_at}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-semibold">From: {msg.sender.name}</p>
                                                    {expanded !== msg.id && (
                                                        <p className="text-sm text-gray-500 mt-1.5 line-clamp-1">{msg.body}</p>
                                                    )}
                                                </div>
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {expanded === msg.id && (
                                            <div className="px-8 pb-5 pt-1 border-t border-gray-50">
                                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Compose Modal ── */}
            {showCompose && props.isSender && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">New Message</h3>
                            <p className="text-indigo-200 text-sm mt-0.5">Send a notification to athletes or groups</p>
                        </div>

                        <form onSubmit={submitMessage} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Send To</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['club', 'group', 'user'] as const).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => { form.setData('recipient_type', type); form.setData('training_group_id', ''); form.setData('recipient_user_id', ''); }}
                                            className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                                                form.data.recipient_type === type
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            {type === 'club' && 'All Athletes'}
                                            {type === 'group' && 'Group'}
                                            {type === 'user' && 'Athlete'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {form.data.recipient_type === 'group' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Select Group</label>
                                    <select
                                        value={form.data.training_group_id}
                                        onChange={e => form.setData('training_group_id', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    >
                                        <option value="">Choose group...</option>
                                        {props.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                    {form.errors.training_group_id && <p className="text-xs text-red-600 mt-1">{form.errors.training_group_id}</p>}
                                </div>
                            )}

                            {form.data.recipient_type === 'user' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Select Athlete</label>
                                    <select
                                        value={form.data.recipient_user_id}
                                        onChange={e => form.setData('recipient_user_id', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    >
                                        <option value="">Choose athlete...</option>
                                        {props.athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    {form.errors.recipient_user_id && <p className="text-xs text-red-600 mt-1">{form.errors.recipient_user_id}</p>}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    value={form.data.title}
                                    onChange={e => form.setData('title', e.target.value)}
                                    placeholder="e.g. Training cancelled this Friday"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                {form.errors.title && <p className="text-xs text-red-600 mt-1">{form.errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Message</label>
                                <textarea
                                    value={form.data.body}
                                    onChange={e => form.setData('body', e.target.value)}
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                                {form.errors.body && <p className="text-xs text-red-600 mt-1">{form.errors.body}</p>}
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => { setShowCompose(false); form.reset(); }}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {form.processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
