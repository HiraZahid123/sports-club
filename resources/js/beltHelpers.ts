import { CSSProperties } from 'react';

export const BELT_OPTIONS = [
    { value: '10. WHITE', label: '10. WHITE' },
    { value: '9. WHITE/YELLOW', label: '9. WHITE/YELLOW' },
    { value: '8. YELLOW', label: '8. YELLOW' },
    { value: '7. YELLOW/GREEN', label: '7. YELLOW/GREEN' },
    { value: '6. GREEN', label: '6. GREEN' },
    { value: '5. GREEN/BLUE', label: '5. GREEN/BLUE' },
    { value: '4. BLUE', label: '4. BLUE' },
    { value: '3. BLUE/RED', label: '3. BLUE/RED' },
    { value: '2. RED', label: '2. RED' },
    { value: '1. RED/BLACK', label: '1. RED/BLACK' },
    { value: '1. POOM', label: '1. POOM' },
    { value: '1. DAN', label: '1. DAN' },
    { value: '2. DAN', label: '2. DAN' },
    { value: '3. DAN', label: '3. DAN' },
    { value: '4. DAN', label: '4. DAN' },
    { value: '5. DAN', label: '5. DAN' },
];

export function getBeltStyle(belt: string | null | undefined): CSSProperties {
    const defaultStyle: CSSProperties = { backgroundColor: '#d1d5db', borderColor: '#9ca3af' };
    if (!belt) return defaultStyle;
    const b = belt.toUpperCase().trim();

    if (b.includes('WHITE/YELLOW')) {
        return {
            background: 'linear-gradient(to right, #ffffff 35%, #eab308 35%, #eab308 65%, #ffffff 65%)',
            borderColor: '#d1d5db'
        };
    }
    if (b.includes('YELLOW/GREEN')) {
        return {
            background: 'linear-gradient(to right, #facc15 35%, #10b981 35%, #10b981 65%, #facc15 65%)',
            borderColor: '#eab308'
        };
    }
    if (b.includes('GREEN/BLUE')) {
        return {
            background: 'linear-gradient(to right, #10b981 35%, #3b82f6 35%, #3b82f6 65%, #10b981 65%)',
            borderColor: '#059669'
        };
    }
    if (b.includes('BLUE/RED')) {
        return {
            background: 'linear-gradient(to right, #3b82f6 35%, #ef4444 35%, #ef4444 65%, #3b82f6 65%)',
            borderColor: '#2563eb'
        };
    }
    if (b.includes('RED/BLACK')) {
        return {
            background: 'linear-gradient(to right, #ef4444 35%, #111827 35%, #111827 65%, #ef4444 65%)',
            borderColor: '#dc2626'
        };
    }
    if (b.includes('POOM')) {
        return {
            background: 'linear-gradient(to right, #ef4444 50%, #111827 50%)',
            borderColor: '#dc2626'
        };
    }
    if (b.includes('DAN')) {
        return {
            backgroundColor: '#111827',
            borderColor: '#030712'
        };
    }
    if (b.includes('WHITE')) {
        return {
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db'
        };
    }
    if (b.includes('YELLOW')) {
        return {
            backgroundColor: '#facc15',
            borderColor: '#eab308'
        };
    }
    if (b.includes('GREEN')) {
        return {
            backgroundColor: '#10b981',
            borderColor: '#059669'
        };
    }
    if (b.includes('BLUE')) {
        return {
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
        };
    }
    if (b.includes('RED')) {
        return {
            backgroundColor: '#ef4444',
            borderColor: '#dc2626'
        };
    }
    return defaultStyle;
}

