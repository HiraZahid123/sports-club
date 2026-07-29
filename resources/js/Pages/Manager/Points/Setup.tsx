import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Category {
    id: number;
    name: string;
    points: number;
}

interface Settings {
    regular_training_points: number;
    points_reset_date: string | null;
    points_period_start: string | null;
}

export default function PointsSetup({ categories, settings }: {
    categories: Category[];
    settings: Settings;
}) {
    // --- Settings Form ---
    const settingsForm = useForm({
        regular_training_points: settings.regular_training_points,
        points_reset_date: settings.points_reset_date ?? '',
    });

    const submitSettings: FormEventHandler = (e) => {
        e.preventDefault();
        settingsForm.post(route('manager.points.settings'), {
            preserveScroll: true,
        });
    };

    // --- Reset Form ---
    const resetForm = useForm({});
    const triggerReset = () => {
        if (confirm("WARNING: Are you sure you want to reset all athletes' points to 0 now? This will archive their current points in history and can not be undone.")) {
            resetForm.post(route('manager.points.reset'), {
                preserveScroll: true,
            });
        }
    };

    // --- Category Forms ---
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const categoryForm = useForm({
        name: '',
        points: 0,
    });

    const editCategoryForm = useForm({
        name: '',
        points: 0,
    });

    const submitCreateCategory: FormEventHandler = (e) => {
        e.preventDefault();
        categoryForm.post(route('manager.points.categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                categoryForm.reset();
            }
        });
    };

    const submitEditCategory: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingCategory) return;
        editCategoryForm.put(route('manager.points.categories.update', editingCategory.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
                editCategoryForm.reset();
            }
        });
    };

    const startEditing = (cat: Category) => {
        setEditingCategory(cat);
        editCategoryForm.setData({
            name: cat.name,
            points: cat.points,
        });
    };

    const deleteCategory = (cat: Category) => {
        if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
            categoryForm.delete(route('manager.points.categories.destroy', cat.id), {
                preserveScroll: true,
            });
        }
    };

    const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all";
    const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Points System Setup</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Configure default attendance points, reset periods, and event categories</p>
                </div>
            }
        >
            <Head title="Points Setup" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Top Row: Settings & Manual Reset */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Settings Form */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-indigo-900">Configure Point System</h3>
                                    <p className="text-xs text-indigo-600 mt-0.5">Control default points and automation schedules</p>
                                </div>
                                <span className="text-2xl">⚙️</span>
                            </div>

                            <form onSubmit={submitSettings} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Regular Training Attendance Points</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settingsForm.data.regular_training_points}
                                            onChange={(e) => settingsForm.setData('regular_training_points', Math.max(0, parseInt(e.target.value) || 0))}
                                            className={inputClass}
                                            placeholder="e.g. 5"
                                        />
                                        {settingsForm.errors.regular_training_points && (
                                            <p className="mt-1 text-xs text-red-600">{settingsForm.errors.regular_training_points}</p>
                                        )}
                                        <span className="text-[10px] text-gray-400 mt-1 block">Points awarded automatically on training present attendance.</span>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Automatic Points Reset Date</label>
                                        <input
                                            type="date"
                                            value={settingsForm.data.points_reset_date}
                                            onChange={(e) => settingsForm.setData('points_reset_date', e.target.value)}
                                            className={inputClass}
                                        />
                                        {settingsForm.errors.points_reset_date && (
                                            <p className="mt-1 text-xs text-red-600">{settingsForm.errors.points_reset_date}</p>
                                        )}
                                        <span className="text-[10px] text-gray-400 mt-1 block">When this date arrives, all athlete points reset to 0 & archive.</span>
                                    </div>
                                </div>

                                {settings.points_period_start && (
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">Current Period Start Date:</span>
                                        <span className="font-mono font-bold text-gray-800">{settings.points_period_start}</span>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={settingsForm.processing}
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                                    >
                                        {settingsForm.processing ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Reset Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-red-900">Manual Reset</h3>
                                    <p className="text-xs text-red-600 mt-0.5">Immediately archive and reset scores</p>
                                </div>
                                <span className="text-2xl">⚠️</span>
                            </div>

                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Force a manual reset of all athletes' points. This resets their profile points back to 0, completes the current period, and saves their points in history records for historical archive lookups.
                                </p>
                                
                                <button
                                    type="button"
                                    onClick={triggerReset}
                                    disabled={resetForm.processing}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    🔄 {resetForm.processing ? 'Resetting...' : 'Reset All Points Now'}
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Row: Event Categories CRUD */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Categories List */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Event Categories</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Categories with fixed points for quick setup</p>
                                </div>
                                <span className="text-lg">🏅</span>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {categories.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400 italic text-sm">
                                        No event categories created yet. Create a category on the right.
                                    </div>
                                ) : (
                                    categories.map((cat) => (
                                        <div key={cat.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                                            {editingCategory?.id === cat.id ? (
                                                <form onSubmit={submitEditCategory} className="w-full flex items-center gap-3">
                                                    <input
                                                        type="text"
                                                        value={editCategoryForm.data.name}
                                                        onChange={(e) => editCategoryForm.setData('name', e.target.value)}
                                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        placeholder="Category Name"
                                                        required
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editCategoryForm.data.points}
                                                        onChange={(e) => editCategoryForm.setData('points', Math.max(0, parseInt(e.target.value) || 0))}
                                                        className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        placeholder="Points"
                                                        required
                                                    />
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            type="submit"
                                                            disabled={editCategoryForm.processing}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingCategory(null)}
                                                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold rounded-lg"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5 mt-1">
                                                            ⭐ {cat.points} points
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditing(cat)}
                                                            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCategory(cat)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Create Category Form */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-900">Add Event Category</h3>
                                    <p className="text-xs text-emerald-600 mt-0.5">Define category parameters</p>
                                </div>
                                <span className="text-2xl">✨</span>
                            </div>

                            <form onSubmit={submitCreateCategory} className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Category Name</label>
                                        <input
                                            type="text"
                                            value={categoryForm.data.name}
                                            onChange={(e) => categoryForm.setData('name', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g. Category A, Local Sparring"
                                            required
                                        />
                                        {categoryForm.errors.name && (
                                            <p className="mt-1 text-xs text-red-600">{categoryForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClass}>Points Given</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={categoryForm.data.points || ''}
                                            onChange={(e) => categoryForm.setData('points', Math.max(0, parseInt(e.target.value) || 0))}
                                            className={inputClass}
                                            placeholder="e.g. 50"
                                            required
                                        />
                                        {categoryForm.errors.points && (
                                            <p className="mt-1 text-xs text-red-600">{categoryForm.errors.points}</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    {categoryForm.processing ? 'Creating...' : 'Create Category'}
                                </button>
                            </form>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
