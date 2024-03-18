const fs = require('fs');

// Tours Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkId = (req, res, next, value) => {
  const tourId = req.params.id * 1;

  if (tourId > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  // check tour data
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

// get a list of tours
exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

// get a single tour
exports.getTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((t) => t.id === tourId);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// create a new tour
exports.createTour = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newTourId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    },
  );
};

// update a tour
exports.updateTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((t) => t.id === tourId);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// delete a tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
