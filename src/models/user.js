const mongoose = require('mongoose');

// importing npm packages
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
 *
 */
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

/**
 * Statics ( Mongoose Schemas )
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

// compiling schema to User model
const User = mongoose.model('User', userSchema);

// export User model
module.exports = User;
