import { db } from './db';
import { ForecastHourly } from './forecast-hourly';
import {
  current,
  lessCurrent,
  stale,
} from './fixtures/forecast-hourly.fixtures';

const syncDb = () => db.sync({ force: true });
const truncateTable = () =>
  ForecastHourly.destroy({ where: {}, truncate: true });

beforeAll(syncDb);
beforeEach(truncateTable);

test('getByZipAndTimestamp returns current if found', async () => {
  await ForecastHourly.bulkCreate([stale, current]);
  const { zip, timestamp } = current;

  const result = await ForecastHourly.getByZipAndTimestamp(zip, timestamp);

  expect(result).toEqual(expect.objectContaining(current));
});

test('getByZipAndTimestamp returns most current if two are valid', async () => {
  await ForecastHourly.bulkCreate([lessCurrent, current]);
  const { zip, timestamp } = current;

  const result = await ForecastHourly.getByZipAndTimestamp(zip, timestamp);

  expect(result).toEqual(expect.objectContaining(current));
});

test('getByZipAndTimestamp wont return stale record if maxAge passed', async () => {
  // hack - use bulkcreate because it allows setting createdAt
  await ForecastHourly.bulkCreate([stale]);
  const { zip, timestamp } = stale;
  const maxAge = 3 * 3600; // three hours

  const result = await ForecastHourly.getByZipAndTimestamp(
    zip,
    timestamp,
    maxAge
  );

  expect(result).toEqual(null);
});
