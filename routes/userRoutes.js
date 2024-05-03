const express = require('express');

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

const {
  createUser,
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this Middleware
router.use(protect);

router.route('/me').get(getCurrentUser);
router.patch('/updateMe', updateMe);
router.patch('/updateMyPassword', updatePassword);
router.delete('/deleteMe', deleteMe);

// Only admin Can (GET/POST/PATCH/DELETE users)
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
