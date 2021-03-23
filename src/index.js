// express server configuration
const express = require('express');
const app = express();
const PORT = 3000;

// connecting to mongodb
require('./db/connection');

// importing routers
const todoRouter = require('./routers/todo');

// express app customization
app.use(todoRouter);

// listening to express server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
