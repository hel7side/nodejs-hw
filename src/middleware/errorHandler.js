// src/middleware/errorHandler.js

import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Check if error is created by http-errors
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Handle other errors
  const isProd = process.env.NODE_ENV === 'production';

  return res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};