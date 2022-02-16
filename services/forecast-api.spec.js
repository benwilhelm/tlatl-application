/**
 * Lecture notes:
 * Get inputs and outputs for the API (URL, response)
 * Show the various levels of mocking we can do
 *   - Mock the method
 *   - mock the client (mockAxios)
 *   - mock the server (msw)
 */

import ForecastApiClient from './forecast-api.js';
import { requestTimestamp } from './test-helpers/forecast-api.fixtures';

test('should fetch by zip and timestamp', async () => {
  const client = new ForecastApiClient({ apiKey: 'xxxxxx' });

  const res = await client.getByZipAndTimestamp('00200', requestTimestamp);
  expect(res.location.name).toEqual('Chicago');
  expect(res.forecast.forecastday[0].hour).toHaveLength(24);
});
