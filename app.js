const fs = require('fs');
const express = require('express');

const app = express();

// Middlewares
app.use(express.json());

// Tours Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Hundler
// get a list of tours
const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

// get a single tour
const getTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// create a new tour
const createTour = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

// update a tour
const updateTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// delete a tour
const deleteTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Routes
app.route('/api/v1/tours').get(getTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

// 60
