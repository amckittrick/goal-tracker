export function GetMonday() {
    const day = new Date();
    const dayOfWeek = day.getDay();
    const diff = day.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // Adjust when day is sunday
    day.setDate(diff);
    day.setHours(0, 0, 0, 0);
    return day;
};

export function DayInWeek(weekStartDate: Date, weekEndDate: Date, comparisonDate: Date) {
    return weekStartDate <= comparisonDate && comparisonDate <= weekEndDate;
}
