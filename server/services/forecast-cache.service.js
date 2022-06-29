const MAX_AGE = 3 * 3600; // three hours

export class ForecastCacheService {
  constructor({ dbClient, apiClient }) {
    this.dbClient = dbClient;
    this.apiClient = apiClient;
  }

  async getByZipAndTimestamp(zip, timestamp) {
    console.debug('connected to', process.env.DATABASE_CONNECTION_STRING);
    const dbResult = await this.dbClient.getByZipAndTimestamp(
      zip,
      timestamp,
      MAX_AGE
    );
    if (dbResult) {
      console.debug('found cached forecast');
      return dbResult;
    }

    console.debug('fetching forecast from weather api');
    const apiResult = await this.apiClient.getForecastByZip(zip);
    const hours = apiResponseToHoursArray(apiResult, zip);
    await this.dbClient.bulkCreate(hours);
    return this.dbClient.getByZipAndTimestamp(zip, timestamp, MAX_AGE);
  }
}

export function apiResponseToHoursArray(apiResponse, zip) {
  const hours = apiResponse.forecast.forecastday.map((d) => d.hour).flat();
  return hours.map((hour) => ({
    zip,
    timestamp: hour.time_epoch,
    temperature: hour.temp_f,
    windSpeed: hour.wind_mph,
    windDirection: hour.wind_dir,
    windDegree: hour.wind_degree,
    skies: hour.condition.text,
  }));
}
