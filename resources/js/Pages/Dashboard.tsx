import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏠</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to SportClub</h3>
                        <p className="text-sm text-gray-500">You're successfully logged in. Use the navigation above to get started.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
