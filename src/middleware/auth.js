const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // returns the Bearer < token >; extracts the token string
    const token = req.header('Authorization').replace('Bearer ', '');

    // check if token exists and matches the securityKey
    const decoded = jwt.verify(token, 'ilovenodejs');

    // query mongodb for the specific user
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) throw new Error(`Error: Authentication failed.`);

    // passing token and user values to "req" Object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(500).send(`Error: Failed Authentication.`);
  }
};

module.exports = auth;
