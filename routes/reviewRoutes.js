const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .delete(
    protect,
    restrictTo('user', 'admin', 'guide'),
    reviewController.deleteReview,
  );

module.exports = router;
