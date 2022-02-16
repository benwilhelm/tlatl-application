import ForecastCacheClient, { apiResponseToDbRows } from './forecast-cache.js';

import {
  requestTimestamp,
  responseOneDayHourly,
} from './test-helpers/forecast-api.fixtures.js';

jest.mock('../db/forecast-hourly.js');
import { ForecastHourly } from '../db/index.js';

// jest.mock('./forecast-api.js');
// import ForecastApiClient from './forecast-api.js';

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
    const subject = new ForecastCacheClient();
    const zip = '55555';
    const ts = requestTimestamp;

    const result = await subject.getByZipAndTimestamp(zip, ts);

    expect(result.skies).toEqual('CACHE_HIT');
  });

  test('should fetch new data if cache is stale', async () => {
    ForecastHourly.getByZipAndTimestamp.mockImplementation(gotCacheMiss);
    const subject = new ForecastCacheClient();
    const zip = '55555';
    const ts = requestTimestamp;

    const result = await subject.getByZipAndTimestamp(zip, ts);

    expect(result.skies).toEqual('API_RESPONSE');
  });
});

describe('apiResponseToDbRows', () => {
  it('should return array of hourly data for insertion into DB', () => {
    const result = apiResponseToDbRows('60660', responseOneDayHourly);
    expect(result).toHaveLength(24);
    expect(result[0]).toEqual({
      zip: '60660',
      time: 1644472800,
      windSpeed: 12.8,
      windDirection: 'W',
      temperature: 32.4,
      skies: 'API_RESPONSE',
    });
  });
});
