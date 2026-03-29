export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`Error ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
