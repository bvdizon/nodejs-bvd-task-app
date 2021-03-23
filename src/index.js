// express server configuration
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// connecting to mongodb
require('./db/connection');

// importing routers
const todoRouter = require('./routers/todo');
const userRouter = require('./routers/user');

// express app customization
app.use(express.json());
app.use(todoRouter);
app.use(userRouter);

// listening to express server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
