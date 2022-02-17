const PORT = process.env.PORT || 3000;
import app from './app.js';
import { db } from './db/index.js';

db.sync()
  .then(() => {
    app.listen(PORT, (e) => {
      if (e) throw err;
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    throw err;
  });