export function getBeltBadgeStyle(belt: string | null | undefined): string {
    if (!belt) return 'bg-gray-100 text-gray-700 border-gray-300';
    const b = belt.toUpperCase().trim();
    if (b.includes('WHITE/YELLOW')) {
        return 'bg-gradient-to-r from-slate-50 via-yellow-100 to-slate-50 text-yellow-850 border-yellow-250 shadow-sm';
    }
    if (b.includes('YELLOW/GREEN')) {
        return 'bg-gradient-to-r from-yellow-50 via-emerald-100 to-yellow-50 text-emerald-850 border-emerald-200';
    }
    if (b.includes('GREEN/BLUE')) {
        return 'bg-gradient-to-r from-emerald-50 via-blue-100 to-emerald-50 text-blue-805 border-blue-200';
    }
    if (b.includes('BLUE/RED')) {
        return 'bg-gradient-to-r from-blue-50 via-red-150 to-blue-50 text-red-850 border-red-200';
    }
    if (b.includes('RED/BLACK')) {
        return 'bg-gradient-to-r from-red-650 via-gray-900 to-red-650 border-red-750 text-white font-semibold';
    }
    if (b.includes('POOM')) {
        return 'bg-gradient-to-r from-red-600 to-gray-900 border-red-700 text-white font-semibold';
    }
    if (b.includes('DAN')) {
        return 'bg-gray-950 text-amber-400 border-gray-950 font-black shadow-inner';
    }
    if (b.includes('WHITE')) {
        return 'bg-white text-gray-700 border-gray-300 shadow-sm';
    }
    if (b.includes('YELLOW')) {
        return 'bg-yellow-50 text-yellow-850 border-yellow-200';
    }
    if (b.includes('GREEN')) {
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    if (b.includes('BLUE')) {
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
    if (b.includes('RED')) {
        return 'bg-red-50 text-red-700 border-red-100';
    }
    return 'bg-gray-100 text-gray-700 border-gray-300';
}

export function getBeltCardGradient(belt: string | null | undefined): { bg: string; text: string; subtext: string } {
    if (!belt) return { bg: 'from-indigo-600 via-indigo-700 to-blue-800 text-white', text: 'text-white', subtext: 'text-indigo-200' };
    const b = belt.toUpperCase().trim();
    if (b.includes('WHITE/YELLOW')) {
        return {
            bg: 'from-slate-50 via-slate-100 to-yellow-100 border border-slate-200 shadow-md',
            text: 'text-yellow-900',
            subtext: 'text-slate-500'
        };
    }
    if (b.includes('YELLOW/GREEN')) {
        return {
            bg: 'from-yellow-200 via-yellow-300 to-emerald-450 border border-yellow-300 shadow-md',
            text: 'text-emerald-950',
            subtext: 'text-emerald-800'
        };
    }
    if (b.includes('GREEN/BLUE')) {
        return {
            bg: 'from-emerald-500 via-emerald-600 to-blue-600 shadow-lg',
            text: 'text-white',
            subtext: 'text-emerald-100'
        };
    }
    if (b.includes('BLUE/RED')) {
        return {
            bg: 'from-blue-600 via-blue-700 to-red-500 shadow-lg',
            text: 'text-white',
            subtext: 'text-blue-100'
        };
    }
    if (b.includes('RED/BLACK') || b.includes('POOM')) {
        return {
            bg: 'from-red-650 via-red-750 to-gray-900 shadow-lg border border-red-750',
            text: 'text-white',
            subtext: 'text-red-200'
        };
    }
    if (b.includes('DAN')) {
        return {
            bg: 'from-gray-900 via-gray-950 to-black shadow-2xl border border-gray-800',
            text: 'text-yellow-400 font-extrabold',
            subtext: 'text-gray-400'
        };
    }
    if (b.includes('WHITE')) {
        return {
            bg: 'from-white via-slate-50 to-slate-200 border border-slate-200 shadow-md',
            text: 'text-gray-800',
            subtext: 'text-gray-500'
        };
    }
    if (b.includes('YELLOW')) {
        return {
            bg: 'from-yellow-350 via-yellow-400 to-amber-500 shadow-md border border-yellow-300',
            text: 'text-amber-950',
            subtext: 'text-amber-800'
        };
    }
    if (b.includes('GREEN')) {
        return {
            bg: 'from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg',
            text: 'text-white',
            subtext: 'text-emerald-100'
        };
    }
    if (b.includes('BLUE')) {
        return {
            bg: 'from-blue-500 via-blue-650 to-blue-800 shadow-lg',
            text: 'text-white',
            subtext: 'text-blue-200'
        };
    }
    if (b.includes('RED')) {
        return {
            bg: 'from-red-500 via-red-600 to-red-850 shadow-lg border border-red-600',
            text: 'text-white',
            subtext: 'text-red-100'
        };
    }
    return {
        bg: 'from-indigo-600 via-indigo-700 to-blue-800 shadow-lg',
        text: 'text-white',
        subtext: 'text-indigo-200'
    };
}

export function getNextBelt(belt: string | null | undefined): string {
    if (!belt) return '9. WHITE/YELLOW';
    const b = belt.toUpperCase().trim();
    const idx = BELT_OPTIONS.findIndex(opt => opt.value === b);
    if (idx !== -1 && idx + 1 < BELT_OPTIONS.length) {
        return BELT_OPTIONS[idx + 1].label;
    }
    // Partial fallback
    const idxPartial = BELT_OPTIONS.findIndex(opt => b.includes(opt.value) || opt.value.includes(b));
    if (idxPartial !== -1 && idxPartial + 1 < BELT_OPTIONS.length) {
        return BELT_OPTIONS[idxPartial + 1].label;
    }
    return 'Highest Rank reached';
}
