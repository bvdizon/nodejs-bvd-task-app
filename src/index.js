// express server configuration
const express = require('express');
const app = express();
const PORT = 3000;

// connecting to mongodb
require('./db/connection');

app.get('/hello', (req, res) => {
  res.send('Hello there!');
});

// listening to express server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
