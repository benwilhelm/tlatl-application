import { db } from '../server/db/index.js';

(async () => {
  const opts = process.argv[2] === 'clean' ? { force: true } : { alter: true };
  await db.sync(opts);
})();
