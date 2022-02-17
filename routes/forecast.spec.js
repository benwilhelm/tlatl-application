import request from 'supertest';
import app from '../app.js';
import {
  mockTimeNow,
  paramFactory,
  stale,
} from '../db/test-helpers/forecast-hourly.fixtures.js';
import ForecastApiClient from '../services/forecast-api';
import { db, ForecastHourly } from '../db/index';

beforeEach(() => db.sync({ force: true }));

test('GET /forecast returns cached record on cache hit, does not call weather api', async () => {
  const spy = jest.spyOn(ForecastApiClient.prototype, 'getByZipAndTimestamp');
  const params = paramFactory();
  await ForecastHourly.create(params);
  const ts = mockTimeNow;
  const zip = params.zip;

  const res = await request(app).get(`/forecast/?zip=${zip}&ts=${ts}`);
  expect(res.status).toEqual(200);
  expect(res.body).toEqual(expect.objectContaining(params));
  expect(spy).not.toHaveBeenCalled();
});

//  NOTE test pollution because I ran db sync in beforeAll
test.only('GET /forecast returns from external API on cache miss', async () => {
  const spy = jest.spyOn(ForecastApiClient.prototype, 'getByZipAndTimestamp');
  const zip = '00200';
  const ts = mockTimeNow;
  const params = stale({ zip });
  await ForecastHourly.bulkCreate([params]);

  const allHours = await ForecastHourly.findAll();

  const res = await request(app).get(`/forecast/?zip=${zip}&ts=${ts}`);
  expect(spy).toHaveBeenCalledWith(zip, ts);
  expect(res.status).toEqual(200);
  expect(res.body.skies).toEqual('API_RESPONSE');
});
