const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get a list of tours
exports.getTours = catchAsync(async (req, res, next) => {
  // Execute the query to fetch tours matching the specified criteria and await the result
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// get a single tour
exports.getTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);

  // Check if a tour is not found in the database
  if (!tour) {
    // If no tour is found, create a new AppError with a message indicating the resource was not found
    // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
    return next(new AppError('No tour found with that ID', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Endpoint to create a new tour
// Use catchAsync to handle any asynchronous operations and catch errors
exports.createTour = catchAsync(async (req, res, next) => {
  // Create a new tour using data from the request body
  const newTour = await Tour.create(req.body);

  // Send a success response with the created tour data
  res.status(201).json({
    status: 'success',
    message: 'Tour created successfully',
    data: { tour: newTour },
  });
});

// update a tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tourData = req.body;
  const tour = await Tour.findByIdAndUpdate(tourId, tourData, {
    new: true,
    runValidators: true,
  });

  // Check if a tour is not found in the database
  if (!tour) {
    // If no tour is found, create a new AppError with a message indicating the resource was not found
    // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'tour updated successfully',
    data: { tour },
  });
});

// delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndDelete(tourId);

  // Check if a tour is not found in the database
  if (!tour) {
    // If no tour is found, create a new AppError with a message indicating the resource was not found
    // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'tour deleted successfully',
    data: null,
  });
});

// Retrieve tour statistics based on specified criteria
exports.getTourStats = catchAsync(async (req, res, next) => {
  // Aggregate tour data based on specified conditions
  const statistics = await Tour.aggregate([
    {
      // match: Select Documents.
      $match: { ratingsAverage: { $gte: 4.5 } }, // Match tours with average ratings greater than or equal to 4.5
    },
    {
      $group: {
        // Group tours based on difficulty level
        _id: { $toUpper: '$difficulty' }, // Convert difficulty level to uppercase
        numTours: { $sum: 1 }, // Count the number of tours in each difficulty category
        numRatings: { $sum: '$ratingsQuantity' }, // Calculate total number of ratings for each difficulty category
        avgRating: { $avg: '$ratingsAverage' }, // Calculate average rating for each difficulty category
        avgPrice: { $avg: '$price' }, // Calculate average price for each difficulty category
        minPrice: { $min: '$price' }, // Determine minimum price for each difficulty category
        maxPrice: { $max: '$price' }, // Determine maximum price for each difficulty category
      },
    },
  ]);

  // Send successful response with tour statistics
  return res.status(200).json({
    status: 'success',
    data: { statistics },
  });
});

// Retrieve monthly tour plan for a specified year
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  // Extract the year from the request parameters and convert it to a number
  const year = req.params.year * 1;

  // Aggregate tour data to generate monthly plan
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Split tours by start dates
    },
    {
      $match: {
        // Filter tours for the specified year
        startDates: {
          $gte: new Date(`${year}-01-01`), // Start date greater than or equal to January 1st of the year
          $lte: new Date(`${year}-12-31`), // Start date less than or equal to December 31st of the year
        },
      },
    },
    {
      $group: {
        // Group tours by month
        _id: { $month: '$startDates' }, // Extract month from start date
        numTourStarts: { $sum: 1 }, // Count the number of tours starting in each month
        tours: { $push: '$name' }, // List tours starting in each month
      },
    },
    {
      $addFields: { month: '$_id' }, // Add month field to the result
    },
    {
      $project: {
        _id: 0, // Exclude _id from the result
      },
    },
    {
      $sort: { numTourStarts: -1 }, // Sort the result by number of tour starts in descending order
    },
  ]);

  // Send successful response with monthly plan data
  return res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
