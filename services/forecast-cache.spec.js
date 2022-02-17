import ForecastCacheClient, {
  apiResponseToDbRows,
  getService,
} from './forecast-cache.js';

import {
  mockTimeNow,
  responseOneDayHourly,
  mockApiKey,
} from './test-helpers/forecast-api.fixtures.js';

jest.mock('../db/forecast-hourly.js');
import { ForecastHourly } from '../db/index.js';

import ForecastApiClient from './forecast-api.js';

const gotCacheHit = async (zip, ts, maxAge) => ({
  zip,
  time: Math.floor(Date.now() / 1000),
  windSpeed: 10,
  windDirection: 'SW',
  temperature: 65,
  skies: 'CACHE_HIT',
});

const gotCacheMiss = async () => null;

const gotApiResponse = async () => ({});

describe('ForecastCacheClient', () => {
  test('should return cached data if within MAX_AGE', async () => {
    ForecastHourly.getByZipAndTimestamp.mockImplementation(gotCacheHit);
    const subject = new ForecastCacheClient({
      ForecastModel: ForecastHourly,
      apiClient: new ForecastApiClient({ apiKey: mockApiKey }),
    });
    const zip = '55555';
    const ts = mockTimeNow;

    const result = await subject.getByZipAndTimestamp(zip, ts);

    expect(result.skies).toEqual('CACHE_HIT');
  });

  test('should fetch new data if cache is stale', async () => {
    ForecastHourly.getByZipAndTimestamp.mockImplementation(gotCacheMiss);
    const subject = new ForecastCacheClient({
      ForecastModel: ForecastHourly,
      apiClient: new ForecastApiClient({ apiKey: mockApiKey }),
    });
    const zip = '55555';
    const ts = mockTimeNow;

    const result = await subject.getByZipAndTimestamp(zip, ts);

    expect(result.skies).toEqual('API_RESPONSE');
  });
});

// change mind about who owns this method (move it to api client)
// show how tests give confidence in the move
describe('apiResponseToDbRows', () => {
  it('should return array of hourly data for insertion into DB', () => {
    const result = apiResponseToDbRows('60660', responseOneDayHourly);
    expect(result).toHaveLength(24);
    expect(result[0]).toEqual({
      zip: '60660',
      timestamp: 1644472800,
      windSpeed: 12.8,
      windDirection: 'W',
      temperature: 32.4,
      skies: 'API_RESPONSE',
    });
  });
});

test('getService should return same instance with repeated calls', () => {
  const instanceOne = getService();
  const instanceTwo = getService();

  expect(instanceOne).toBeInstanceOf(ForecastCacheClient);
  expect(instanceOne).toBe(instanceTwo);
});
