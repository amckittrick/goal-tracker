import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { page } from '@vitest/browser/context';

import CalendarMonth from './CalendarMonth';
import { gqlGetUserStatus } from "./GQLQueries";

it('properly handles moving the date forwards and backwards', async () => {
    const mockDate = new Date(2025, 0, 1);
    vi.setSystemTime(mockDate);

    const mock: MockedResponse = {
        request: {
            query: gqlGetUserStatus,
        },
        variableMatcher: () => true,
        result: {
            data: {
                userStatus: []
            }
        }
    }

    const { getByText } = render(
        <MockedProvider mocks={[mock, mock, mock, mock]}>
            <CalendarMonth currentUserEmail={"fake.user@fake.com"}></CalendarMonth>
        </MockedProvider>
    )

    await expect.element(getByText("January 2025")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationDecrement").click();
    await expect.element(getByText("December 2024")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationIncrement").click();
    await expect.element(getByText("January 2025")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationIncrement").click();
    await expect.element(getByText("February 2025")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationReset").click();
    await expect.element(getByText("January 2025")).toBeInTheDocument();
});
