import ForecastCacheClient, {
  apiResponseToDbResult,
} from './forecast-cache.js';

jest.mock('../db/forecast-hourly.js');
import { ForecastHourly } from '../db/index.js';

jest.mock('./forecast-api.js');
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

// const gotApiResponse = async () => ({

// })

describe('ForecastCacheClient', () => {
  test('should return cached data if within MAX_AGE', async () => {
    ForecastHourly.getByZipAndTimestamp.mockImplementation(gotCacheHit);
    const subject = new ForecastCacheClient();
    const zip = '55555';
    const ts = 1;

    const result = await subject.getByZipAndTimestamp(zip, ts);

    expect(result.skies).toEqual('CACHE_HIT');
  });
});

describe('apiResponseToDbResult', () => {
  it('should return array of hourly data for insertion into DB', () => {});
});
