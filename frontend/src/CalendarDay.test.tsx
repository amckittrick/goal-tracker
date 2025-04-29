import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { page } from '@vitest/browser/context';

import CalendarDay from "./CalendarDay";
import { gqlGetUserStatus } from "./GQLQueries";

it('properly handles moving the date forwards and backwards', async () => {
    const mockDate = new Date(2025, 3, 22);
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
            <CalendarDay currentUserEmail={"fake.user@fake.com"}></CalendarDay>
        </MockedProvider>
    )

    await expect.element(getByText("Tue, April 22")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationIncrement").click();
    await expect.element(getByText("Wed, April 23")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationReset").click();
    await expect.element(getByText("Tue, April 22")).toBeInTheDocument();

    await page.getByTestId("CalendarNavigationDecrement").click();
    await expect.element(getByText("Mon, April 21")).toBeInTheDocument();
});
