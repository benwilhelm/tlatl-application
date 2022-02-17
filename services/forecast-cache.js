import { getService as getApiService } from './forecast-api.js';
import { ForecastHourly } from '../db/index.js';
export const MAX_AGE = 3 * 3600;

export const apiResponseToDbRows = (zip, apiResponse) => {
  return apiResponse.forecast.forecastday[0].hour.map((h) => ({
    zip,
    timestamp: h.time_epoch,
    windSpeed: h.wind_mph,
    windDirection: h.wind_dir,
    temperature: h.temp_f,
    skies: h.condition.text,
  }));
};

export default class ForecastCacheClient {
  constructor({ ForecastModel, apiClient }) {
    this.apiClient = apiClient;
    this.ForecastModel = ForecastModel;
  }

  async getByZipAndTimestamp(zip, ts) {
    const cachedResults = await this.ForecastModel.getByZipAndTimestamp(
      zip,
      ts,
      MAX_AGE
    );

    if (cachedResults) {
      return cachedResults;
    }

    const apiResponse = await this.apiClient.getByZipAndTimestamp(zip, ts);
    const hours = apiResponseToDbRows(zip, apiResponse);
    await this.ForecastModel.bulkCreate(hours);
    return hours.find((h) => h.timestamp === topOfHour(ts));
  }
}

function topOfHour(ts) {
  return ts - (ts % 3600);
}

/**
 * IIFE to close over singleton instance
 */
export const getService = (() => {
  const service = new ForecastCacheClient({
    ForecastModel: ForecastHourly,
    apiClient: getApiService(),
  });
  return () => service;
})();
