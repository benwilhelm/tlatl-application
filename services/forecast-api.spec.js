import ForecastApiClient from './forecast-api.js';
import { mockZip } from '../test-helpers/fixtures';
import {
  responseTenDayHourly,
  mockApiKey,
} from './fixtures/forecast-api.fixtures';

test('should fetch ten-day forecast by zip', async () => {
  const client = new ForecastApiClient({ apiKey: mockApiKey });

  const response = await client.getForecastByZip(mockZip);

  expect(response).toEqual(responseTenDayHourly);
});

test('should throws 401 with bad API Key', async () => {
  const client = new ForecastApiClient({ apiKey: 'bad-api-key' });

  const subject = () => client.getForecastByZip(mockZip);

  expect(subject).rejects.toThrow(/401/g);
});
