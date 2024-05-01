const express = require('express');

const { protect, restrictTo } = require('../controllers/authController');

// merge params
const reviewRouter = require('./reviewRoutes');

const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

// POST /tours/tourId/reviews => nested Routes
// GET /tours/tourId/reviews
// GET /tours/tourId/reviews/reviewId
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(protect, getTours)
  .post(protect, restrictTo('admin', 'lead-guide', 'guide'), createTour);
router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, restrictTo('admin', 'lead-guide', 'guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide', 'guide'), deleteTour);

module.exports = router;
