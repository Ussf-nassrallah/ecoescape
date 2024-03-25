const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required, Please tell us your name!'],
    unique: true,
  },

  email: {
    type: String,
    required: [true, 'email is required, Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'password is required, please provide a password'],
    minlength: 8,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password!'],
    validate: {
      // this only works on save
      validator: function (el) {
        // this function return true or false.
        // true: if usser passwords are the same.
        // false: if user passwords are not the same.
        return el === this.password;
      },
      // we get this error message when validator function return false
      message: 'Passwords are not the same!',
    },
  },
});

// This middleware is gonna run before an actual event .save() and .create()
userSchema.pre('save', async function (next) {
  // if the password has not been modified exit this function and call the next Midlleware
  if (!this.isModified('password')) return next();
  // Encrypt user password using bcrypt with cost factor 12
  this.password = await bcrypt.hash(this.password, 12);
  // remove passwordConfirm value (we don't deleted because passwordConfirm is required)
  this.passwordConfirm = undefined;
  // call the next middleware
  next();
});

// Create User model from userSchema
const User = mongoose.model('User', userSchema);

// Export User model
module.exports = User;
