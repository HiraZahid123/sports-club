import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function ProfilePhotoCard({ status }: { status?: string }) {
    const user = usePage().props.auth.user as any;

    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview]     = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoError(null);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!photoFile) return;
        setUploading(true);
        setPhotoError(null);
        const form = new FormData();
        form.append('photo', photoFile);
        router.post(route('profile.photo'), form, {
            onSuccess: () => { setPhotoFile(null); setPreview(null); setUploading(false); },
            onError: (errs) => { setPhotoError(errs.photo ?? 'Upload failed.'); setUploading(false); },
        });
    };

    const currentPhoto = preview ?? (user.profile_photo ? `/${user.profile_photo}` : null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">📷</div>
                    <div>
                        <h3 className="text-base font-bold text-indigo-900">Profile Photo</h3>
                        <p className="text-xs text-indigo-600 mt-0.5">Shown across the platform. JPG, PNG, GIF or WEBP · max 3 MB</p>
                    </div>
                </div>
            </div>

            {status === 'photo-updated' && (
                <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Profile photo updated successfully.
                </div>
            )}

            <form onSubmit={handleUpload} className="p-6">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                        {currentPhoto ? (
                            <img
                                src={currentPhoto}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-3xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex-1 space-y-3">
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {!photoFile ? (
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {user.profile_photo ? 'Change Photo' : 'Upload Photo'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {uploading ? 'Uploading…' : 'Save Photo'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhotoFile(null);
                                        setPreview(null);
                                        setPhotoError(null);
                                        if (fileInput.current) fileInput.current.value = '';
                                    }}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <span className="text-xs text-gray-400 truncate max-w-xs">{photoFile.name}</span>
                            </div>
                        )}

                        {photoError && <p className="text-xs text-red-600">{photoError}</p>}

                        {!photoFile && (
                            <p className="text-xs text-gray-400">
                                {user.profile_photo ? 'Click "Change Photo" to upload a new image.' : 'No photo uploaded yet.'}
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and account security</p>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">

                    <ProfilePhotoCard status={status} />

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
