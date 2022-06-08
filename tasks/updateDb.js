import { db } from '../server/db/index.js';

(async () => {
  await db.sync({ alter: true });
})();
