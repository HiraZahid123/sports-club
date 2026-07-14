import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Plan {
    id: number;
    name: string;
    monthly_price: string;
    yearly_price: string;
    description: string | null;
    is_active: boolean;
    training_group_id: number | null;
    training_group: { id: number; name: string } | null;
}

interface Subscription {
    id: number;
    plan_name: string;
    amount: string;
    billing_cycle: string;
    status: string;
    starts_at: string;
    ends_at: string | null;
    next_payment_at: string | null;
    user: { id: number; name: string };
    training_group: { name: string } | null;
    plan: Plan | null;
    payments?: {
        id: number;
        amount: string;
        payment_date: string;
        payment_method: string | null;
        status: string;
    }[];
}

interface Group {
    id: number;
    name: string;
}

interface Member {
    id: number;
    name: string;
}

interface Props {
    subscriptions: Subscription[];
    plans: Plan[];
    groups: Group[];
    members: Member[];
    totalRevenue: number;
}

const EMPTY_PLAN = { name: '', training_group_id: '', monthly_price: '', yearly_price: '', description: '' };
const EMPTY_SUB  = { user_id: '', subscription_plan_id: '', billing_cycle: 'monthly', starts_at: new Date().toISOString().split('T')[0] };

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
        const dateOnly = dateStr.split('T')[0];
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        return dateStr;
    }
};

