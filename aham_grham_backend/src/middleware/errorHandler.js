/**
 * globalErrorHandler: Catches all errors thrown in the application
 * Returns a standardized JSON response
 */
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  if (err.stack) console.error(err.stack);
  
  // Set status code (default to 500 if not set)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

/**
 * notFoundHandler: Catches requests to routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
