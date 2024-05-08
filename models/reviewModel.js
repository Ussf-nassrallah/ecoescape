const mongoose = require('mongoose');
const Tour = require('./tourModel');

// Review Schema
// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    // each time that the data output it as a json we went a virtual to be true
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// user can create only one review for each specific tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Calc Average ratings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this => point to the current Model (return promise)
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    // update Tour (ratingsAverage, ratingsQuantity)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // update Tour (ratingsAverage, ratingsQuantity)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// use this Middleware each time new review is created
reviewSchema.post('save', function () {
  // this point to the current document
  // constructor: the Model who created document
  this.constructor.calcAverageRatings(this.tour);
  // console.log(this);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this: point to the query
  this.rev = await this.findOne();
  console.log(this.rev);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does not work here, query has already executed
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

// Review Model
const Review = mongoose.model('Review', reviewSchema);

// Export Review Model
module.exports = Review;
