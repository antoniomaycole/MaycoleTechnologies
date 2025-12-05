/**
 * Enhanced Error Handling Middleware
 * Comprehensive error handling, logging, and recovery
 */

import { NextApiRequest, NextApiResponse } from 'next';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class ApiError extends Error {
  constructor(
    public statusCode: number = 500,
    public message: string = 'Internal Server Error',
    public code: string = 'INTERNAL_ERROR',
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  public toJSON() {
    return {
      error: {
        statusCode: this.statusCode,
        message: this.message,
        code: this.code,
        severity: this.severity,
        timestamp: new Date().toISOString(),
        ...(this.details && { details: this.details }),
      },
    };
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, 'VALIDATION_ERROR', ErrorSeverity.LOW, details);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR', ErrorSeverity.MEDIUM);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(403, message, 'AUTHORIZATION_ERROR', ErrorSeverity.MEDIUM);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND', ErrorSeverity.LOW);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(409, message, 'CONFLICT', ErrorSeverity.LOW);
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter: number = 60) {
    super(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED', ErrorSeverity.LOW, {
      retryAfter,
    });
  }
}

export class InternalError extends ApiError {
  constructor(message: string = 'Internal Server Error', details?: Record<string, any>) {
    super(500, message, 'INTERNAL_ERROR', ErrorSeverity.HIGH, details);
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(service: string = 'Service') {
    super(
      503,
      `${service} is temporarily unavailable`,
      'SERVICE_UNAVAILABLE',
      ErrorSeverity.CRITICAL
    );
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleError(error, req, res);
    }
  };
}

/**
 * Handle errors and send appropriate response
 */
export function handleError(error: unknown, req: NextApiRequest, res: NextApiResponse): void {
  // Log error
  logError(error, req);

  // Handle ApiError
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  // Handle standard Error
  if (error instanceof Error) {
    const apiError = new InternalError(
      error.message,
      process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
    );
    return res.status(500).json(apiError.toJSON());
  }

  // Handle unknown error
  const unknownError = new InternalError(
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? { error: String(error) } : undefined
  );
  res.status(500).json(unknownError.toJSON());
}

/**
 * Log error with context
 */
export function logError(error: unknown, req: NextApiRequest): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.url;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  let errorInfo = '';

  if (error instanceof ApiError) {
    errorInfo = `[${timestamp}] ${method} ${path} - ${error.code} (${error.statusCode}) - ${error.message}`;
  } else if (error instanceof Error) {
    errorInfo = `[${timestamp}] ${method} ${path} - ${error.name}: ${error.message}`;
  } else {
    errorInfo = `[${timestamp}] ${method} ${path} - Unknown error: ${String(error)}`;
  }

  console.error(`${errorInfo} [IP: ${ip}]`);

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production' && error instanceof Error) {
    // Example: Sentry.captureException(error);
  }
}

/**
 * Safe async wrapper
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) onError(err);
    return null;
  }
}

/**
 * Safe sync wrapper
 */
export function safeSync<T>(fn: () => T, onError?: (error: Error) => void): T | null {
  try {
    return fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) onError(err);
    return null;
  }
}

/**
 * Async error boundary
 */
export class AsyncErrorBoundary {
  private errors: Error[] = [];
  private maxErrors: number;

  constructor(maxErrors: number = 100) {
    this.maxErrors = maxErrors;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.captureError(err);
      return null;
    }
  }

  private captureError(error: Error): void {
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }
  }

  public getErrors(): Error[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

/**
 * Create safe API handler
 */
export function createSafeHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return errorHandler(handler);
}

/**
 * Validate request body
 */
export function validateBody<T>(
  req: NextApiRequest,
  schema: (body: any) => { valid: boolean; errors?: Record<string, string> }
): T {
  const result = schema(req.body);

  if (!result.valid) {
    throw new ValidationError('Invalid request body', result.errors);
  }

  return req.body as T;
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(req: NextApiRequest, requiredParams: string[]): T {
  const missing = requiredParams.filter((param) => !req.query[param]);

  if (missing.length > 0) {
    throw new ValidationError('Missing required query parameters', {
      missing,
    });
  }

  return req.query as any as T;
}
