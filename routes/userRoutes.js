const express = require('express');

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protect,
  updatePassword,
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
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(protect, getAllUsers).post(createUser);
router.route('/me').get(protect, getCurrentUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
