const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Delete document from collection
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    // Check if a document is not found in the database
    if (!document) {
      // If no document is found, create a new AppError with a message indicating the resource was not found
      // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'document deleted successfully',
      data: null,
    });
  });