export default function BillingIndex({ subscriptions, plans, groups, members, totalRevenue }: Props) {
    const [tab, setTab]             = useState<'plans' | 'subscriptions'>('plans');
    const [editPlan, setEditPlan]   = useState<Plan | null>(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showSubModal, setShowSubModal]   = useState(false);
    const [selectedSub, setSelectedSub]     = useState<Subscription | null>(null);

    // Plan form
    const planForm = useForm({ ...EMPTY_PLAN });

    // Subscription assignment form
    const subForm = useForm({ ...EMPTY_SUB });

    // Log payment form
    const payForm = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const openCreatePlan = () => {
        planForm.reset();
        planForm.setData(EMPTY_PLAN as any);
        setEditPlan(null);
        setShowPlanModal(true);
    };

    const openEditPlan = (plan: Plan) => {
        planForm.setData({
            name: plan.name,
            training_group_id: plan.training_group_id ? String(plan.training_group_id) : '',
            monthly_price: plan.monthly_price,
            yearly_price: plan.yearly_price,
            description: plan.description ?? '',
        });
        setEditPlan(plan);
        setShowPlanModal(true);
    };

    const submitPlan: FormEventHandler = (e) => {
        e.preventDefault();
        if (editPlan) {
            planForm.put(route('manager.plans.update', editPlan.id), {
                onSuccess: () => { setShowPlanModal(false); planForm.reset(); },
            });
        } else {
            planForm.post(route('manager.plans.store'), {
                onSuccess: () => { setShowPlanModal(false); planForm.reset(); },
            });
        }
    };

    const deletePlan = (plan: Plan) => {
        if (!confirm(`Delete plan "${plan.name}"? Active subscriptions using it won't be affected.`)) return;
        router.delete(route('manager.plans.destroy', plan.id));
    };

    const submitSub: FormEventHandler = (e) => {
        e.preventDefault();
        subForm.post(route('manager.billing.subscriptions.store'), {
            onSuccess: () => { setShowSubModal(false); subForm.reset(); subForm.setData(EMPTY_SUB as any); },
        });
    };

    const deleteSub = (sub: Subscription) => {
        if (!confirm(`Remove subscription for ${sub.user.name}?`)) return;
        router.delete(route('manager.billing.subscriptions.destroy', sub.id));
    };

    const submitPayment: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedSub) return;
        payForm.post(route('manager.billing.pay', selectedSub.id), {
            onSuccess: () => { setSelectedSub(null); payForm.reset(); },
        });
    };

    const activeCount  = subscriptions.filter(s => s.status === 'active').length;
    const overdueCount = subscriptions.filter(s => s.status !== 'active').length;

    const selectedPlan = plans.find(p => String(p.id) === subForm.data.subscription_plan_id);
    const computedPrice = selectedPlan
        ? (subForm.data.billing_cycle === 'yearly' ? selectedPlan.yearly_price : selectedPlan.monthly_price)
        : null;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Billing & Revenue</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage subscription plans and track member payments</p>
                </div>
            }
        >
            <Head title="Billing" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wide mb-1">Total Revenue</p>
                            <p className="text-3xl font-black">€{Number(totalRevenue).toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Active</p>
                            <p className="text-3xl font-black text-emerald-600">{activeCount}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Overdue</p>
                            <p className="text-3xl font-black text-amber-600">{overdueCount}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Plans</p>
                            <p className="text-3xl font-black text-indigo-600">{plans.length}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                        {(['plans', 'subscriptions'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                                    tab === t
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {t === 'plans' ? 'Subscription Plans' : 'Member Subscriptions'}
                            </button>
                        ))}
                    </div>

                    {/* ── Plans Tab ── */}
                    {tab === 'plans' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900">Subscription Plans</h3>
                                <button
                                    onClick={openCreatePlan}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all"
                                >
                                    <span className="text-lg leading-none">+</span> New Plan
                                </button>
                            </div>

                            {plans.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
                                    <p className="font-bold text-gray-900 text-lg">No plans yet</p>
                                    <p className="text-sm text-gray-500 mt-1 mb-5">Create subscription plans for your club or specific groups.</p>
                                    <button
                                        onClick={openCreatePlan}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all"
                                    >
                                        Create First Plan
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {plans.map(plan => (
                                        <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-base">{plan.name}</p>
                                                    <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                                        plan.training_group
                                                            ? 'bg-violet-50 text-violet-700'
                                                            : 'bg-indigo-50 text-indigo-700'
                                                    }`}>
                                                        {plan.training_group ? plan.training_group.name : 'Club-wide'}
                                                    </span>
                                                </div>
                                                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${plan.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`} title={plan.is_active ? 'Active' : 'Inactive'} />
                                            </div>

                                            {plan.description && (
                                                <p className="text-xs text-gray-500 leading-relaxed">{plan.description}</p>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <div className="bg-slate-50 rounded-xl p-3 text-center">
                                                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Monthly</p>
                                                    <p className="text-xl font-black text-gray-900">€{Number(plan.monthly_price).toFixed(0)}</p>
                                                </div>
                                                <div className="bg-indigo-50 rounded-xl p-3 text-center relative overflow-hidden">
                                                    <p className="text-xs text-indigo-500 font-semibold mb-0.5">Yearly</p>
                                                    <p className="text-xl font-black text-indigo-700">€{Number(plan.yearly_price).toFixed(0)}</p>
                                                    {Number(plan.yearly_price) < Number(plan.monthly_price) * 12 && Number(plan.monthly_price) > 0 && (
                                                        <span className="absolute top-1 right-1 text-[9px] font-bold bg-emerald-500 text-white px-1 py-0.5 rounded">
                                                            SAVE {Math.round(100 - (Number(plan.yearly_price) / (Number(plan.monthly_price) * 12)) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => openEditPlan(plan)}
                                                    className="flex-1 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deletePlan(plan)}
                                                    className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Subscriptions Tab ── */}
                    {tab === 'subscriptions' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900">Member Subscriptions</h3>
                                <button
                                    onClick={() => setShowSubModal(true)}
                                    disabled={plans.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all"
                                    title={plans.length === 0 ? 'Create a plan first' : ''}
                                >
                                    <span className="text-lg leading-none">+</span> Assign Subscription
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-gray-100">
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Member</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Plan</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Cycle</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Next Due</th>
                                                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {subscriptions.map(sub => (
                                                <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                                {sub.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-gray-900 text-sm">{sub.user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm text-gray-900 font-medium">{sub.plan_name}</p>
                                                            {sub.training_group && (
                                                                <p className="text-xs text-violet-600 mt-0.5">{sub.training_group.name}</p>
                                                            )}
                                                            {/* Payment Invoices */}
                                                            {sub.payments && sub.payments.length > 0 && (
                                                                <div className="mt-2 space-y-1">
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Invoices:</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {sub.payments.map((p) => (
                                                                            <a
                                                                                key={p.id}
                                                                                href={route('invoices.download', p.id)}
                                                                                className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-0.5 rounded transition-all"
                                                                                title={`Payment date: ${p.payment_date}`}
                                                                            >
                                                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                </svg>
                                                                                #{p.id} (€{Number(p.amount).toFixed(0)})
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                                            sub.billing_cycle === 'yearly'
                                                                ? 'bg-indigo-50 text-indigo-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {sub.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-indigo-600">€{Number(sub.amount).toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                            sub.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : sub.status === 'overdue'
                                                                ? 'bg-red-50 text-red-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'
                                                            }`} />
                                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sub.next_payment_at)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => { setSelectedSub(sub); payForm.setData('amount', sub.amount); }}
                                                                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                            >
                                                                Log Payment
                                                            </button>
                                                            <button
                                                                onClick={() => deleteSub(sub)}
                                                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {subscriptions.length === 0 && (
                                        <div className="py-14 text-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">💳</div>
                                            <p className="font-semibold text-gray-900">No subscriptions yet</p>
                                            <p className="text-sm text-gray-500 mt-1">Assign subscriptions to members using the button above.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ── Create / Edit Plan Modal ── */}
            {showPlanModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">{editPlan ? 'Edit Plan' : 'New Subscription Plan'}</h3>
                            <p className="text-indigo-200 text-sm mt-0.5">Set pricing for monthly and yearly billing</p>
                        </div>

                        <form onSubmit={submitPlan} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Plan Name</label>
                                <input
                                    type="text"
                                    value={planForm.data.name}
                                    onChange={e => planForm.setData('name', e.target.value)}
                                    placeholder="e.g. Basic Membership"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                {planForm.errors.name && <p className="text-xs text-red-600 mt-1">{planForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Scope</label>
                                <select
                                    value={planForm.data.training_group_id}
                                    onChange={e => planForm.setData('training_group_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">Club-wide (all members)</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Monthly Price (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={planForm.data.monthly_price}
                                        onChange={e => planForm.setData('monthly_price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    {planForm.errors.monthly_price && <p className="text-xs text-red-600 mt-1">{planForm.errors.monthly_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Yearly Price (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={planForm.data.yearly_price}
                                        onChange={e => planForm.setData('yearly_price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    {planForm.errors.yearly_price && <p className="text-xs text-red-600 mt-1">{planForm.errors.yearly_price}</p>}
                                </div>
                            </div>

                            {planForm.data.monthly_price && planForm.data.yearly_price &&
                             Number(planForm.data.yearly_price) < Number(planForm.data.monthly_price) * 12 &&
                             Number(planForm.data.monthly_price) > 0 && (
                                <div className="bg-emerald-50 rounded-xl px-4 py-2.5 text-xs text-emerald-700 font-semibold">
                                    Yearly saves {Math.round(100 - (Number(planForm.data.yearly_price) / (Number(planForm.data.monthly_price) * 12)) * 100)}% vs monthly
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description (optional)</label>
                                <textarea
                                    value={planForm.data.description}
                                    onChange={e => planForm.setData('description', e.target.value)}
                                    rows={2}
                                    placeholder="What's included in this plan..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPlanModal(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={planForm.processing}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {planForm.processing ? 'Saving...' : editPlan ? 'Save Changes' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Assign Subscription Modal ── */}
            {showSubModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">Assign Subscription</h3>
                            <p className="text-indigo-200 text-sm mt-0.5">Enroll a member in a subscription plan</p>
                        </div>

                        <form onSubmit={submitSub} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Member</label>
                                <select
                                    value={subForm.data.user_id}
                                    onChange={e => subForm.setData('user_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">Select member...</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                {subForm.errors.user_id && <p className="text-xs text-red-600 mt-1">{subForm.errors.user_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Plan</label>
                                <select
                                    value={subForm.data.subscription_plan_id}
                                    onChange={e => subForm.setData('subscription_plan_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value="">Select plan...</option>
                                    {plans.filter(p => p.is_active).map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}{p.training_group ? ` — ${p.training_group.name}` : ' — Club-wide'}
                                        </option>
                                    ))}
                                </select>
                                {subForm.errors.subscription_plan_id && <p className="text-xs text-red-600 mt-1">{subForm.errors.subscription_plan_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Billing Cycle</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['monthly', 'yearly'] as const).map(cycle => (
                                        <button
                                            key={cycle}
                                            type="button"
                                            onClick={() => subForm.setData('billing_cycle', cycle)}
                                            className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                                subForm.data.billing_cycle === cycle
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="capitalize">{cycle}</div>
                                            {selectedPlan && (
                                                <div className={`text-xs mt-0.5 font-bold ${subForm.data.billing_cycle === cycle ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                    €{Number(cycle === 'yearly' ? selectedPlan.yearly_price : selectedPlan.monthly_price).toFixed(2)}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {computedPrice !== null && (
                                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-sm text-indigo-700 font-semibold">
                                        {subForm.data.billing_cycle === 'yearly' ? 'Annual total' : 'Monthly charge'}
                                    </span>
                                    <span className="text-xl font-black text-indigo-700">€{Number(computedPrice).toFixed(2)}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Start Date</label>
                                <input
                                    type="date"
                                    value={subForm.data.starts_at}
                                    onChange={e => subForm.setData('starts_at', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowSubModal(false); subForm.reset(); }}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={subForm.processing}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {subForm.processing ? 'Assigning...' : 'Assign Subscription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Log Payment Modal ── */}
            {selectedSub && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5">
                            <h3 className="text-lg font-bold text-white">Log Payment</h3>
                            <p className="text-emerald-100 text-sm mt-0.5">Recording payment for {selectedSub.user.name}</p>
                        </div>

                        <form onSubmit={submitPayment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Amount (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={payForm.data.amount}
                                    onChange={e => payForm.setData('amount', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Payment Date</label>
                                <input
                                    type="date"
                                    value={payForm.data.payment_date}
                                    onChange={e => payForm.setData('payment_date', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Notes (optional)</label>
                                <input
                                    type="text"
                                    value={payForm.data.notes}
                                    onChange={e => payForm.setData('notes', e.target.value)}
                                    placeholder="e.g. Cash payment"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSub(null)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={payForm.processing}
                                    className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {payForm.processing ? 'Saving...' : 'Save Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
