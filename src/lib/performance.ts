/**
 * Performance utility functions for the MaycoleTechnologies app
 */

/**
 * Measure performance timing of async operations
 */
export async function measurePerformance<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === 'development') {
      console.error(`[Performance] ${label} (failed): ${duration.toFixed(2)}ms`, error);
    }

    throw error;
  }
}

/**
 * Batch multiple microtasks for better performance
 */
export function batchUpdates(callback: () => void): void {
  if ('unstable_batchedUpdates' in require('react-dom')) {
    require('react-dom').unstable_batchedUpdates(callback);
  } else {
    callback();
  }
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Cache for API responses (simple in-memory cache)
 */
class ResponseCache {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes default

  set(key: string, data: unknown, ttl?: number): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    if (ttl) {
      setTimeout(() => this.cache.delete(key), ttl);
    } else {
      setTimeout(() => this.cache.delete(key), this.ttl);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ResponseCache();

/**
 * Safe JSON parse that returns null instead of throwing
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe viewport measurements
 */
export function getViewportMetrics() {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768, scrollY: 0, scrollX: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollY: window.scrollY,
    scrollX: window.scrollX,
  };
}

/**
 * Utility for creating stable event handlers
 */
export function createEventHandler<T extends (...args: unknown[]) => void>(
  handler: T,
  deps: unknown[] = []
): T {
  return handler;
}
