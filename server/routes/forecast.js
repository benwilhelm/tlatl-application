import { Router } from 'express';
import { ForecastCacheService } from '../services/forecast-cache.service.js';
import { ForecastHourly } from '../db/index.js';
import ForecastApiClient from '../services/forecast-api.js';

const router = new Router();
const cacheService = new ForecastCacheService({
  dbClient: ForecastHourly,
  apiClient: new ForecastApiClient({ apiKey: process.env.WEATHER_API_KEY }),
});

router.get('/', async (req, res, next) => {
  try {
    const zip = req.query.zip;
    const ts = +req.query.ts;

    const hour = await cacheService.getByZipAndTimestamp(zip, ts);
    console.log('returned from cache', hour);
    res.json(hour);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default router;
