const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Set security HTTP headers
 */
app.use(helmet());

/**
 * Middleware responsible for logging request information as it comes to the server.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Global Middleware
 * rate limiter Middleware is gonna count the number of requests comming from one IP
 */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

/**
 * Middleware responsible for parsing data from the request body.
 * the size of the data that will be parsing should be max 10kb
 */
app.use(express.json({ limit: '10kb' }));

/**
 * Data sanitization against NOSql query injection
 */
app.use(mongoSanitize());

/**
 * Data sanitization against XSS
 */
app.use(xss());

/**
 * Prevent parameter pollution
 * this Middleware removes duplicate fields from query string
 */
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  }),
);

/**
 * routes
 */
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The forest hiker',
    user: 'Jonas',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
