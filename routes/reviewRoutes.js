const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this Middleware
router.use(protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(restrictTo('user'), reviewController.deleteReview)
  .patch(restrictTo('user'), reviewController.updateReview);

module.exports = router;
