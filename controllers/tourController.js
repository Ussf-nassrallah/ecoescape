const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get a list of tours
exports.getTours = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in getTours:', error);

    res.status(404).json({
      status: 'error',
      message: error,
    });
  }
};

// get a single tour
exports.getTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: 'Not found!',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    console.error('Error in getTour:', error);

    return res.status(404).json({
      status: 'error',
      message: 'Not found!',
    });
  }
};

// create a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'tour is created successfully',
      data: { tour: newTour },
    });
  } catch (error) {
    console.error('Error creating tour:', error);

    res.status(400).json({
      status: 'error',
      message: 'Failed to create tour (invalid data sent!)',
    });
  }
};

// update a tour
exports.updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tourData = req.body;
    const tour = await Tour.findByIdAndUpdate(tourId, tourData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'tour updated successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Tour not updated (invalid data sent!)',
    });
  }
};

// delete a tour
exports.deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    await Tour.findByIdAndDelete(tourId);

    res.status(204).json({
      status: 'success',
      message: 'tour deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Error in deleteTour:', error);

    res.status(404).json({
      status: 'error',
      message: 'Not found!',
    });
  }
};

// Retrieve tour statistics based on specified criteria
exports.getTourStats = async (req, res) => {
  try {
    // Aggregate tour data based on specified conditions
    const statistics = await Tour.aggregate([
      {
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
  } catch (error) {
    // Handle errors and send error response if an error occurs
    console.error('Error in getTourStats:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
