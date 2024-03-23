const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: Number,

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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
