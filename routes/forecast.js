import { Router } from 'express';
import { getService as getCacheService } from '../services/forecast-cache.js';

const router = new Router();

router.get('/', async (req, res, next) => {
  const { zip, ts } = req.query;
  const cacheService = getCacheService();
  const forecast = await cacheService.getByZipAndTimestamp(zip, +ts);
  res.json(forecast);
});

export default router;
