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

beforeAll(syncDb);
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

test.todo('getByZipAndTimestamp wont return stale record if maxAge passed');
