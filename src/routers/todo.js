const express = require('express');
const router = new express.Router();

// importing models
const Todo = require('../models/todo');

// importing middleware
const auth = require('../middleware/auth');

// create a todo document for authenticated user
router.post('/todos', auth, async (req, res) => {
  const todo = new Todo({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await todo.save();
    res.send(`success; ${todo.title}`);
  } catch (error) {
    res.status(500).send({ error: 'Unable to create a todo item.' });
  }
});

// read all todo documents for authenticated user
router.get('/todos/me', auth, async (req, res) => {
  const todos = await Todo.find({ owner: req.user._id });

  try {
    res.send(todos);
  } catch (error) {
    res.status(500).send("Can't display todo items for this user.");
  }
});

// update a todo item for authenticated user
router.patch('/todos/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedFieldsToUpdate = ['title', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );

  if (!isValidOperation) res.status(404).send(`Can't update some fields.`);

  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!todo) res.status(404).send(`Failed to update item.`);

    updates.forEach((update) => (todo[update] = req.body[update]));

    await todo.save();
    res.send(`Saved: ${todo.title}`);
  } catch (error) {
    res.status(500).send(`Error: Can't update this todo item.`);
  }
});

// delete all todo items for auth user
router.delete('/todos/all', auth, async (req, res) => {
  try {
    await Todo.deleteMany({ owner: req.user._id });

    res.send(`Deleted all todo items.`);
  } catch (error) {
    res.status(500).send(`Connection error - Delete All`);
  }
});

// delete a todo item for auth user
router.delete('/todos/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!todo) res.status(404).send(`Can't find that todo item in database.`);

    res.send(`Deleted: ${todo.title}`);
  } catch (error) {
    res.status(500).send(`Connection error - Delete Item`);
  }
});

// exporting todoRouter
module.exports = router;
