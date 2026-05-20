import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function CoachSchedule() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Training Schedule</h2>
                    <p className="text-sm text-gray-500 mt-0.5">View and manage your upcoming training sessions</p>
                </div>
            }
        >
            <Head title="Coach Schedule" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Weekly Schedule</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Your full training schedule will be displayed here. This feature is currently being populated with your assigned group sessions.
                        </p>
                        
                        <div className="mt-8 overflow-hidden rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-left">
                                    {/* Mock Data for Schedule */}
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monday</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16:00 - 17:30</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Beginners Group</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Hall (Mat 1)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Wednesday</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16:00 - 17:30</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Beginners Group</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Hall (Mat 1)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Friday</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18:00 - 20:00</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Elite Sparring</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced Training Room</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
