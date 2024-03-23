const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  /**
   * Middleware responsible for logging request information as it comes to the server.
   */
  app.use(morgan('dev'));
}

/**
 * Middleware responsible for parsing data from the request body.
 */
app.use(express.json());

/**
 * routes
 */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 * handling unhandled Routes
 * all: target all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * (*): any endpoint don't defined
 */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Error handling Middleware
 * Implementing a Global Error Handling Middleware
 */
app.use(globalErrorHandler);

module.exports = app;
