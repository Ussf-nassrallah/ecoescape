const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/**
 * Middleware responsible for logging request information as it comes to the server.
 */
app.use(morgan('dev'));

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
 * Start server
*/
const port = 3000;

app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

// 60
