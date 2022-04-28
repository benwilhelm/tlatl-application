import request from 'supertest';
import app from '../app';
import { db, ForecastHourly } from '../db/index.js';
import { mockZip, mockTimeNow } from '../test-helpers/fixtures.js';
import { suppressErrorOutput } from '../test-helpers/util.js';
import { current, stale } from '../db/fixtures/forecast-hourly.fixtures';
import {
  mockConvertedHour1,
  mockConvertedHour2,
} from '../services/fixtures/forecast-api.fixtures.js';

beforeAll(async () => {
  await db.sync({ force: true });
  jest.useFakeTimers();
  jest.setSystemTime(mockTimeNow * 1000);
});
afterAll(() => {
  jest.useRealTimers();
});

beforeEach(async () => {
  await ForecastHourly.destroy({ where: {}, truncate: true });
});

test('GET /forecast with warm cache returns DB row for zip and timestamp', async () => {
  const api = request(app);
  await ForecastHourly.bulkCreate([current]);
  const zip = mockZip;
  const ts = mockTimeNow;

  const response = await api.get(`/forecast?zip=${zip}&ts=${ts}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual(
    expect.objectContaining(stringifyDates(current))
  );
});

test('GET /forecast with cold cache returns API response for zip and timestamp', async () => {
  const api = request(app);
  await ForecastHourly.bulkCreate([stale]);
  const zip = mockZip;
  const ts1 = mockTimeNow;
  const ts2 = mockTimeNow + 3600;

  const response1 = await api.get(`/forecast?zip=${zip}&ts=${ts1}`);
  expect(response1.status).toEqual(200);
  expect(response1.body).toEqual(expect.objectContaining(mockConvertedHour1));

  const response2 = await api.get(`/forecast?zip=${zip}&ts=${ts2}`);
  expect(response2.status).toEqual(200);
  expect(response2.body).toEqual(expect.objectContaining(mockConvertedHour2));
});

test('GET /forecast returns 500 if it encounters an error', async () => {
  jest.spyOn(ForecastHourly, 'getByZipAndTimestamp').mockImplementation(() => {
    throw new Error('oh no!');
  });
  const api = request(app);

  const response = await suppressErrorOutput(() =>
    api.get(`/forecast?zip=${mockZip}&ts=1111111111`)
  );

  expect(response.status).toEqual(500);
});

function stringifyDates(obj) {
  return {
    ...obj,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString(),
  };
}
