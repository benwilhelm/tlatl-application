import { db } from './db';
import { ForecastHourly } from './forecast-hourly';
import {
  current,
  lessCurrent,
  wrongZip,
  wrongTimestamp,
  stale,
} from './fixtures/forecast-hourly.fixtures';
import { mockTimeNow, mockZip } from '../test-helpers/fixtures.js';

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

test('getByZipAndTimestamp returns most recently updated record matching zip and timestamp', async () => {
  ForecastHourly.bulkCreate([lessCurrent, current]);

  const result = await ForecastHourly.getByZipAndTimestamp(
    mockZip,
    mockTimeNow
  );

  expect(result).toEqual(expect.objectContaining(current));
});

test('getByZipAndTimestamp queries by zip and timestamp', async () => {
  ForecastHourly.bulkCreate([wrongZip, wrongTimestamp, lessCurrent]);

  const result = await ForecastHourly.getByZipAndTimestamp(
    mockZip,
    mockTimeNow
  );

  expect(result).toEqual(expect.objectContaining(lessCurrent));
});

test('getByZipAndTimestamp wont return stale record if maxAge passed', async () => {
  // using bulkcreate so it doesn't overwrite createdAt/updatedAt
  await ForecastHourly.bulkCreate([stale]);
  const maxAge = 3 * 3600; // 3 hours

  // threshold: stale is outside of max age
  const result = await ForecastHourly.getByZipAndTimestamp(
    mockZip,
    mockTimeNow,
    maxAge
  );

  expect(result).toBeNull();

  // threshold: stale is inside of max age
  const result2 = await ForecastHourly.getByZipAndTimestamp(
    mockZip,
    mockTimeNow,
    maxAge + 1
  );

  expect(result2).toEqual(expect.objectContaining(stale));
});
