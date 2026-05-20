import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">📧</div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Verify your email</h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Thanks for signing up! Please verify your email address by clicking the link we sent you. Didn't receive it? We'll send another.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 text-center">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-60"
                >
                    {processing ? 'Sending...' : 'Resend Verification Email'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all text-center block"
                >
                    Sign Out
                </Link>
            </form>
        </GuestLayout>
    );
}
