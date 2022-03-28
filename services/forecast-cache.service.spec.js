import {
  ForecastCacheService,
  apiResponseToHoursArray,
} from './forecast-cache.service';
import { db } from '../db/db';
import {
  current,
  stale,
  notQuiteStale,
} from '../db/fixtures/forecast-hourly.fixtures';
import {
  responseOneDayHourly,
  responseThreeDayHourly,
  mockApiKey,
} from './fixtures/forecast-api.fixtures';
import { mockZip, mockTimeNow } from '../test-helpers/fixtures';
import { ForecastHourly } from '../db/forecast-hourly';
import ForecastApiClient from './forecast-api';

const mockConvertedHour1 = {
  zip: mockZip,
  timestamp: 1648270800,
  windSpeed: 19.2,
  windDirection: 'WNW',
  windDegree: 298,
  temperature: 34.9,
  skies: 'API Response Hour 1',
};

const mockConvertedHour2 = {
  zip: mockZip,
  timestamp: 1648274400,
  windSpeed: 19.0,
  windDirection: 'WNW',
  windDegree: 303,
  temperature: 34.7,
  skies: 'API Response Hour 2',
};

const fakeApiClient = {
  getByZipAndTimestamp() {},
};

const syncDb = () => db.sync({ force: true });
const truncateTable = async () => {
  await ForecastHourly.destroy({ where: {}, truncate: true });
};

beforeAll(async () => {
  await syncDb();
  jest.useFakeTimers();
  jest.setSystemTime(new Date(mockTimeNow * 1000));
});
afterAll(() => {
  jest.useRealTimers();
});
beforeEach(truncateTable);

test('getByZipAndTimestamp() returns cached data if present', async () => {
  ForecastHourly.bulkCreate([current]);
  const apiClient = new ForecastApiClient({ apiKey: mockApiKey });
  jest.spyOn(apiClient, 'getForecastByZip');
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(expect.objectContaining(current));
  expect(apiClient.getForecastByZip).not.toHaveBeenCalled();
});

test('getByZipAndTimestamp() refreshes DB from API and returns request hour', async () => {
  const nowPlus1Hour = mockTimeNow + 3600;
  const apiClient = new ForecastApiClient({ apiKey: mockApiKey });
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, nowPlus1Hour);

  const allHours = await ForecastHourly.findAll();
  expect(allHours).toHaveLength(72);

  expect(result).toEqual(expect.objectContaining(mockConvertedHour2));
});

test('getByZipAndTimestamp returns from API if stale data present', async () => {
  ForecastHourly.bulkCreate([stale]);
  const apiClient = new ForecastApiClient({ apiKey: mockApiKey });

  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(expect.objectContaining(mockConvertedHour1));
});

test('getByZipAndTimestamp returns from DB if at boundary of maxAge', async () => {
  ForecastHourly.bulkCreate([notQuiteStale]);
  const apiClient = new ForecastApiClient({ apiKey: mockApiKey });

  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(expect.objectContaining(notQuiteStale));
});

test('apiResponseToHoursArray convert api response to DB Model', () => {
  const apiResponse = responseThreeDayHourly;
  const zip = mockZip;

  const result = apiResponseToHoursArray(apiResponse, zip);

  expect(result[0]).toEqual(mockConvertedHour1);
  expect(result[1]).toEqual(mockConvertedHour2);
  expect(result.length).toEqual(72);
});
