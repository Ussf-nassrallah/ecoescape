const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // get tours data from collection
  const tours = await Tour.find();
  // render overview template by using tours data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTourDetail = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.tourId);

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
