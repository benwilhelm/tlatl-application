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

test.todo('sets error and fetching=false when request fails');

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
