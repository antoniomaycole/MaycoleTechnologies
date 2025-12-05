/**
 * Rate Limiting & Throttling Middleware
 * Prevent abuse and ensure fair API usage
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: NextApiRequest) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for development, use Redis in production)
const inMemoryStore: RateLimitStore = {};

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs = 60000, // 1 minute default
    maxRequests = 100,
    message = 'Too many requests, please try again later',
    statusCode = 429,
    keyGenerator,
  } = config;

  return function rateLimitMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    next?: () => void
  ) {
    // Generate key from IP, user ID, or custom function
    const key = keyGenerator
      ? keyGenerator(req)
      : (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    const now = Date.now();
    const store = inMemoryStore[key] || { count: 0, resetTime: now + windowMs };

    // Reset counter if window has passed
    if (now > store.resetTime) {
      store.count = 1;
      store.resetTime = now + windowMs;
    } else {
      store.count++;
    }

    inMemoryStore[key] = store;

    // Add rate limit info to response headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store.count));
    res.setHeader('X-RateLimit-Reset', new Date(store.resetTime).toISOString());

    // Check if limit exceeded
    if (store.count > maxRequests) {
      return res.status(statusCode).json({
        error: message,
        retryAfter: Math.ceil((store.resetTime - now) / 1000),
      });
    }

    if (next) next();
  };
}

/**
 * Throttle decorator for API endpoints
 */
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  config?: Partial<RateLimitConfig>
) {
  const limiter = createRateLimiter({
    windowMs: config?.windowMs || 60000,
    maxRequests: config?.maxRequests || 100,
    ...config,
  });

  return async (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise<void>((resolve) => {
      limiter(req, res, async () => {
        try {
          await handler(req, res);
          resolve();
        } catch (error) {
          console.error('[Rate Limit] Handler error:', error);
          res.status(500).json({ error: 'Internal server error' });
          resolve();
        }
      });
    });
  };
}

/**
 * Throttle function with delay
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function with delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Batch API requests to prevent overwhelming server
 */
export class RequestBatcher {
  private queue: Map<string, any[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private batchSize: number;
  private batchDelay: number;
  private handler: (key: string, items: any[]) => Promise<void>;

  constructor(
    batchSize: number = 10,
    batchDelay: number = 100,
    handler?: (key: string, items: any[]) => Promise<void>
  ) {
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
    this.handler = handler || (async () => {});
  }

  /**
   * Add item to batch queue
   */
  public add(key: string, item: any): Promise<void> {
    return new Promise((resolve) => {
      // Initialize queue if needed
      if (!this.queue.has(key)) {
        this.queue.set(key, []);
      }

      const queue = this.queue.get(key)!;
      queue.push({ item, resolve });

      // Clear existing timer
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key)!);
      }

      // Check if batch is full
      if (queue.length >= this.batchSize) {
        this.flush(key);
      } else {
        // Set timer for delayed batch
        const timer = setTimeout(() => this.flush(key), this.batchDelay);
        this.timers.set(key, timer);
      }
    });
  }

  /**
   * Flush batch queue
   */
  private async flush(key: string): Promise<void> {
    const queue = this.queue.get(key);
    if (!queue || queue.length === 0) return;

    // Remove from queue
    this.queue.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }

    // Process batch
    const items = queue.map((q) => q.item);
    try {
      await this.handler(key, items);
      queue.forEach((q) => q.resolve());
    } catch (error) {
      console.error('[Batcher] Error processing batch:', error);
      queue.forEach((q) => q.resolve()); // Resolve anyway to prevent hanging
    }
  }

  /**
   * Flush all pending batches
   */
  public async flushAll(): Promise<void> {
    const keys = Array.from(this.queue.keys());
    await Promise.all(keys.map((key) => this.flush(key)));
  }
}

/**
 * Circuit breaker pattern for failing APIs
 */
export class CircuitBreaker {
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold: number = 5,
    private resetTimeout: number = 60000,
    private successThreshold: number = 2
  ) {}

  /**
   * Execute function with circuit breaker protection
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should reset
    if (this.state === 'OPEN' && Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }

    // Reject if circuit is open
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN - service is unavailable');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  public getState(): string {
    return this.state;
  }

  public getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 100,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calculate exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
