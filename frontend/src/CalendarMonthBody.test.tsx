import { MockedProvider } from "@apollo/react-testing";
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { page } from '@vitest/browser/context';

import { ActivityStatus, GoalFrequencyType } from "./__generated__/graphql";

import CalendarMonthBody from './CalendarMonthBody';

import { GoalStatus } from "./_TestSupport";

it('renders daily goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    vi.setSystemTime(mockDate);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]])

    render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBody
                goalName='Fake DAILY Goal'
                loading={false}
                error={undefined}
                userStatus={[mockGoalStatus]}>
            </CalendarMonthBody>
        </MockedProvider>
    )

    await expect.element(page.getByTestId("CalendarMonthBodySingleDayDot-2025/3/22-0")).toBeInTheDocument();
    await expect.element(page.getByTestId(/CalendarMonthBodySingleWeek/)).not.toBeInTheDocument();
});

it('renders weekly goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    vi.setSystemTime(mockDate);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Weekly, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]])

    render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBody
                goalName='Fake WEEKLY Goal'
                loading={false}
                error={undefined}
                userStatus={[mockGoalStatus]}>
            </CalendarMonthBody>
        </MockedProvider>
    )

    await expect.element(page.getByTestId(/CalendarMonthBodySingleDay/)).not.toBeInTheDocument();
    await expect.element(page.getByTestId("CalendarMonthBodySingleWeekDot-2025/3/22-0")).toBeInTheDocument();
});
