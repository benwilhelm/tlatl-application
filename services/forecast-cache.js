import { ForecastHourly } from '../db/index.js';
export const MAX_AGE = 3 * 3600;

export const apiResponseToDbResult = (apiResponse) => {};

export default class ForecastCacheClient {
  async getByZipAndTimestamp(zip, ts) {
    const cachedResults = await ForecastHourly.getByZipAndTimestamp(
      zip,
      ts,
      MAX_AGE
    );

    if (cachedResults) {
      return cachedResults;
    }
  }
}
