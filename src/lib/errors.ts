import { logger } from './logger';

/**
 * Custom error types for the app
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: string) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: string) {
    super(message, 'AUTH_ERROR', 401, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: string) {
    super(message, 'AUTHZ_ERROR', 403, context);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: string) {
    super(message, 'NOT_FOUND', 404, context);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: string) {
    super(message, 'CONFLICT', 409, context);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', context?: string) {
    super(message, 'RATE_LIMIT', 429, context);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed', context?: string) {
    super(message, 'NETWORK_ERROR', 0, context);
    this.name = 'NetworkError';
  }
}

/**
 * Error handler utility
 */
export function handleError(error: unknown, context: string = 'Unknown'): AppError {
  if (error instanceof AppError) {
    logger.error(`App Error: ${error.message}`, context, {
      code: error.code,
      statusCode: error.statusCode,
    });
    return error;
  }

  if (error instanceof Error) {
    logger.error(`Error: ${error.message}`, context, { stack: error.stack });
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, context);
  }

  const message = String(error);
  logger.error(`Unknown Error: ${message}`, context, error);
  return new AppError(message, 'UNKNOWN_ERROR', 500, context);
}

/**
 * Safe async error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context: string = 'Unknown',
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
}

/**
 * Safe sync error handling
 */
export function safeSync<T>(fn: () => T, context: string = 'Unknown', fallback?: T): T | undefined {
  try {
    return fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
}

/**
 * Format error for user display
 */
export function formatErrorMessage(error: AppError | Error): string {
  if (error instanceof AppError) {
    // Map error codes to user-friendly messages
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Please check your input and try again.',
      AUTH_ERROR: 'Please log in to continue.',
      AUTHZ_ERROR: 'You do not have permission to perform this action.',
      NOT_FOUND: 'The requested resource was not found.',
      CONFLICT: 'This action conflicts with existing data.',
      RATE_LIMIT: 'Too many requests. Please try again later.',
      NETWORK_ERROR: 'Network connection failed. Please check your connection.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    };

    return messages[error.code] || error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Error boundary for React components
 */
export function createErrorHandler(context: string) {
  return {
    handle: (error: unknown) => handleError(error, context),
    format: (error: unknown) => {
      const appError =
        error instanceof AppError ? error : new AppError(String(error), 'UNKNOWN', 500);
      return formatErrorMessage(appError);
    },
  };
}
