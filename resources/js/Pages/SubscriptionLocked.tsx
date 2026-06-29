import { Head, Link, router } from '@inertiajs/react';

interface LockedSubscription {
    id: number;
    plan_name: string;
    amount: string;
    billing_cycle: string;
    status: string;
    next_payment_at: string | null;
    ends_at: string | null;
    user?: { name: string };
    training_group: { name: string } | null;
    plan: { name: string } | null;
}

interface Club {
    name: string;
    email: string | null;
    phone: string | null;
}

interface Props {
    subscriptions: LockedSubscription[];
    club: Club | null;
    userRole: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    overdue:  { label: 'Overdue',  color: 'text-red-700 bg-red-50 border-red-200' },
    unpaid:   { label: 'Unpaid',   color: 'text-amber-700 bg-amber-50 border-amber-200' },
    canceled: { label: 'Canceled', color: 'text-gray-700 bg-gray-100 border-gray-200' },
};

export default function SubscriptionLocked({ subscriptions, club, userRole }: Props) {
    const isParent = userRole === 'Parent';

    return (
        <>
            <Head title="Account On Hold" />

            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">

                {/* Card */}
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Top banner */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-white mb-1">Account On Hold</h1>
                        <p className="text-red-100 text-sm">
                            {isParent
                                ? "One or more of your children's memberships require payment."
                                : 'Your membership payment is overdue or unpaid.'}
                        </p>
                    </div>

                    <div className="px-8 py-7 space-y-6">

                        {/* Notice text */}
                        <p className="text-gray-600 text-sm leading-relaxed text-center">
                            Access to your {isParent ? "children's" : ''} profile and club features has been
                            temporarily suspended until the subscription is renewed.
                            Please contact your club manager to resolve this.
                        </p>

                        {/* Unpaid subscriptions */}
                        {subscriptions.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    {subscriptions.length === 1 ? 'Unpaid Subscription' : 'Unpaid Subscriptions'}
                                </p>
                                {subscriptions.map(sub => {
                                    const badge = STATUS_LABEL[sub.status] ?? { label: sub.status, color: 'text-gray-600 bg-gray-100 border-gray-200' };
                                    return (
                                        <div key={sub.id} className="rounded-2xl border border-gray-100 bg-slate-50 p-4 flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                {sub.user && (
                                                    <p className="text-xs font-semibold text-indigo-600 mb-0.5">{sub.user.name}</p>
                                                )}
                                                <p className="font-semibold text-gray-900 text-sm truncate">{sub.plan_name}</p>
                                                {sub.training_group && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{sub.training_group.name}</p>
                                                )}
                                                {sub.next_payment_at && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Due: <span className="font-semibold text-gray-600">{sub.next_payment_at}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-black text-gray-900">
                                                    €{Number(sub.amount).toFixed(2)}
                                                </p>
                                                <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-lg border ${badge.color}`}>
                                                    {badge.label}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1 capitalize">
                                                    {sub.billing_cycle}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {subscriptions.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
                                No subscription details found. Contact your manager.
                            </div>
                        )}

                        {/* Club contact */}
                        {club && (club.email || club.phone) && (
                            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2">Contact {club.name}</p>
                                <div className="space-y-1.5">
                                    {club.email && (
                                        <a href={`mailto:${club.email}`} className="flex items-center gap-2 text-sm text-indigo-700 font-semibold hover:text-indigo-900 transition-colors">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                            {club.email}
                                        </a>
                                    )}
                                    {club.phone && (
                                        <a href={`tel:${club.phone}`} className="flex items-center gap-2 text-sm text-indigo-700 font-semibold hover:text-indigo-900 transition-colors">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                            {club.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-1">
                            {isParent && (
                                <Link
                                    href={route('parent.billing')}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl text-center transition-all shadow-sm shadow-indigo-200"
                                >
                                    View Billing & Pay
                                </Link>
                            )}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl text-center transition-all"
                            >
                                Sign Out
                            </Link>
                        </div>

                    </div>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    Once your manager marks the payment as received, your access will be restored automatically.
                </p>
            </div>
        </>
    );
}
