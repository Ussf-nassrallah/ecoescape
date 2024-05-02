const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  // Check tour ID
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // GET tour reviews
  const tourReviews = await Review.find(filter);

  // Send response (tour reviews)
  res.status(200).json({
    status: 'success',
    results: tourReviews.length,
    data: {
      reviews: tourReviews,
    },
  });
});

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// create a new review
exports.createReview = factory.createOne(Review);
// Update Review
exports.updateReview = factory.updateOne(Review);
// Delete Review
exports.deleteReview = factory.deleteOne(Review);
