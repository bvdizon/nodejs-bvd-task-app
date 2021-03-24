const express = require('express');
const router = new express.Router();

// importing middlewares
const auth = require('../middleware/auth');
const Todo = require('../models/todo');

// importing models
const User = require('../models/user');

// route to create a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    // saving the user profile; no token yet
    await user.save();

    // call to function to generate a token using jwt
    const token = await user.generateAuthToken();

    // sending updated user and the session token
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send('Unable to create user.');
  }
});

// route to login an existing user
router.post('/users/login', async (req, res) => {
  // query db to the user profile
  const user = await User.findByCredentials(req.body.email, req.body.password);

  try {
    // call to function to generate a token using jwt
    const token = await user.generateAuthToken();

    // sending updated user and the session token
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send('Login failed.');
  }
});

// route to log a user out
router.post('/users/logout', auth, async (req, res) => {
  try {
    // remove the token from the current tokens property of a user
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    // save changes to mongodb
    await req.user.save();

    res.send('You have been logged off from the session.');
  } catch (error) {
    res.status(500).send('Logout failed.');
  }
});

// route to log a user out on all sessions
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    // remove all okens from the current tokens property of a user
    req.user.tokens = [];

    // save changes to mongodb
    await req.user.save();

    res.send('You have been logged off on all devices.');
  } catch (error) {
    res.status(500).send('Logout failed.');
  }
});

// route to check current user profile
router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Can't load user profile.");
  }
});

// route to update a user profile
router.patch('/users/me', auth, async (req, res) => {
  // get all keys from the incoming request body
  const updates = Object.keys(req.body);

  // save to array all fields that user is allowed to update
  const allowedFieldsToUpdate = ['name', 'email', 'password', 'username'];

  // array method to check if all keys from req.body are allowed
  const isValidOperation = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );

  if (!isValidOperation) res.status(400).send('Failed to update user profile.');

  try {
    // loop through updates
    updates.forEach((update) => (req.user[update] = req.body[update]));

    // save updated key-value pairs to mongodb
    await req.user.save();

    res.status(200).send(`Profile updated. --- ${req.user}`);
  } catch (error) {
    res.status(500).send(`Update failed.`);
  }
});

// route to delete a user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    res.status(200).send(`Profile deleted: ${req.user.name}`);
  } catch (error) {
    res.status(500).send('Unable to delete user profile.');
  }
});

// exporting router
module.exports = router;
