const Tour = require('../models/tourModel');

// get a list of tours
exports.getTours = async (req, res) => {
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    // Delete excluded fields from queryObj
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Create a query object to filter tours based on specified criteria
    let query = Tour.find(JSON.parse(queryStr));

    // Sorting result (tours)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (numTours <= skip) throw new Error('This page does not exist');
    }

    // Execute the query to fetch tours matching the specified criteria and await the result
    const tours = await query;

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
