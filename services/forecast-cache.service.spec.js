import {
  ForecastCacheService,
  apiResponseToDbModel,
} from './forecast-cache.service';
import { db } from '../db/db';
import {
  current,
  stale,
  notQuiteStale,
} from '../db/fixtures/forecast-hourly.fixtures';
import { responseOneDayHourly } from './fixtures/forecast-api.fixtures';
import { mockZip, mockTimeNow } from '../test-helpers/fixtures';
import { ForecastHourly } from '../db/forecast-hourly';

const mockConvertedDbRow = {
  zip: mockZip,
  timestamp: 1644472800,
  windSpeed: 12.8,
  windDirection: 'W',
  windDegree: 277,
  temperature: 32.4,
  skies: 'API Response',
};

const fakeDbClient = {
  getByZipAndTimestamp() {},
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
  jest.spyOn(fakeApiClient, 'getByZipAndTimestamp');
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient: fakeApiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(expect.objectContaining(current));
  expect(fakeApiClient.getByZipAndTimestamp).not.toHaveBeenCalled();
});

test('getByZipAndTimestamp() returns fresh data from API if no cached data present', async () => {
  jest
    .spyOn(fakeApiClient, 'getByZipAndTimestamp')
    .mockImplementation(() => responseOneDayHourly);
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient: fakeApiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(mockConvertedDbRow);
});

test('getByZipAndTimestamp returns from API if stale data present', async () => {
  ForecastHourly.bulkCreate([stale]);
  jest
    .spyOn(fakeApiClient, 'getByZipAndTimestamp')
    .mockImplementation(() => responseOneDayHourly);
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient: fakeApiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(mockConvertedDbRow);
});

test('getByZipAndTimestamp returns from DB if at boundary of maxAge', async () => {
  ForecastHourly.bulkCreate([notQuiteStale]);
  jest
    .spyOn(fakeApiClient, 'getByZipAndTimestamp')
    .mockImplementation(() => responseOneDayHourly);
  const cache = new ForecastCacheService({
    dbClient: ForecastHourly,
    apiClient: fakeApiClient,
  });

  const result = await cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(expect.objectContaining(notQuiteStale));
});

test('apiResponseToDbModel convert api response to DB Model', () => {
  const apiResponse = responseOneDayHourly;
  const zip = mockZip;

  const result = apiResponseToDbModel(apiResponse, zip);

  expect(result).toEqual(mockConvertedDbRow);
});
