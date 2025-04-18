import { describe, expect, test } from 'vitest';

import { GetMonday, DayInWeek } from './Util';

describe('DayInWeek', () => {
    test('it handles the same date', () => {
        const weekStartDate = GetMonday();
        const weekEndDate = new Date();
        weekEndDate.setDate(weekStartDate.getDate() + 7);
        const dayToCompare = new Date();
        dayToCompare.setDate(weekStartDate.getDate() + 2);
        expect(DayInWeek(weekStartDate, weekEndDate, dayToCompare.getUTCFullYear(), dayToCompare.getUTCMonth(), dayToCompare.getUTCDate())).toBeTruthy();
    })
})
