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

export function getBeltBadgeStyle(belt: string | null | undefined): string {
    if (!belt) return 'bg-gray-100 text-gray-700 border-gray-300';
    const b = belt.toUpperCase().trim();
    if (b.includes('WHITE/YELLOW')) {
        return 'bg-gradient-to-r from-white via-white to-yellow-50 text-yellow-800 border-gray-300 shadow-sm';
    }
    if (b.includes('YELLOW/GREEN')) {
        return 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-emerald-50 text-emerald-800 border-yellow-200';
    }
    if (b.includes('GREEN/BLUE')) {
        return 'bg-gradient-to-r from-emerald-50 via-emerald-100 to-blue-50 text-blue-800 border-emerald-200';
    }
    if (b.includes('BLUE/RED')) {
        return 'bg-gradient-to-r from-blue-50 via-blue-100 to-red-50 text-red-850 border-blue-200';
    }
    if (b.includes('RED/BLACK')) {
        return 'bg-gradient-to-r from-red-600 to-gray-900 border-red-700 text-white font-semibold';
    }
    if (b.includes('POOM')) {
        return 'bg-gradient-to-r from-red-650 to-gray-900 border-red-700 text-white font-semibold';
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

export function getBeltBarClass(belt: string | null | undefined): string {
    if (!belt) return 'bg-gray-300 border-gray-300';
    const b = belt.toUpperCase().trim();
    if (b.includes('WHITE/YELLOW')) {
        return 'bg-gradient-to-r from-white via-white to-yellow-300 border-gray-300';
    }
    if (b.includes('YELLOW/GREEN')) {
        return 'bg-gradient-to-r from-yellow-300 via-yellow-200 to-emerald-450 border-yellow-300';
    }
    if (b.includes('GREEN/BLUE')) {
        return 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-500 border-emerald-400';
    }
    if (b.includes('BLUE/RED')) {
        return 'bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 border-blue-500';
    }
    if (b.includes('RED/BLACK')) {
        return 'bg-gradient-to-r from-red-500 to-gray-950 border-red-650';
    }
    if (b.includes('POOM')) {
        return 'bg-gradient-to-r from-red-500 to-gray-950 border-red-650';
    }
    if (b.includes('DAN')) {
        return 'bg-gray-950 border-gray-950 shadow-inner';
    }
    if (b.includes('WHITE')) {
        return 'bg-white border-gray-300';
    }
    if (b.includes('YELLOW')) {
        return 'bg-yellow-300 border-yellow-350';
    }
    if (b.includes('GREEN')) {
        return 'bg-emerald-400 border-emerald-450';
    }
    if (b.includes('BLUE')) {
        return 'bg-blue-500 border-blue-550';
    }
    if (b.includes('RED')) {
        return 'bg-red-500 border-red-550';
    }
    return 'bg-gray-300 border-gray-300';
}
