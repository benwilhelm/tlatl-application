import axios from 'axios';

export default class ForecastApiClient {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.weatherapi.com/v1/',
    });
  }
  async getForecastByZip(zip) {
    const url = '/forecast.json';
    const query = `key=${this.apiKey}&q=${zip}&days=10&aqi=no&alerts=no`;
    const response = await this.client.get(`${url}?${query}`);
    return response.data;
  }
}
