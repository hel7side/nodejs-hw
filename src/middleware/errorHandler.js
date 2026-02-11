// src/middleware/errorHandler.js

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Check if error is an instance of HttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Handle other (unexpected) errors
  const isProd = process.env.NODE_ENV === 'production';

  return res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};