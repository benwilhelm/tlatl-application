const MAX_AGE = 3 * 3600 * 1000; // three hours

export class ForecastCacheService {
  constructor({ dbClient, apiClient }) {
    this.dbClient = dbClient;
    this.apiClient = apiClient;
  }

  getByZipAndTimestamp(zip, timestamp) {
    const dbResult = this.dbClient.getByZipAndTimestamp(
      zip,
      timestamp,
      MAX_AGE
    );

    if (!dbResult) {
      const apiResult = this.apiClient.getByZipAndTimestamp(zip, timestamp);
      return apiResponseToDbModel(apiResult, zip);
    }

    return dbResult;
  }
}

export function apiResponseToDbModel(apiResponse, zip) {
  const hour = apiResponse.forecast.forecastday[0].hour[0];
  return {
    zip,
    timestamp: hour.time_epoch,
    temperature: hour.temp_f,
    windSpeed: hour.wind_mph,
    windDirection: hour.wind_dir,
    windDegree: hour.wind_degree,
    skies: hour.condition.text,
  };
}
