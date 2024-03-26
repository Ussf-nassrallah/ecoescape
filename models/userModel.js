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
    select: false, // hide password (don't send it)
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

  passwordChangedAt: Date,
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

// compared hashed password with original password
// this method is available in objects created from userShema
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// changedPasswordAfter: Method that check if the password changed after getting JWT
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // convert Date to seconds and change the type to Int
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // compare the time when password updated with the time when generate a token
    // true means password changed
    return changedTimestamp > JWTTimestamp;
  }

  // false means NOT changed Password
  return false;
};

// Create User model from userSchema
const User = mongoose.model('User', userSchema);

// Export User model
module.exports = User;
