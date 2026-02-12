import pino from 'pino-http';

//Middleware — логування HTTP-запитів за допомогою pino-http:
export const loggerPino = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
    },
  },
});

