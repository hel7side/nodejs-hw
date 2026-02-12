//errorHandler.js — глобальна обробка помилок: повертає статус 500,
//або інші статуси у разі використання бібліотеки http-errors та наступний об’єкт:
// src/middleware/errorHandler.js
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // HTTP-помилки (404, 400, тощо)
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Інші (неочікувані) помилки → 500
  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};

