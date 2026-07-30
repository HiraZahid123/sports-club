/**
 * Calculates the date (YYYY-MM-DD) for a given day of the week in the current week.
 * Assumes the week runs from Monday to Sunday.
 */
export function getDateForDayOfWeek(dayName: string): string {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const targetDayIndex = daysOfWeek.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
    if (targetDayIndex === -1) return new Date().toISOString().split('T')[0];

    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const diff = targetDayIndex - currentDayIndex;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate.toISOString().split('T')[0];
}

/**
 * Formats a date string (YYYY-MM-DD or ISO string) to DD/MM/YYYY.
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    try {
        const dateOnly = dateStr.split('T')[0];
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
            // YYYY-MM-DD format -> DD/MM/YYYY
            return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
        }
        // Fallback for other formats
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
}
