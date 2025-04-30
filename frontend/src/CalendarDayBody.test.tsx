
import { MockedProvider } from "@apollo/react-testing";
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { ActivityStatus, GoalFrequencyType } from './__generated__/graphql.ts';

import CalendarDayBody from "./CalendarDayBody";
import { GoalStatus } from './_TestSupport.tsx';

it('renders daily goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    vi.setSystemTime(mockDate);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]])

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBody
                date={mockDate}
                loading={false}
                error={undefined}
                userStatus={[mockGoalStatus]}>
            </CalendarDayBody>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
});

it('renders weekly goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    vi.setSystemTime(mockDate);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Weekly, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]])

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBody
                date={mockDate}
                loading={false}
                error={undefined}
                userStatus={[mockGoalStatus]}>
            </CalendarDayBody>
        </MockedProvider>
    )

    await expect.element(getByText("Fake WEEKLY Goal")).toBeInTheDocument();
});

it('renders yearly goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    vi.setSystemTime(mockDate);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Yearly, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]]);

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBody
                date={mockDate}
                loading={false}
                error={undefined}
                userStatus={[mockGoalStatus]}>
            </CalendarDayBody>
        </MockedProvider>
    )

    await expect.element(getByText("Fake YEARLY Goal")).toBeInTheDocument();
});
