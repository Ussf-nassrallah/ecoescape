const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// Signup User
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Signup Successfully!',
    data: { user: newUser },
  });
});
