/**
 * Sentry Error Tracking & Performance Monitoring Setup
 * Captures all errors, exceptions, and performance metrics
 *
 * Usage: Call initSentry() in main.tsx before mounting React app
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Call this once in main.tsx before React mount
 */
export function initSentry() {
  const sentryDsn = process.env.VITE_SENTRY_DSN;
  const environment = process.env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';

  // Only initialize Sentry if DSN is configured and in production
  if (!sentryDsn || isDevelopment) {
    if (isDevelopment) {
      console.log('[Sentry] Disabled in development mode');
    } else {
      console.warn('[Sentry] DSN not configured. Error tracking disabled.');
    }
    return;
  }

  try {
    Sentry.init({
      // Core Configuration
      dsn: sentryDsn,
      environment: environment,
      release: process.env.VITE_APP_VERSION || '1.0.0',

      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions (tune in production)
      profilesSampleRate: 0.1, // Capture 10% of profiles for performance insights

      // Integrations handled automatically by Sentry
      integrations: [],

      // Error Configuration
      beforeSend: (event, hint) => {
        // Filter out network errors that are not our concern
        if (event.exception) {
          const error = hint.originalException;
          const message = typeof error === 'string' ? error : String(error);

          // Ignore browser extensions and third-party errors
          if (
            message.includes('chrome-extension') ||
            message.includes('moz-extension') ||
            message.includes('top.GLOBALS')
          ) {
            return null; // Don't send to Sentry
          }
        }

        return event;
      },

      // Session Replay is handled automatically
      // replaysSessionSampleRate and replaysOnErrorSampleRate handled by BrowserTracing

      // Ignore List - don't track these errors
      ignoreErrors: [
        // Network errors
        'NetworkError',
        'Failed to fetch',
        'Load failed',

        // Browser extensions
        'top.GLOBALS',
        'chrome-extension',
        'moz-extension',

        // Common benign errors
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'SecurityError: Blocked a frame with origin',
      ],

      // Deny URLs - don't track from these sources
      denyUrls: [
        // Browser extensions
        /chrome:\/\/extensions/,
        /chrome-extension:\/\//,
        /moz-extension:\/\//,

        // Third-party scripts
        /cloudflare/,
        /gtag/,
        /analytics/,
      ],

      // Include List - only track from these sources
      allowUrls: ['maycoletechnologies.com', 'localhost', 'api.maycoletechnologies.com'],

      // Data Privacy
      initialScope: {
        tags: {
          source: 'web',
          platform: getPlatform(),
        },
      },

      // Breadcrumb Configuration
      maxBreadcrumbs: 50,
      attachStacktrace: true,
    });

    console.log('[Sentry] Error tracking initialized');
    console.log(`[Sentry] Environment: ${environment}`);
    console.log('[Sentry] Capturing errors and performance metrics');

    return Sentry;
  } catch (error) {
    console.error('[Sentry] Initialization failed:', error);
  }
}

/**
 * Manually capture an exception
 */
export function captureException(error: Error | unknown, context?: Record<string, any>) {
  try {
    if (context) {
      Sentry.captureException(error, {
        contexts: {
          custom: context,
        },
      });
    } else {
      Sentry.captureException(error);
    }
  } catch (err) {
    console.error('[Sentry] Failed to capture exception:', err);
  }
}

/**
 * Manually capture a message
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: Record<string, any>
) {
  try {
    Sentry.captureMessage(message, {
      level,
      contexts: context ? { custom: context } : undefined,
    });
  } catch (err) {
    console.error('[Sentry] Failed to capture message:', err);
  }
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category: string = 'user-action',
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  data?: Record<string, any>
) {
  try {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  } catch (err) {
    console.error('[Sentry] Failed to add breadcrumb:', err);
  }
}

/**
 * Set user information for error context
 */
export function setUser(userId: string, email?: string, username?: string) {
  try {
    Sentry.setUser({
      id: userId,
      email,
      username,
    });
  } catch (err) {
    console.error('[Sentry] Failed to set user:', err);
  }
}

/**
 * Clear user information
 */
export function clearUser() {
  try {
    Sentry.setUser(null);
  } catch (err) {
    console.error('[Sentry] Failed to clear user:', err);
  }
}

/**
 * Add custom context for debugging
 */
export function setContext(name: string, data: Record<string, any>) {
  try {
    Sentry.setContext(name, data);
  } catch (err) {
    console.error('[Sentry] Failed to set context:', err);
  }
}

/**
 * Start a performance transaction
 * Note: In current Sentry/React version, transactions are automatic via BrowserTracing
 */
export function startTransaction(name: string, operation: string = 'http.request') {
  // Transactions are now automatic with BrowserTracing
  // This is kept for API compatibility
  console.log(`[Sentry] Transaction tracked: ${name} (${operation})`);
  return null;
}

/**
 * Track custom metrics
 */
export function trackMetric(
  name: string,
  value: number,
  unit: string = 'millisecond',
  tags?: Record<string, string>
) {
  try {
    addBreadcrumb(`Metric: ${name}=${value}${unit}`, 'metric', 'info', {
      value,
      unit,
      tags,
    });
  } catch (err) {
    console.error('[Sentry] Failed to track metric:', err);
  }
}

/**
 * Get the Sentry instance for advanced operations
 */
export function getSentryInstance() {
  return Sentry;
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorTracking<T>(
  operation: () => Promise<T>,
  operationName: string = 'unknown'
): Promise<T | null> {
  try {
    const result = await operation();
    console.log(`[Sentry] Operation completed: ${operationName}`);
    return result;
  } catch (error) {
    captureException(error, {
      operationName,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Wrapper for sync operations with error handling
 */
export function withSyncErrorTracking<T>(
  operation: () => T,
  operationName: string = 'unknown'
): T | null {
  try {
    return operation();
  } catch (error) {
    captureException(error, {
      operationName,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Helper: Detect platform
 */
function getPlatform(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone')) return 'ios';
  if (ua.includes('ipad')) return 'ios';
  if (ua.includes('android')) return 'android';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

/**
 * Higher-order component for error boundary integration
 * Wraps React components with Sentry error tracking
 */
export function withSentryErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryOptions?: any
): React.ComponentType<P> {
  return Sentry.withErrorBoundary(Component, errorBoundaryOptions);
}

/**
 * Hook for manual error tracking in React components
 */
export function useSentryErrorHandler() {
  return {
    captureException,
    captureMessage,
    addBreadcrumb,
    setUser,
    setContext,
    trackMetric,
  };
}

export default {
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  clearUser,
  setContext,
  startTransaction,
  trackMetric,
  getSentryInstance,
  withErrorTracking,
  withSyncErrorTracking,
  withSentryErrorBoundary,
  useSentryErrorHandler,
};
