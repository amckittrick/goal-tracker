import { MockedProvider } from "@apollo/react-testing";
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ActivityStatus, GoalFrequencyType } from "./__generated__/graphql";

import CalendarThreeDayBodyGoal from "./CalendarThreeDayBodyGoal";

import { GoalStatus } from "./_TestSupport";

it('renders goals', async () => {
    const mockDate = new Date(2025, 3, 22);
    const mockPreviousDate = new Date(mockDate);
    mockPreviousDate.setUTCDate(mockPreviousDate.getUTCDate() - 1);
    const mockPreviousPreviousDate = new Date(mockDate);
    mockPreviousPreviousDate.setUTCDate(mockPreviousPreviousDate.getUTCDate() - 2);

    const mockGoalStatus = new GoalStatus(
        GoalFrequencyType.Daily,
        [mockPreviousPreviousDate, mockPreviousDate, mockDate],
        [
            [ActivityStatus.Achieved, ActivityStatus.UnachievedPast],
            [ActivityStatus.UnachievedPast, ActivityStatus.UnachievedPast],
            [ActivityStatus.UnachievedTodayOrFuture, ActivityStatus.UnachievedTodayOrFuture]
        ]
    );

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarThreeDayBodyGoal goalStatus={mockGoalStatus} currentUserEmail="fake.user@fake.com"></CalendarThreeDayBodyGoal>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/22-0")).toHaveClass("bg-secondary");
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/22-1")).toHaveClass("bg-secondary");
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/21-0")).toHaveClass("bg-danger");
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/21-1")).toHaveClass("bg-danger");
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/20-0")).toHaveClass("bg-success");
    await expect.element(screen.getByTestId("CalendarThreeDayBodyGoalDot-2025/3/20-1")).toHaveClass("bg-danger");
});
