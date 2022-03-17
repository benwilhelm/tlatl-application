import {
  ForecastCacheService,
  apiResponseToDbModel,
} from './forecast-cache.service';
import { current, stale } from '../db/fixtures/forecast-hourly.fixtures';
import {
  responseOneDayHourly,
  mockZip,
  mockTimeNow,
} from './fixtures/forecast-api.fixtures';

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

test('getByZipAndTimestamp() returns cached data if present', () => {
  jest
    .spyOn(fakeDbClient, 'getByZipAndTimestamp')
    .mockImplementation(() => current);
  jest.spyOn(fakeApiClient, 'getByZipAndTimestamp');
  const cache = new ForecastCacheService({
    dbClient: fakeDbClient,
    apiClient: fakeApiClient,
  });

  const result = cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(current);
  expect(fakeApiClient.getByZipAndTimestamp).not.toHaveBeenCalled();
});

test('getByZipAndTimestamp() returns fresh data from API if no cached data present', () => {
  jest
    .spyOn(fakeDbClient, 'getByZipAndTimestamp')
    .mockImplementation(() => null);
  jest
    .spyOn(fakeApiClient, 'getByZipAndTimestamp')
    .mockImplementation(() => responseOneDayHourly);
  const cache = new ForecastCacheService({
    dbClient: fakeDbClient,
    apiClient: fakeApiClient,
  });

  const result = cache.getByZipAndTimestamp(mockZip, mockTimeNow);

  expect(result).toEqual(mockConvertedDbRow);
});

test('apiResponseToDbModel convert api response to DB Model', () => {
  const apiResponse = responseOneDayHourly;
  const zip = mockZip;

  const result = apiResponseToDbModel(apiResponse, zip);

  expect(result).toEqual(mockConvertedDbRow);
});
