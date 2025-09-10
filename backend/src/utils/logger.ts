import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, splat, json, printf, colorize } = format;

// custom log format for console
const consoleLogFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ''}`;
});

// check environment
const isProduction = process.env.NODE_ENV === 'production';

const baseFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat()
);

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: baseFormat,
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
      format: combine(colorize({ all: true }), consoleLogFormat),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(json()),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(json()),
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }),
  ],
  exitOnError: false,
});

export default logger;