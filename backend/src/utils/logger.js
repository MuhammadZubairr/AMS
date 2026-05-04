const pino = require('pino');

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino(
  isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        },
        level: process.env.LOG_LEVEL || 'debug',
      }
    : { level: process.env.LOG_LEVEL || 'info' }
);

module.exports = logger;