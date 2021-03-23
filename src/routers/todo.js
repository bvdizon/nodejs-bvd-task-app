const express = require('express');
const router = new express.Router();

// importing models
const Todo = require('../models/todo');

router.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);

  try {
    await todo.save();
    res.send(`success; ${todo}`);
  } catch (error) {
    res.status(500).send({ error: 'Unable to create a todo item.' });
  }
});

module.exports = router;
