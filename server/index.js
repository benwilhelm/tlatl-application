const PORT = process.env.PORT || 3000;
import app from './app.js';

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});
