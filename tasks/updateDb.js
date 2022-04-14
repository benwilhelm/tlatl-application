import { db } from '../db/index.js';

(async () => {
  await db.sync({ alter: true });
})();
