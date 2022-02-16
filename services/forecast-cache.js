import ForecastApiClient from './forecast-api.js';
import { ForecastHourly } from '../db/index.js';
export const MAX_AGE = 3 * 3600;

export const apiResponseToDbRows = (zip, apiResponse) => {
  return apiResponse.forecast.forecastday[0].hour.map((h) => ({
    zip,
    time: h.time_epoch,
    windSpeed: h.wind_mph,
    windDirection: h.wind_dir,
    temperature: h.temp_f,
    skies: h.condition.text,
  }));
};

export default class ForecastCacheClient {
  constructor() {
    this.apiClient = new ForecastApiClient('xxxxx');
  }

  async getByZipAndTimestamp(zip, ts) {
    const cachedResults = await ForecastHourly.getByZipAndTimestamp(
      zip,
      ts,
      MAX_AGE
    );

    if (cachedResults) {
      return cachedResults;
    }

    const apiResponse = await this.apiClient.getByZipAndTimestamp(zip, ts);
    const hours = apiResponseToDbRows(zip, apiResponse);
    await ForecastHourly.bulkCreate(hours);
    return hours.find((h) => h.time === topOfHour(ts));
  }
}

function topOfHour(ts) {
  return ts - (ts % 3600);
}
