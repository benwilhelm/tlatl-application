import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequest } from './useRequest.js';
import { createClient } from '../services/api.js';
import { server } from './test-server.js';

const axiosClient = createClient({ baseURL: 'https://example.com' });

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('sets fetching while request is in flight, then resolves', async () => {
  // arrange
  const expected = { status: 200, data: { hello: 'world' } };
  const hook = requestFactory(axiosClient);
  const { makeRequest } = hook.current;

  // act
  expect(hook.current.fetching).toEqual(false);
  expect(hook.current.response).toEqual(null);
  expect(hook.current.error).toEqual(null);

  act(() => {
    makeRequest();
  });

  // fetching state
  expectIsFetching(hook);

  // resolved state
  await waitFor(async () => {
    expectResolvedWith(hook, expected);
  });
});

test('sets error and fetching=false for generic error', async () => {
  const expectedError = { error: 'oh no' };
  const spy = jest.spyOn(axiosClient, 'request');
  spy.mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(expectedError), 10);
    });
  });

  const hook = requestFactory(axiosClient);
  const { makeRequest } = hook.current;

  expect(hook.current.fetching).toEqual(false);

  // act
  act(() => {
    makeRequest();
  });
  expectIsFetching(hook);

  await waitFor(() => {
    expectErroredWith(hook, expectedError);
  });
});

test('sets error with status and fetching=false when request returns non-200', async () => {
  const expectedError = { status: 404, data: { message: 'not found' } };
  const hook = requestFactory(axiosClient, { url: '/404' });
  const { makeRequest } = hook.current;

  act(() => {
    makeRequest();
  });
  expectIsFetching(hook);

  await waitFor(() => {
    expectErroredWith(hook, expectedError);
  });
});

function requestFactory(axiosClient, reqOverrides = {}) {
  const reqDefaults = {
    method: 'get',
    url: '/200',
  };

  const req = { ...reqDefaults, ...reqOverrides };
  const { result } = renderHook(() => useRequest(axiosClient, req));
  return result;
}

function expectIsFetching(hook) {
  expect(hook.current.fetching).toEqual(true);
  expect(hook.current.response).toEqual(null);
  expect(hook.current.error).toEqual(null);
}

function expectResolvedWith(hook, expected) {
  expect(hook.current.fetching).toEqual(false);
  expect(hook.current.response).toEqual(expected);
  expect(hook.current.error).toEqual(null);
}

function expectErroredWith(hook, error) {
  expect(hook.current.fetching).toEqual(false);
  expect(hook.current.response).toEqual(null);
  expect(hook.current.error).toEqual(error);
}
