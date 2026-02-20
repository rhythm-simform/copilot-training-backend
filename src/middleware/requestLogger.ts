import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Request logging middleware
 * Logs all incoming requests with method, URL, and execution time
 * Format: [METHOD] /endpoint - Execution time: Xms
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Record the start time
  const startTime = Date.now();

  // Listen to the 'finish' event to log after response is sent
  res.on('finish', () => {
    // Calculate execution time
    const executionTime = Date.now() - startTime;

    // Log the request
    logger.http(
      `[${req.method}] ${req.originalUrl || req.url} - Execution time: ${executionTime}ms`
    );
  });

  next();
};
