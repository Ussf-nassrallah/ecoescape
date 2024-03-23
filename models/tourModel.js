const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on new document creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },

    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide createdAt
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // each time that the data output it as a json we went a virtual to be true
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// define a virtual property on a tour schema
// virtual property will be created each time that we got data from DB
// durationWeeks: this property it's not a part of DB
tourSchema.virtual('durationWeeks').get(function () {
  // this: pointing to the current document
  // when we using this keyword we need to work with regular function
  return this.duration / 7;
});

/**
 * Document middleware
 * pre: middleware is gonna run before an actual event (.save() and .create())
 */
tourSchema.pre('save', function (next) {
  // this function will be called before an actual document is saved to the DB
  // this: pointing to the current document
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * Query Middleware
 * allow us to run functions before or after a certain query is executed
 * /^find/: all the strings that start with find
 */
// Middleware executed before any find query is executed
tourSchema.pre(/^find/, function (next) {
  // 'this' refers to the query object because 'find' event is used
  // Exclude secret tours from the query results
  this.find({ secretTour: { $ne: true } });

  // Record the start time of the query execution
  this.start = Date.now();

  // Continue with the next middleware in the stack
  next();
});

// Middleware executed after any find query is executed
tourSchema.post(/^find/, function (docs, next) {
  // 'this' refers to the query object because 'find' event is used
  // Output the duration of the query execution
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);

  // Continue with the next middleware in the stack
  next();
});

/**
 * Aggregation Middleware
 */
tourSchema.pre('aggregate', function (next) {
  // this: pointing to the current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
