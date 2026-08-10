import { useEffect, useState } from 'react';

/**
 * Normalises a stored profile photo value into a browser-usable src.
 * Photos are stored as "/uploads/profile-photos/x.jpg" but older rows and
 * local previews may come through as absolute/blob/data URLs.
 */
export function resolvePhotoUrl(photo?: string | null): string | null {
    if (!photo) return null;
    const value = String(photo).trim();
    if (!value) return null;
    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('//') ||
        value.startsWith('blob:') ||
        value.startsWith('data:')
    ) {
        return value;
    }
    return value.startsWith('/') ? value : '/' + value;
}

interface Props {
    name?: string | null;
    photo?: string | null;
    /** Sizing / shape / text-size utilities, e.g. "w-10 h-10 rounded-xl text-sm" */
    className?: string;
    /** Colours used for the initials fallback */
    fallbackClassName?: string;
}

export default function UserAvatar({
    name,
    photo,
    className = 'w-10 h-10 rounded-xl text-sm',
    fallbackClassName = 'bg-indigo-100 text-indigo-700',
}: Props) {
    const src = resolvePhotoUrl(photo);
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false), [src]);

    const initial = (name ?? '').trim().charAt(0).toUpperCase() || '?';
    const showPhoto = src && !failed;

    return (
        <div
            className={`shrink-0 overflow-hidden flex items-center justify-center font-bold ${
                showPhoto ? 'bg-slate-100' : fallbackClassName
            } ${className}`}
        >
            {showPhoto ? (
                <img
                    src={src}
                    alt={name ?? 'User'}
                    className="w-full h-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                initial
            )}
        </div>
    );
}
