import { describe, expect, test } from 'vitest';

import { DayMonthYearEqual } from './DailyGoalProgress.tsx';

describe('DayMonthYearEqual', () => {
    test('it handles the same date', () => {
        const dayOne = new Date();
        const dayTwo = new Date();
        expect(DayMonthYearEqual(dayOne, dayTwo)).toBeTruthy();
    })

    test('it handles mismatched dates', () => {
        const dayOne = new Date();
        const dayTwo = new Date(dayOne.getDate() + 1);
        expect (DayMonthYearEqual(dayOne, dayTwo)).toBeFalsy();
    })
})
