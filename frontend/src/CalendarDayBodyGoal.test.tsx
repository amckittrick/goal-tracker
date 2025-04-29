import { MockedProvider } from "@apollo/react-testing";
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ActivityStatus, GoalFrequencyType } from "./__generated__/graphql";

import CalendarDayBodyGoal from "./CalendarDayBodyGoal";

import { GoalStatus } from "./_TestSupport";

it('renders unachieved goals in the past', async () => {
    const mockDate = new Date(2025, 3, 22);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.UnachievedPast]]);

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBodyGoal goalStatus={mockGoalStatus} date={mockDate} currentUserEmail="fake.user@fake.com"></CalendarDayBodyGoal>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
    await expect.element(screen.getByTestId("CalendarDayBodyGoalDot0")).toHaveClass("bg-danger");
});

it('renders unachieved goals for today or in the future', async () => {
    const mockDate = new Date(2025, 3, 22);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.UnachievedTodayOrFuture]]);

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBodyGoal goalStatus={mockGoalStatus} date={mockDate} currentUserEmail="fake.user@fake.com"></CalendarDayBodyGoal>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
    await expect.element(screen.getByTestId("CalendarDayBodyGoalDot0")).toHaveClass("bg-secondary");
});

it('renders achieved goals', async () => {
    const mockDate = new Date(2025, 3, 22);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.Achieved]]);

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBodyGoal goalStatus={mockGoalStatus} date={mockDate} currentUserEmail="fake.user@fake.com"></CalendarDayBodyGoal>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
    await expect.element(screen.getByTestId("CalendarDayBodyGoalDot0")).toHaveClass("bg-success");
});

it('renders partially achieved goals', async () => {
    const mockDate = new Date(2025, 3, 22);

    const mockGoalStatus = new GoalStatus(GoalFrequencyType.Daily, [mockDate], [[ActivityStatus.Achieved, ActivityStatus.UnachievedPast]]);

    const { getByText } = render(
        <MockedProvider mocks={[]}>
            <CalendarDayBodyGoal goalStatus={mockGoalStatus} date={mockDate} currentUserEmail="fake.user@fake.com"></CalendarDayBodyGoal>
        </MockedProvider>
    )

    await expect.element(getByText("Fake DAILY Goal")).toBeInTheDocument();
    await expect.element(screen.getByTestId("CalendarDayBodyGoalDot0")).toHaveClass("bg-success");
    await expect.element(screen.getByTestId("CalendarDayBodyGoalDot1")).toHaveClass("bg-danger");
});
