import { resetDb } from './test-helpers.js';
import { ForecastHourly } from './forecast-hourly.js';
import {
  paramFactory,
  mockTimeNow,
} from './test-helpers/forecast-hourly.fixtures.js';

beforeEach(resetDb);
afterEach(() => {
  jest.useRealTimers();
});

describe('validations', () => {
  test('saves with valid params', async () => {
    const params = paramFactory();
    const subject = await ForecastHourly.create(params);
    expect(subject).toEqual(expect.objectContaining(params));
    expect(subject.createdAt).toBeDefined();
    expect(subject.updatedAt).toBeDefined();
  });

  test('it should require zip', async () => {
    const params = paramFactory({ zip: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/zip cannot be null/i);
  });

  test('zip must be 5 digits', async () => {
    const params = paramFactory({ zip: 'A6542' });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/invalid zip/i);
  });

  test('timestamp is required', async () => {
    const params = paramFactory({ timestamp: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/timestamp cannot be null/i);
  });

  test('timestamp must be integer', async () => {
    const params = paramFactory({ timestamp: 'foo' });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/invalid timestamp/i);
  });

  test('windspeed is required', async () => {
    const params = paramFactory({ windSpeed: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/windSpeed cannot be null/i);
  });

  test('windspeed must be float', async () => {
    const params = paramFactory({ windSpeed: 'foo' });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/invalid windSpeed/i);
  });

  test('windDirection is required', async () => {
    const params = paramFactory({ windDirection: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/windDirection cannot be null/i);
  });

  test('windDirection must be directional string', async () => {
    const params = paramFactory({ windDirection: 'foo' });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/invalid windDirection/i);

    await ForecastHourly.create(paramFactory({ windDirection: 'N' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'S' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'E' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'W' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'NW' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'SE' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'ENE' }));
    await ForecastHourly.create(paramFactory({ windDirection: 'WSW' }));
  });

  test('temperature is required', async () => {
    const params = paramFactory({ temperature: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/temperature cannot be null/i);
  });

  test('temperature must be float', async () => {
    const params = paramFactory({ temperature: 'foo' });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/invalid temperature/i);
  });

  test('skies is required', async () => {
    const params = paramFactory({ skies: undefined });
    const fn = () => ForecastHourly.create(params);
    await expect(fn).rejects.toThrowError(/skies cannot be null/i);
  });
});

describe('getByZipAndTimestamp', () => {
  it('should fetch record by zip and timestamp', async () => {
    const subject = paramFactory({ zip: '11111', timestamp: 3600 });
    const decoy = paramFactory({ zip: '22222', timestamp: 3600 });
    await ForecastHourly.bulkCreate([subject, decoy]);

    const result = await ForecastHourly.getByZipAndTimestamp('11111', 3600);

    expect(result).toEqual(expect.objectContaining(subject));
  });

  it('should hash timestamp to closest hour (multiple of 3600)', async () => {
    const subject = paramFactory({ zip: '11111', timestamp: 3600 });
    await ForecastHourly.create(subject);

    const result = await ForecastHourly.getByZipAndTimestamp('11111', 3650);

    expect(result).toEqual(expect.objectContaining(subject));
  });

  it('should return newest record if it finds multiple matches', async () => {
    const older = paramFactory({
      updatedAt: new Date('2022-02-10T04:19:52.178Z'),
    });
    const newer = paramFactory({
      updatedAt: new Date('2022-02-10T04:30:52.178Z'),
    });
    await ForecastHourly.bulkCreate([newer, older]);

    const result = await ForecastHourly.getByZipAndTimestamp(
      '11111',
      mockTimeNow
    );
    expect(result).toEqual(expect.objectContaining(newer));
  });

  it('should NOT fetch records older than maxAge', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-02-10T05:00:00.000Z'));
    const stale1 = paramFactory({
      updatedAt: new Date('2022-02-10T01:59:00.000Z'),
    });
    const stale2 = paramFactory({
      updatedAt: new Date('2022-02-10T00:59:00.000Z'),
    });
    await ForecastHourly.bulkCreate([stale1, stale2]);

    const result = await ForecastHourly.getByZipAndTimestamp(
      stale1.zip,
      stale1.timestamp,
      3600 * 3
    );

    expect(result).toBeNull();
  });

  it('should fetch records younger than maxAge', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-02-10T05:00:00.000Z'));
    const params = paramFactory({
      updatedAt: new Date('2022-02-10T02:01:00.000Z'),
    });

    // slight hack to use bulkCreate, because single create doesn't
    // allow us to override the updatedAt property
    await ForecastHourly.bulkCreate([params]);

    const result = await ForecastHourly.getByZipAndTimestamp(
      params.zip,
      params.timestamp,
      3600 * 3
    );

    expect(result).toEqual(expect.objectContaining(params));
  });
});
