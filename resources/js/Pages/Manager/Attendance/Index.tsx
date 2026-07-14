import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Athlete {
    id: number;
    name: string;
}

interface Group {
    id: number;
    name: string;
    skill_level: string;
    athletes: Athlete[];
}

interface AttendanceRow {
    athlete_id: number;
    name: string;
    status: 'present' | 'absent';
    base_points: number;
    extra_points: number;
}

export default function ManagerAttendance({
    groups = [],
    selectedGroupId: initialGroupId = '',
    date: initialDate = '',
}: {
    groups?: Group[];
    selectedGroupId?: string | number;
    date?: string;
}) {
    const [selectedGroupId, setSelectedGroupId] = useState<string>(
        initialGroupId ? String(initialGroupId) : (groups.length > 0 ? String(groups[0].id) : '')
    );
    const [attendanceDate, setAttendanceDate] = useState<string>(
        initialDate || new Date().toISOString().split('T')[0]
    );
    const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const loadAttendance = () => {
        if (!selectedGroupId || !attendanceDate) return;
        setLoading(true);
        setMessage(null);
        axios.get(route('manager.attendance.load'), {
            params: {
                group_id: selectedGroupId,
                date: attendanceDate
            }
        })
        .then(res => {
            setAttendanceList(res.data.attendance);
        })
        .catch(err => {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load attendance records.' });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        loadAttendance();
    }, [selectedGroupId, attendanceDate]);

    const handleStatusChange = (athleteId: number, status: 'present' | 'absent') => {
        setAttendanceList(prev => prev.map(item => 
            item.athlete_id === athleteId ? { ...item, status } : item
        ));
    };

    const handlePointsChange = (athleteId: number, field: 'base_points' | 'extra_points', value: number) => {
        setAttendanceList(prev => prev.map(item => 
            item.athlete_id === athleteId ? { ...item, [field]: value } : item
        ));
    };

    const submitAttendance = (e: React.FormEvent) => {
        e.preventDefault();
        if (attendanceList.length === 0) return;
        setSubmitting(true);
        setMessage(null);
        axios.post(route('manager.attendance.save'), {
            training_group_id: Number(selectedGroupId),
            attendance_date: attendanceDate,
            attendance_data: attendanceList
        })
        .then(res => {
            setMessage({ type: 'success', text: 'Attendance saved and athlete points updated successfully!' });
        })
        .catch(err => {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save attendance logs. Please check your data.' });
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Training Attendance</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage training logs and adjust athlete points across all groups</p>
                </div>
            }
        >
            <Head title="Manager - Training Attendance" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 px-6 py-4 border-b border-gray-150 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Track and Award Points</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Managers have full access to add or remove training attendances and adjust base/extra points</p>
                            </div>
                            <span className="text-2xl">📝</span>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Group & Date Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Training Group</label>
                                    <select
                                        value={selectedGroupId}
                                        onChange={e => setSelectedGroupId(e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium"
                                    >
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id}>{g.name} ({g.skill_level})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        value={attendanceDate}
                                        onChange={e => setAttendanceDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-xl border border-gray-200 text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-semibold border ${
                                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                                    <p className="text-sm text-gray-500">Retrieving athlete records...</p>
                                </div>
                            ) : (
                                <form onSubmit={submitAttendance} className="space-y-4">
                                    {attendanceList.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl bg-white">
                                            No athletes registered in this training group.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl border border-gray-150 shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
                                                <thead className="bg-slate-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-3.5">Athlete</th>
                                                        <th className="px-6 py-3.5 text-center">Status</th>
                                                        <th className="px-6 py-3.5 text-center">Base Points</th>
                                                        <th className="px-6 py-3.5 text-center">Extra Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {attendanceList.map((row) => (
                                                        <tr key={row.athlete_id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 font-bold text-gray-900">{row.name}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/50">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(row.athlete_id, 'present')}
                                                                        className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${
                                                                            row.status === 'present'
                                                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                                                : 'text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                                    >
                                                                        Present
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(row.athlete_id, 'absent')}
                                                                        className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${
                                                                            row.status === 'absent'
                                                                                ? 'bg-rose-600 text-white shadow-sm'
                                                                                : 'text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                                    >
                                                                        Absent
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center font-semibold">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={row.base_points}
                                                                    onChange={e => handlePointsChange(row.athlete_id, 'base_points', Math.max(0, parseInt(e.target.value) || 0))}
                                                                    disabled={row.status === 'absent'}
                                                                    className="w-20 rounded-lg border border-gray-200 text-center py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-bold disabled:opacity-40 disabled:bg-slate-50"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-center font-semibold">
                                                                <input
                                                                    type="number"
                                                                    value={row.extra_points}
                                                                    onChange={e => handlePointsChange(row.athlete_id, 'extra_points', parseInt(e.target.value) || 0)}
                                                                    disabled={row.status === 'absent'}
                                                                    className="w-20 rounded-lg border border-gray-200 text-center py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-bold disabled:opacity-40 disabled:bg-slate-50"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {attendanceList.length > 0 && (
                                        <div className="flex justify-end pt-3">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {submitting ? 'Saving changes...' : 'Save Attendance Records'}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
