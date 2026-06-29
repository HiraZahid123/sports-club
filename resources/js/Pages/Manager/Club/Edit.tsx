import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

interface Club {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    logo_path?: string | null;
    join_code?: string | null;
    sport_type?: string | null;
    founding_date?: string | null;
    opening_time?: string | null;
    closing_time?: string | null;
}

export default function ClubEdit({ club, status }: { club: Club; status?: string }) {
    const [codeCopied, setCodeCopied]   = useState(false);
    const [linkCopied, setLinkCopied]   = useState(false);
    const [editingCode, setEditingCode] = useState(false);
    const [codeInput, setCodeInput]     = useState(club.join_code ?? '');
    const [regenerating, setRegenerating] = useState(false);

    const joinLink = club.join_code
        ? `${window.location.origin}/register/join?code=${club.join_code}`
        : '';

    const copyJoinCode = () => {
        if (!club.join_code) return;
        navigator.clipboard.writeText(club.join_code).then(() => {
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        });
    };

    const copyJoinLink = () => {
        if (!joinLink) return;
        navigator.clipboard.writeText(joinLink).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    const saveJoinCode = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('manager.club.join-code'), { join_code: codeInput }, {
            onSuccess: () => setEditingCode(false),
        });
    };

    const regenerateCode = () => {
        if (!confirm('Generate a new random code? The old code and any shared links will stop working.')) return;
        setRegenerating(true);
        router.post(route('manager.club.join-code.regenerate'), {}, {
            onFinish: () => setRegenerating(false),
        });
    };
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: club.name || '',
        email: club.email || '',
        phone: club.phone || '',
        address: club.address || '',
        description: club.description || '',
        sport_type: club.sport_type || '',
        founding_date: club.founding_date ? club.founding_date.substring(0, 10) : '',
        opening_time: club.opening_time ? club.opening_time.substring(0, 5) : '',
        closing_time: club.closing_time ? club.closing_time.substring(0, 5) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('manager.club.update'));
    };

    // --- Logo upload state ---
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoError(null);
        setPreview(URL.createObjectURL(file));
    };

    const handleLogoUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!logoFile) return;
        setUploading(true);
        setLogoError(null);
        const form = new FormData();
        form.append('logo', logoFile);
        router.post(route('manager.club.logo'), form, {
            onSuccess: () => {
                setLogoFile(null);
                setPreview(null);
                setUploading(false);
            },
            onError: (errs) => {
                setLogoError(errs.logo ?? 'Upload failed.');
                setUploading(false);
            },
        });
    };

    const currentLogo = preview ?? (club.logo_path ? (club.logo_path.startsWith('http://') || club.logo_path.startsWith('https://') || club.logo_path.startsWith('blob:') || club.logo_path.startsWith('data:') ? club.logo_path : (club.logo_path.startsWith('/') ? club.logo_path : '/' + club.logo_path)) : null);

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all';
    const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Club Settings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your club's profile and contact information</p>
                </div>
            }
        >
            <Head title="Club Settings" />

            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Flash messages */}
                    {status === 'logo-updated' && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Club photo updated successfully.
                        </div>
                    )}

                    {/* Club Joining Code */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-emerald-100">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">Club Join Code</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Share the code, link, or QR with athletes and parents</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setEditingCode(true); setCodeInput(club.join_code ?? ''); }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-all"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Code
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">

                            {/* Edit code form */}
                            {editingCode && (
                                <form onSubmit={saveJoinCode} className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Custom Code (4–12 characters, letters & numbers only)</label>
                                        <input
                                            type="text"
                                            value={codeInput}
                                            onChange={e => setCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                            maxLength={12}
                                            placeholder="e.g. DRAGON7"
                                            className="w-full rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-mono font-bold text-gray-900 tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-5">
                                        <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all">Save</button>
                                        <button type="button" onClick={() => setEditingCode(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                                    </div>
                                </form>
                            )}

                            {/* No code yet */}
                            {!club.join_code && !editingCode && (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500 mb-3">No join code set yet.</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingCode(true)}
                                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all"
                                        >
                                            Set Custom Code
                                        </button>
                                        <button
                                            type="button"
                                            onClick={regenerateCode}
                                            disabled={regenerating}
                                            className="px-4 py-2 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50"
                                        >
                                            Generate Random Code
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Code display */}
                            {club.join_code && (
                                <>
                                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                                        {/* Left: code + link */}
                                        <div className="flex-1 space-y-4">
                                            {/* Big code */}
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Club Code</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-4xl font-black tracking-[0.35em] text-gray-900 font-mono">{club.join_code}</p>
                                                    <button
                                                        type="button"
                                                        onClick={copyJoinCode}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                            codeCopied ? 'bg-emerald-500 text-white' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        }`}
                                                    >
                                                        {codeCopied ? (
                                                            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Copied!</>
                                                        ) : (
                                                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Invite link */}
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Invite Link</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="flex-1 text-xs text-gray-600 font-mono bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 truncate min-w-0">
                                                        {joinLink}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={copyJoinLink}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                                                            linkCopied ? 'bg-indigo-600 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                        }`}
                                                    >
                                                        {linkCopied ? (
                                                            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Copied!</>
                                                        ) : (
                                                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>Copy Link</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Regenerate */}
                                            <button
                                                type="button"
                                                onClick={regenerateCode}
                                                disabled={regenerating}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                {regenerating ? 'Generating…' : 'Generate new random code'}
                                            </button>
                                        </div>

                                        {/* Right: QR code */}
                                        <div className="flex flex-col items-center gap-3 shrink-0">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest self-start">QR Code</p>
                                            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                                                <QRCode
                                                    value={joinLink}
                                                    size={140}
                                                    bgColor="#ffffff"
                                                    fgColor="#1e293b"
                                                    level="M"
                                                />
                                            </div>
                                            <p className="text-[11px] text-gray-400 text-center max-w-[160px] leading-relaxed">
                                                Scan to open the join page with code pre-filled
                                            </p>
                                        </div>
                                    </div>

                                    {/* How-to note */}
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            <strong>How athletes register:</strong> Scan the QR code or share the invite link — it opens the registration page with the code pre-filled.
                                            Or give them the code directly and tell them to go to <strong>Register → Join as Athlete or Parent</strong>.
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Success flash */}
                            {status === 'join-code-updated' && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">
                                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Join code updated successfully.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Club Photo */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">📷</div>
                                <div>
                                    <h3 className="text-base font-bold text-indigo-900">Club Photo</h3>
                                    <p className="text-xs text-indigo-600 mt-0.5">Shown on your club profile. JPG, PNG, GIF or WEBP · max 3 MB</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleLogoUpload} className="p-6">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    {currentLogo ? (
                                        <img
                                            src={currentLogo}
                                            alt="Club logo"
                                            className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-100 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2v12a2 2 0 01-2 2z" />
                                                <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
                                            </svg>
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

                                    {!logoFile ? (
                                        <button
                                            type="button"
                                            onClick={() => fileInput.current?.click()}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {club.logo_path ? 'Change Photo' : 'Upload Photo'}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                            >
                                                {uploading ? 'Uploading…' : 'Save Photo'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setLogoFile(null); setPreview(null); setLogoError(null); if (fileInput.current) fileInput.current.value = ''; }}
                                                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <span className="text-xs text-gray-400 truncate max-w-40">{logoFile.name}</span>
                                        </div>
                                    )}

                                    {logoError && <p className="text-xs text-red-600">{logoError}</p>}

                                    {!logoFile && (
                                        <p className="text-xs text-gray-400">
                                            {club.logo_path ? 'Click "Change Photo" to upload a new image.' : 'No photo uploaded yet.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Profile Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg">🏟️</div>
                                <div>
                                    <h3 className="text-base font-bold text-indigo-900">Club Profile</h3>
                                    <p className="text-xs text-indigo-600 mt-0.5">Update your club's public-facing information</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className={labelClass}>Club Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Dragon Taekwondo Academy"
                                    className={inputClass}
                                />
                                {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="club@example.com"
                                        className={inputClass}
                                    />
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className={inputClass}
                                    />
                                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Address</label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="123 Sports Ave, City, State 12345"
                                    rows={3}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Sport Type</label>
                                    <input
                                        type="text"
                                        value={data.sport_type}
                                        onChange={(e) => setData('sport_type', e.target.value)}
                                        placeholder="e.g. Taekwondo, Soccer, Swimming"
                                        className={inputClass}
                                    />
                                    {errors.sport_type && <p className="mt-1.5 text-xs text-red-600">{errors.sport_type}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Founding Date</label>
                                    <input
                                        type="date"
                                        value={data.founding_date}
                                        onChange={(e) => setData('founding_date', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.founding_date && <p className="mt-1.5 text-xs text-red-600">{errors.founding_date}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Opening Time</label>
                                    <input
                                        type="time"
                                        value={data.opening_time}
                                        onChange={(e) => setData('opening_time', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.opening_time && <p className="mt-1.5 text-xs text-red-600">{errors.opening_time}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Closing Time</label>
                                    <input
                                        type="time"
                                        value={data.closing_time}
                                        onChange={(e) => setData('closing_time', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.closing_time && <p className="mt-1.5 text-xs text-red-600">{errors.closing_time}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Club Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tell athletes and parents about your club..."
                                    rows={4}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm shadow-indigo-200"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>

                                {recentlySuccessful && (
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Saved successfully
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-sm font-bold text-red-800">Danger Zone</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-5">
                                Permanently delete this club and all associated data — members, groups, billing history. <strong>This action cannot be undone.</strong>
                            </p>
                            <button className="px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all">
                                Delete Club
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
