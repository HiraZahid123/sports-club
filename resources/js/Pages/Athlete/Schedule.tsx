import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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
        coaches?: Array<{ id: number; name: string }>;
    };
    facility?: {
        id: number;
        name: string;
    } | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fmtTime = (t: string) => {
    if (!t) return '';
    const parts = t.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
};

export default function AthleteSchedule({ schedules = [] }: { schedules?: ScheduleSlot[] }) {
    // Group schedules by day of week
    const schedulesByDay = DAYS.reduce((acc, day) => {
        acc[day] = schedules.filter(s => s.day_of_week === day);
        return acc;
    }, {} as Record<string, ScheduleSlot[]>);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
                    <p className="text-sm text-gray-500 mt-0.5">View your weekly training plan and sessions</p>
                </div>
            }
        >
            <Head title="Athlete Schedule" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {schedules.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Training Sessions</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                                You are not assigned to any training groups with an active schedule. Please contact your manager or coach.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span>📅</span> My Weekly Plan
                            </h3>
                            
                            <div className="space-y-6">
                                {DAYS.map(day => {
                                    const daySlots = schedulesByDay[day];
                                    if (daySlots.length === 0) return null;

                                    return (
                                        <div key={day} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="bg-slate-50 px-5 py-3 border-b border-gray-100">
                                                <h4 className="text-sm font-bold text-indigo-900">{day}</h4>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {daySlots.map(slot => {
                                                    const coaches = slot.group.coaches?.map(c => c.name).join(', ') || 'No coach assigned';
                                                    const loc = slot.facility?.name || slot.location || 'Main Hall';
                                                    
                                                    return (
                                                        <div key={slot.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/55 transition-all">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-extrabold border border-indigo-100">
                                                                        {slot.group.name}
                                                                    </span>
                                                                    <span className="text-sm font-black text-gray-700">
                                                                        {fmtTime(slot.start_time)} - {fmtTime(slot.end_time)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    Coach: <strong className="text-gray-700 font-semibold">{coaches}</strong>
                                                                </p>
                                                                {slot.notes && (
                                                                    <p className="text-xs text-gray-400 italic">
                                                                        Note: {slot.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 w-fit">
                                                                <span>📍</span>
                                                                <span>{loc}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
