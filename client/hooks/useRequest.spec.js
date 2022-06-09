import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequest } from './useRequest.js';
import { createClient } from '../services/api.js';
import { payload, delay, server } from './test-server.js';

const axiosClient = createClient({ baseURL: 'https://example.com' });

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('makes GET request: 200', async () => {
  const expected = { status: 200, payload };

  const hook = requestFactory(axiosClient);
  const { makeRequest } = hook.current;
  expect(hook.current.loading).toBe(false);
  act(() => {
    makeRequest();
  });

  // loading state
  await waitFor(async () => {
    expect(hook.current.loading).toEqual(true);
    expect(hook.current.response).toEqual(null);
    expect(hook.current.error).toEqual(null);
  });

  // resolved state
  await waitFor(async () => {
    expect(hook.current.loading).toEqual(false);
    expect(hook.current.response).toEqual(expected);
    expect(hook.current.error).toEqual(null);
  });
});

test('sets request status: 404', async () => {
  const expected = {
    status: 404,
    payload: { message: 'not found' },
  };
  const hook = requestFactory(axiosClient, { url: '404' });
  const { makeRequest } = hook.current;

  act(() => {
    makeRequest();
  });

  await waitFor(() => {
    expect(hook.current.loading).toEqual(true);
    expect(hook.current.response).toEqual(null);
    expect(hook.current.error).toEqual(null);
  });

  await waitFor(() => {
    expect(hook.current.loading).toEqual(false);
    expect(hook.current.response).toEqual({
      status: 404,
      payload: { message: 'not found' },
    });
    expect(hook.current.error).toEqual(null);
  });
});

test('sets error', async () => {
  const expected = { error: 'oh no' };
  const spy = jest.spyOn(axiosClient, 'request');
  spy.mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(expected);
      }, 10);
    });
  });

  const hook = requestFactory(axiosClient);
  const { makeRequest } = hook.current;
  expect(hook.current.loading).toBe(false);

  act(() => {
    makeRequest();
  });

  await waitFor(async () => {
    expect(hook.current.loading).toEqual(true);
    expect(hook.current.response).toEqual(null);
    expect(hook.current.error).toEqual(null);
  });

  await waitFor(async () => {
    expect(hook.current.loading).toEqual(false);
    expect(hook.current.response).toEqual(null);
    expect(hook.current.error).toEqual(expected);
  });
});

test('cancels request', async () => {
  const hook = requestFactory(axiosClient);
  const { makeRequest, cancel } = hook.current;
  expect(hook.current.loading).toBe(false);
  act(() => {
    makeRequest();
  });

  await waitFor(async () => {
    expect(hook.current.loading).toEqual(true);
  });

  act(() => {
    cancel();
  });

  waitFor(() => {
    expect(hook.current.loading).toEqual(false);
    expect(hook.current.response).toEqual(null);
    expect(hook.current.error).toEqual({ message: 'canceled' });
  });
});

test.only('cancels one request to send another', async () => {
  const hook = requestFactory(axiosClient);
  const { makeRequest, cancel } = hook.current;
  jest.useFakeTimers();

  expect(hook.current.loading).toEqual(false);
  expect(hook.current.response).toEqual(null);
  expect(hook.current.error).toEqual(null);

  console.log('making request: world');
  await act(async () => {
    makeRequest({ params: { delay: 100 } });
    jest.advanceTimersByTime(10);
  });

  waitFor(() => {
    expect(hook.current.loading).toEqual(true);
  });
  expect(hook.current.response).toEqual(null);
  expect(hook.current.error).toEqual(null);

  await act(() => {
    makeRequest({ params: { delay: 10, hello: 'wombat' } });
    jest.runOnlyPendingTimers();
  });

  // await waitFor(() => {
  //   expect(hook.current.loading).toEqual(true);
  // });
  // expect(hook.current.response).toEqual(null);
  // expect(hook.current.error).toEqual(null);

  // await act(() => jest.runAllTimers());

  await waitFor(() => {
    expect(hook.current.loading).toEqual(false);
    expect(hook.current.error).toEqual(null);
    expect(hook.current.response).toEqual({
      status: 200,
      payload: {
        hello: 'world',
      },
    });
  });

  // await act(() => jest.advanceTimersByTime(200));

  // await waitFor(() => expect(hook.current.loading).toEqual(false));
  // expect(hook.current.error).toEqual(null);
  // expect(hook.current.response).toEqual({
  //   status: 200,
  //   payload: {
  //     hello: 'wombat',
  //   },
  // });

  // await act(async () => {
  //   console.log('making request: wombat');
  //   makeRequest({ params: { hello: 'wombat', delay: 10 } });
  //   // jest.runAllTimers();
  //   jest.advanceTimersByTime(100);
  // });

  // console.log(JSON.stringify(hook));
  // expect(hook.current.loading).toEqual(false);
  // expect(hook.current.response).toEqual(null);
  // expect(hook.current.error.message).toMatch(/canceled/i);

  // jest.advanceTimersByTime(5);
  // expect(hook.current.loading).toEqual(true);
  // expect(hook.current.error).toEqual(null);
  // expect(hook.current.response).toEqual(null);

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
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

async function expectNever(callable) {
  await expect(() => waitFor(callable)).rejects.toEqual(expect.anything());
}
