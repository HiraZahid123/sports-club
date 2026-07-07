import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

interface SubscriptionPlan {
    id: number;
    name: string;
    monthly_price: number | string;
    yearly_price: number | string;
    description: string | null;
    training_group?: {
        id: number;
        name: string;
    } | null;
}

export default function JoinGroupForm({
    availablePlans = [],
    className = '',
}: {
    availablePlans?: SubscriptionPlan[];
    className?: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        subscription_plan_id: '',
        billing_cycle: 'monthly',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.subscription_plan_id) return;
        post(route('athlete.profile.join-group'));
    };

    const selectedPlan = availablePlans.find(
        (plan) => plan.id === Number(data.subscription_plan_id)
    );

    if (availablePlans.length === 0) {
        return null; // Don't render anything if there are no available plans to join
    }

    return (
        <section className={className}>
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">➕</div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Join Another Training Group
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Subscribe to additional groups and checkout safely with Stripe.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Plan Dropdown */}
                <div className="max-w-xl">
                    <InputLabel htmlFor="subscription_plan_id" value="Select Training Plan" />
                    <select
                        id="subscription_plan_id"
                        value={data.subscription_plan_id}
                        onChange={(e) => setData('subscription_plan_id', e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5"
                        required
                    >
                        <option value="">-- Choose a Training Plan / Group --</option>
                        {availablePlans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name} {plan.training_group ? `(${plan.training_group.name})` : ''}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.subscription_plan_id} className="mt-2" />
                </div>

                {/* Plan Details Preview */}
                {selectedPlan && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 max-w-xl space-y-4 transition-all duration-300">
                        <div>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">Plan Description</span>
                            <p className="text-sm text-gray-700 mt-1">
                                {selectedPlan.description || 'No description provided for this plan.'}
                            </p>
                        </div>

                        {/* Billing Cycle Picker */}
                        <div className="space-y-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">Billing Cycle</span>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <label className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    data.billing_cycle === 'monthly'
                                        ? 'border-indigo-600 bg-white shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                                }`}>
                                    <input
                                        type="radio"
                                        name="billing_cycle"
                                        value="monthly"
                                        checked={data.billing_cycle === 'monthly'}
                                        onChange={() => setData('billing_cycle', 'monthly')}
                                        className="sr-only"
                                    />
                                    <span className="text-xs font-extrabold text-gray-500">Monthly</span>
                                    <span className="text-lg font-black text-gray-900 mt-1">€{selectedPlan.monthly_price}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Billed every month</span>
                                </label>

                                <label className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    data.billing_cycle === 'yearly'
                                        ? 'border-indigo-600 bg-white shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                                }`}>
                                    <input
                                        type="radio"
                                        name="billing_cycle"
                                        value="yearly"
                                        checked={data.billing_cycle === 'yearly'}
                                        onChange={() => setData('billing_cycle', 'yearly')}
                                        className="sr-only"
                                    />
                                    <span className="text-xs font-extrabold text-gray-500">Yearly</span>
                                    <span className="text-lg font-black text-gray-900 mt-1">€{selectedPlan.yearly_price}</span>
                                    <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Best Value</span>
                                </label>
                            </div>
                            <InputError message={errors.billing_cycle} className="mt-2" />
                        </div>
                    </div>
                )}

                {/* Submit Action */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !data.subscription_plan_id}>
                        {processing ? 'Redirecting to Stripe...' : 'Subscribe & Pay'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
