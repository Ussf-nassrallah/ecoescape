// Use catchAsync to handle any asynchronous operations and catch errors
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
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

// Update document
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if document is not found in the database
    if (!document) {
      // If no document is found, create a new AppError with a message indicating the resource was not found
      // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'document updated successfully',
      data: { data: document },
    });
  });

// Create a new document
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Create a new document using data from the request body
    const newDocument = await Model.create(req.body);

    // Send a success response with the created document data
    res.status(201).json({
      status: 'success',
      message: 'Document created successfully',
      data: { data: newDocument },
    });
  });

// Get a single Document
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const document = await query;

    // Check if a document is not found in the database
    if (!document) {
      // If no document is found, create a new AppError with a message indicating the resource was not found
      // Pass the error to the next middleware function (app.js -> globalErrorHandler) with a 404 status code
      return next(new AppError('No document found with that ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: { data: document },
    });
  });

// Get all documents from collection
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    // Check tour ID
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Execute the query to fetch documents matching the specified criteria and await the result
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const documents = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: { documents },
    });
  });
