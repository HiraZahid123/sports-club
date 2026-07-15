import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getDateForDayOfWeek } from '@/dateHelpers';

interface ScheduleSlot {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string | null;
    notes: string | null;
    group: {
        id: number;
        name: string;
    } | null;
    facility?: {
        id: number;
        name: string;
    } | null;
}

const fmtTime = (t: string) => {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
};

export default function CoachSchedule({ schedules = [] }: { schedules?: ScheduleSlot[] }) {
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
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-left">
                                    {schedules.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                                No scheduled training sessions.
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.map((slot) => {
                                            const targetDate = getDateForDayOfWeek(slot.day_of_week);
                                            const markAttendanceUrl = slot.group
                                                ? route('coach.dashboard', {
                                                      tab: 'attendance',
                                                      group_id: slot.group.id,
                                                      date: targetDate,
                                                  })
                                                : '';
                                            return (
                                                <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {slot.group ? (
                                                            <Link
                                                                href={markAttendanceUrl}
                                                                className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                                            >
                                                                {slot.day_of_week}
                                                            </Link>
                                                        ) : (
                                                            slot.day_of_week
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {fmtTime(slot.start_time)} - {fmtTime(slot.end_time)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {slot.group ? (
                                                            <Link
                                                                href={markAttendanceUrl}
                                                                className="hover:underline"
                                                            >
                                                                {slot.group.name}
                                                            </Link>
                                                        ) : (
                                                            '—'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.facility?.name ?? slot.location ?? '—'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {slot.group ? (
                                                            <Link
                                                                href={markAttendanceUrl}
                                                                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                                                            >
                                                                Mark Attendance <span className="text-xs">→</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
