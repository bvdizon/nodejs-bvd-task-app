const mongoose = require('mongoose');

// schema setup for a todo document
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// compiling schema to a model
const Todo = mongoose.model('Todo', todoSchema);

// exporting model
module.exports = Todo;
