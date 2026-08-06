/**
 * Global Express Error Handling Middleware
 */

function errorHandler(err, req, res, next) {
  console.error(`[API ERROR] ${err.stack || err.message}`);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum 10MB limit.';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
