import { MockedProvider } from "@apollo/react-testing";
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { ActivityStatus } from "./__generated__/graphql";

import CalendarMonthBodySingleDay from "./CalendarMonthBodySingleDay";

it('renders unachieved goals in the past', async () => {
    const fakeCurrentDate = new Date(2025, 0, 2);
    const fakeDateToTest = new Date(2025, 0, 1);
    vi.setSystemTime(fakeCurrentDate);

    const { getByTestId } = render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBodySingleDay
                activityStatus={[ActivityStatus.UnachievedPast]}
                goalName="Fake Daily Goal"
                date={fakeDateToTest}>
            </CalendarMonthBodySingleDay>
        </MockedProvider>
    )

    await expect.element(getByTestId("CalendarMonthBodySingleDayDot-2025/0/1-0")).toHaveClass("bg-danger");
});

it('renders unachieved goals for today or in the future', async () => {
    const fakeCurrentDate = new Date(2025, 0, 2);
    const fakeDateToTest = new Date(2025, 0, 1);
    vi.setSystemTime(fakeCurrentDate);

    const { getByTestId } = render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBodySingleDay
                activityStatus={[ActivityStatus.UnachievedTodayOrFuture]}
                goalName="Fake Daily Goal"
                date={fakeDateToTest}>
            </CalendarMonthBodySingleDay>
        </MockedProvider>
    )

    await expect.element(getByTestId("CalendarMonthBodySingleDayDot-2025/0/1-0")).toHaveClass("bg-secondary");
});

it('renders achieved goals', async () => {
    const fakeCurrentDate = new Date(2025, 0, 2);
    const fakeDateToTest = new Date(2025, 0, 1);
    vi.setSystemTime(fakeCurrentDate);

    const { getByTestId } = render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBodySingleDay
                activityStatus={[ActivityStatus.Achieved]}
                goalName="Fake Daily Goal"
                date={fakeDateToTest}>
            </CalendarMonthBodySingleDay>
        </MockedProvider>
    )

    await expect.element(getByTestId("CalendarMonthBodySingleDayDot-2025/0/1-0")).toHaveClass("bg-success");
});

it('renders partially achieved goals', async () => {
    const fakeCurrentDate = new Date(2025, 0, 2);
    const fakeDateToTest = new Date(2025, 0, 1);
    vi.setSystemTime(fakeCurrentDate);

    const { getByTestId } = render(
        <MockedProvider mocks={[]}>
            <CalendarMonthBodySingleDay
                activityStatus={[ActivityStatus.Achieved, ActivityStatus.UnachievedPast]}
                goalName="Fake Daily Goal"
                date={fakeDateToTest}>
            </CalendarMonthBodySingleDay>
        </MockedProvider>
    )

    await expect.element(getByTestId("CalendarMonthBodySingleDayDot-2025/0/1-0")).toHaveClass("bg-success");
    await expect.element(getByTestId("CalendarMonthBodySingleDayDot-2025/0/1-1")).toHaveClass("bg-danger");
});
