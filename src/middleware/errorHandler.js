// errorHandler.js — глобальна обробка помилок

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи є помилка HTTP-помилкою (створеною через http-errors)
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Інші помилки (500)
  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};