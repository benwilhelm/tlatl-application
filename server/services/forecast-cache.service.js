const MAX_AGE = 3 * 3600; // three hours

export class ForecastCacheService {
  constructor({ dbClient, apiClient }) {
    this.dbClient = dbClient;
    this.apiClient = apiClient;
  }

  async getByZipAndTimestamp(zip, timestamp) {
    const dbResult = await this.dbClient.getByZipAndTimestamp(
      zip,
      timestamp,
      MAX_AGE
    );
    console.log('dbResult', dbResult);
    if (dbResult) {
      console.log('returning dbResult');
      return dbResult;
    }

    const apiResult = await this.apiClient.getForecastByZip(zip);
    console.log('apiResult', apiResult);
    const hours = apiResponseToHoursArray(apiResult, zip);
    console.log('hours', hours);
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
