const PORT = process.env.PORT || 3000;
import app from './app.js';
import { server as weatherApi } from './services/test-helpers/forecast-api.mock-server.js';

if (process.env.MOCK_WEATHER_API) {
  console.log('Mocking interactions with weatherapi.com');
  weatherApi.listen({ onUnhandledRequest: 'bypass' });
}

app.listen(PORT, (e) => {
  if (e) throw err;
  console.log(`Listening on port ${PORT}`);
});
