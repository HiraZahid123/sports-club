import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4">🔐</div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Confirm your password</h1>
                <p className="text-sm text-gray-500">This is a secure area. Please confirm your password before continuing.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60"
                >
                    {processing ? 'Confirming...' : 'Confirm Password'}
                </button>
            </form>
        </GuestLayout>
    );
}
