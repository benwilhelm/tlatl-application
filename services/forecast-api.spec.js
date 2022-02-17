/**
 * Lecture notes:
 * Get inputs and outputs for the API (URL, response)
 * Show the various levels of mocking we can do
 *   - Mock the method
 *   - mock the client (mockAxios)
 *   - mock the server (msw)
 *
 *   - Then show how mocking the server exposes our need to pass
 *     the api key somehow -> dependency injection
 */

import ForecastApiClient, { getService } from './forecast-api.js';
import { mockTimeNow, mockApiKey } from './test-helpers/forecast-api.fixtures';

test('should fetch by zip and timestamp', async () => {
  const client = new ForecastApiClient({ apiKey: mockApiKey });

  const res = await client.getByZipAndTimestamp('00200', mockTimeNow);
  expect(res.location.name).toEqual('Chicago');
  expect(res.forecast.forecastday[0].hour).toHaveLength(24);
});

test('should throw if api returns 4xx', async () => {
  const client = new ForecastApiClient({ apiKey: 'bad-api-key' });
  const subject = () => client.getByZipAndTimestamp('00200', mockTimeNow);

  await expect(subject).rejects.toThrow(/401/gi);
});

test('getService should return same instance with repeated calls', () => {
  const instanceOne = getService();
  const instanceTwo = getService();

  expect(instanceOne).toBeInstanceOf(ForecastApiClient);
  expect(instanceOne).toBe(instanceTwo);
});

// OYO
// implement retry logic based on response code
test.todo('should retry if api returns 5xx');
