const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty,duration';
  next();
};

// get a list of tours
exports.getTours = factory.getAll(Tour);
// get a single tour
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// create a new tour
exports.createTour = factory.createOne(Tour);
// update a tour
exports.updateTour = factory.updateOne(Tour);
// delete a tour
exports.deleteTour = factory.deleteOne(Tour);

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  // radius of the earth in mi = 3963.2
  // radius of the earth in km = 6378.1
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitur and longitude in the format lat,lng.',
        400,
      ),
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(
    `{startLocation: { $geoWithin: { $centerSphere: [[${lng}, ${lat}], ${radius}] } },}`,
  );
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
