const mongoose = require('mongoose');
const validator = require('validator');

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
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
