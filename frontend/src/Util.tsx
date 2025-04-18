export function GetMonday() {
    const day = new Date();
    const dayOfWeek = day.getDay();
    const diff = day.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // Adjust when day is sunday
    day.setDate(diff);
    day.setHours(0, 0, 0, 0);
    return day;
};

export function DayInWeek(weekStartDate: Date, weekEndDate: Date, comparisonYear: number, comparisonMonth: number, comparisonDay: number) {
    const comparisonDate = new Date();
    comparisonDate.setUTCFullYear(comparisonYear);
    comparisonDate.setUTCMonth(comparisonMonth);
    comparisonDate.setUTCDate(comparisonDay);
    return weekStartDate <= comparisonDate && comparisonDate <= weekEndDate;
}
