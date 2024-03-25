const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// get a list of users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// get a single user
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// create a new user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// update user
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// delete user
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
