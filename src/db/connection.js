const mongoose = require('mongoose');

// connecting to db "bvd-todo"
mongoose.connect('mongodb://localhost/bvd-todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
