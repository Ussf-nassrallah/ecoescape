const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    protect,
    restrictTo('user', 'guide'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(
    protect,
    restrictTo('user', 'admin', 'guide'),
    reviewController.deleteReview,
  )
  .patch(
    protect,
    restrictTo('user', 'admin', 'guide'),
    reviewController.updateReview,
  );

module.exports = router;
