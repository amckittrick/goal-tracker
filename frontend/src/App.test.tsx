import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';

import App from './App';
import { gqlGetUsers } from './GQLQueries.tsx';

const apolloMocks: MockedResponse[] = [
  {
    request: {
      operationName: "GetUsers",
      query: gqlGetUsers
    },
    result: {
      data: {
        users: []
      }
    }
  }
];

describe('App', () => {
  test('App mounts properly', () => {
    const wrapper = render(
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <App></App>
      </MockedProvider>
    );
    expect(wrapper).toBeTruthy();
  })
});