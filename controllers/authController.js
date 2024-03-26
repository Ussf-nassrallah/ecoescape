const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// handle user token
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Signup User
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // generate token for the Signup user
  const token = signToken(newUser._id);

  // send token with the response
  res.status(201).json({
    status: 'success',
    message: 'Signup Successfully!',
    token: token,
    data: { user: newUser },
  });
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  // receive email and password from the user
  const { email, password } = req.body;

  // Check if email and password are exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check if user exists and the password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if everything is OK! send token to user
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// Protect routes from unauthorized access
exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check of it's there
  let token = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized! Please log in to get access', 401));
  }

  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists (user based on decoded ID)
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // Grant Access to protected Route
  // move to the next Middleware.
  req.user = freshUser;
  next();
});

// Middleware function to restrict access based on user roles
// This function checks if the current user's role allows access to the requested resource
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // check if the user role is not 'admin' or 'lead-guide'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403),
      );
    }

    // move to the next Middleware
    next();
  };
