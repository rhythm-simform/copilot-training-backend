import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger';

interface CustomError extends Error {
  statusCode?: number;
  validationErrors?: unknown;
}

interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

/**
 * Format Zod errors into user-friendly validation error details
 */
const formatZodErrors = (zodError: ZodError): ValidationErrorDetail[] => {
  return zodError.errors.map((err) => ({
    field: err.path.join('.') || 'unknown',
    message: err.message,
    code: err.code,
  }));
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Zod validation errors with detailed messages
  if (err instanceof ZodError) {
    const validationErrors = formatZodErrors(err);
    
    logger.warn(
      `Validation Error on ${req.method} ${req.originalUrl}: ${JSON.stringify(validationErrors)}`
    );

    res.status(400).json({
      error: {
        message: 'Validation failed',
        statusCode: 400,
        validationErrors,
      },
    });
    return;
  }

  // Handle custom errors with statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error based on severity
  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${message} - ${req.method} ${req.originalUrl}`);
  } else if (statusCode >= 400) {
    logger.warn(`[${statusCode}] ${message} - ${req.method} ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};
