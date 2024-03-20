const Tour = require('../models/tourModel');

// get a list of tours
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    console.error('Error in getTours:', error);

    res.status(404).json({
      status: 'error',
      message: 'Failed to get tours',
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
