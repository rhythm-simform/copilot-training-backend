import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine the current environment
const environment = process.env.NODE_ENV || 'development';

// Set log level based on environment
const level = (): string => {
  const isDevelopment = environment === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define custom colors for log levels
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add custom colors to winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console(),
  
  // Error log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  
  // All logs file
  new winston.transports.File({ 
    filename: 'logs/all.log' 
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
