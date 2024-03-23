// Custom error class to handle application errors
class AppError extends Error {
  constructor(message, statusCode) {
    // Call the constructor of the Error class with the provided message
    super(message);

    // Initialize instance variables for statusCode, status, and isOperational
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Determine status based on status code
    this.isOperational = true; // Flag to distinguish operational errors from programming errors

    // Capture the stack trace to include in the error object
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the AppError class to make it available for use in other modules
module.exports = AppError;
