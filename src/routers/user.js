const express = require('express');
const router = new express.Router();

// importing models
const User = require('../models/user');

// route to create a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send('Unable to create user.');
  }
});

// route to login an existing user
router.post('/users/login', async (req, res) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);
  try {
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(404).send('Login failed.');
  }
});

// exporting router
module.exports = router;
