const express = require('express');
const router = new express.Router();

// importing middlewares
const auth = require('../middleware/auth');

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
    res.send({ user, token });
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
    res.send({ user, token });
  } catch (error) {
    res.status(404).send('Login failed.');
  }
});

// logging a user out
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
// exporting router
module.exports = router;
