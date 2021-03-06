const mongoose = require('mongoose');

// importing npm packages
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// importing model
const Todo = require('../models/todo');

// schema setup for User
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email not valid.');
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

/**
 * Pre ( Mongoose Middleware )
 *
 * Password hashing via middleware using bcryptjs library
 *
 * @description "pre" middleware functions are executed one after another, when each middleware calls next.
 * @tutorial https://mongoosejs.com/docs/middleware.html#pre
 *
 * @description using bcrypjs to hash passwords before saving
 * @tutorial https://www.npmjs.com/package/bcryptjs#hashs-salt-callback-progresscallback
 *
 * Note: using regular function expression to use "this" keyword
 * Note: checks if password key is updated on save ( post )
 *
 * Note: for 'save' this will happen before Document.prototype.save() will happen
 * Note: for 'remove' this will happen before Schema.prototype.remove() method will happen
 *
 */
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

userSchema.pre('remove', async function (next) {
  const user = this;

  await Todo.deleteMany({ owner: user._id });

  next();
});

/**
 * Statics ( Mongoose Schemas ) --- instance method
 *
 * Do not declare statics using ES6 arrow functions (=>).
 * Arrow functions explicitly prevent binding this.
 *
 * @description function "findByCredentials" is called when user is logging in
 *
 * @tutorial https://mongoosejs.com/docs/guide.html#statics
 * @returns user
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User doesn't exist.");

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) throw new Error('Wrong email or password.');

  return user;
};

/**
 * Generating a token ( user login and create user ) --- Models method
 *
 * @tutorial https://www.npmjs.com/package/jsonwebtoken
 * @returns token
 *
 */
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  // generating jwt
  const token = jwt.sign({ _id: user._id.toString() }, 'ilovenodejs');

  // appending token on each session or login to tokens property or user schema
  user.tokens = user.tokens.concat({ token });

  // saving the user to db with jwt
  await user.save();

  // sending the token value back to the caller of the function
  return token;
};

/**
 * Return public data only --- Models method
 *
 * Note: delete --- will hide (only) the specified property on response *
 * @returns public data
 *
 */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// compiling schema to User model
const User = mongoose.model('User', userSchema);

// export User model
module.exports = User;
