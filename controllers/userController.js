const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// function thats create a new Object from obj
// the new Object should only includes allowedFields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

// update user Data (name and email)
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create Error if user Posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. You can visite /updateMyPassword',
        400,
      ),
    );
  }

  // filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Get Current logged-in User
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUser = req.user;

  // send Response
  res.status(200).json({
    status: 'success',
    data: {
      currentUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // we just need to make the user unActive (don't delete user document from DB)
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// create a new user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Get all users
exports.getAllUsers = factory.getAll(User);
// Get User
exports.getUser = factory.getOne(User);
// update user (Do not update passwords with this!)
exports.updateUser = factory.updateOne(User);
// delete user
exports.deleteUser = factory.deleteOne(User);
