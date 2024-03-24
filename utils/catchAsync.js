// Function to handle asynchronous operations and catch errors
module.exports = (fn) => (req, res, next) =>
  fn(req, res, next).catch((error) => next(error));
