//errorHandler.js — глобальна обробка помилок: повертає статус 500,
//або інші статуси у разі використання бібліотеки http-errors та наступний об’єкт:
import createError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка помилки від http-errors
  if (createError.isHttpError(err)) {
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
