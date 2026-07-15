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
