import axios from 'axios';

export default class ForecastApiClient {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.weatherapi.com/v1/',
    });
  }
  async getByZipAndTimestamp(zip, ts) {
    const url = '/forecast.json';
    const query = `key=${this.apiKey}&q=${zip}&days=1&aqi=no&alerts=no`;
    const response = await this.client.get(`${url}?${query}`);
    return response.data;
  }
}

/**
 * IIFE to return singleton instance of service
 */
export const getService = (() => {
  const service = new ForecastApiClient({
    apiKey: process.env.WEATHER_API_KEY,
  });
  return () => service;
})();
