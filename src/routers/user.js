const express = require('express');
const router = new express.Router();

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

// exporting router
module.exports = router;
