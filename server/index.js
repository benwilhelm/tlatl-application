const PORT = process.env.PORT || 3000;
import { db } from './db/index.js';
import app from './app.js';
import { server as weatherApi } from './services/test-helpers/forecast-api.mock-server.js';

async function main() {
  if (process.env.NODE_ENV === 'test') {
    await db.sync();
    await weatherApi.listen();
  }

  app().listen(PORT, (e) => {
    if (e) throw err;
    console.log(`Listening on port ${PORT}`);
  });
}

main();
