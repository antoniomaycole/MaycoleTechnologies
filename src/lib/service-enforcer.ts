/**
 * Service Initializer with Enforcer Pattern
 *
 * This module enforces safe, non-blocking initialization of external services.
 * Each service has graceful fallback handling.
 */

type ServiceName = 'sentry' | 'stripe' | 'analytics' | 'pwa' | 'sw';

interface InitResult {
  service: ServiceName;
  success: boolean;
  error?: string;
  duration: number;
}

const results: InitResult[] = [];

/**
 * ENFORCER: Safely import a module dynamically
 */
const safeImport = async <T = Record<string, any>>(
  importFn: () => Promise<T>,
  name: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    const module = await importFn();
    return module as T;
  } catch (error) {
    console.warn(`[${name}] Optional module not found or failed:`, error);
    return fallback;
  }
};

/**
 * ENFORCER: Initialize services with timeout protection
 */
const initService = async (
  name: ServiceName,
  fn: () => Promise<void> | void,
  timeout: number = 3000
): Promise<InitResult> => {
  const start = performance.now();

  try {
    const promise = Promise.resolve(fn());

    // Wrap with timeout to prevent hanging
    await Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
    ]);

    const duration = performance.now() - start;
    console.log(`[${name}] ✓ initialized (${duration.toFixed(0)}ms)`);

    return { service: name, success: true, duration };
  } catch (error) {
    const duration = performance.now() - start;
    console.warn(`[${name}] ✗ failed (${duration.toFixed(0)}ms):`, error);

    return {
      service: name,
      success: false,
      error: String(error),
      duration,
    };
  }
};

/**
 * ENFORCER: Initialize all services in parallel with timeout protection
 */
export const initializeAllServices = async (): Promise<InitResult[]> => {
  console.log('[Services] Starting initialization...');

  // Initialize in parallel for speed
  const initPromises = [];

  // Sentry - Error tracking (most critical)
  initPromises.push(
    initService(
      'sentry',
      async () => {
        const sentry = await safeImport(() => import('./sentry'), 'sentry');
        if (sentry?.initSentry) {
          sentry.initSentry();
        }
      },
      2000
    )
  );

  // Stripe - Payment processing
  initPromises.push(
    initService(
      'stripe',
      async () => {
        const stripe = await safeImport(() => import('./stripe-config'), 'stripe');
        if (stripe?.initStripe) {
          await stripe.initStripe();
        }
      },
      2000
    )
  );

  // Analytics - Tracking
  initPromises.push(
    initService(
      'analytics',
      async () => {
        const analytics = await safeImport(() => import('./analytics'), 'analytics');
        if (analytics?.initializeAnalytics) {
          analytics.initializeAnalytics();
          if (analytics?.initScrollTracking) {
            analytics.initScrollTracking();
          }
        }
      },
      2000
    )
  );

  // Click Tracking - Event tracking
  initPromises.push(
    initService(
      'analytics',
      async () => {
        const tracker = await safeImport(() => import('./analytics-tracker'), 'analytics-tracker');
        if (tracker?.initializeAnalytics) {
          tracker.initializeAnalytics({
            enableRemoteTracking: true,
            remoteEndpoint: '/api/analytics',
            samplingRate: 1,
          });
        }
      },
      2000
    )
  );

  // PWA - Progressive web app features
  initPromises.push(
    initService(
      'pwa',
      async () => {
        const pwa = await safeImport(() => import('./pwa'), 'pwa');
        if (pwa?.initPWA) {
          pwa.initPWA();
        }
      },
      2000
    )
  );

  // Service Worker - Caching & offline support
  initPromises.push(
    initService(
      'sw',
      async () => {
        if ('serviceWorker' in navigator && 'caches' in window) {
          try {
            const reg = await navigator.serviceWorker.register('/sw.js', {
              scope: '/',
            });
            console.log('[sw] Registered:', reg.scope);
          } catch (e) {
            console.warn('[sw] Registration failed:', e);
          }
        }
      },
      3000
    )
  );

  // Wait for all (don't block on failures)
  const serviceResults = await Promise.all(initPromises);

  // Report summary
  const successful = serviceResults.filter((r) => r.success).length;
  const failed = serviceResults.filter((r) => !r.success).length;

  console.log(
    `[Services] Complete: ${successful} success, ${failed} failed ` +
      `(${Math.round(Math.max(...serviceResults.map((r) => r.duration)))}ms total)`
  );

  return serviceResults;
};

/**
 * ENFORCER: Online/Offline monitoring setup
 */
export const setupOnlineMonitoring = (): (() => void) => {
  try {
    // Try to setup online monitoring if available
    const setupOffline = async () => {
      try {
        const pwa = await safeImport(() => import('./pwa'), 'pwa');
        if (pwa?.onOnlineStatusChange) {
          return pwa.onOnlineStatusChange((online: boolean) => {
            console.log('[PWA] Status:', online ? 'online' : 'offline');
          });
        }
      } catch (e) {
        return () => {};
      }
    };

    let unsubscribe = () => {};
    setupOffline().then((fn) => {
      if (fn) unsubscribe = fn;
    });

    return () => unsubscribe();
  } catch (e) {
    console.warn('[PWA] Online monitoring not available');
    return () => {};
  }
};

/**
 * ENFORCER: PWA install prompt handler
 */
export const setupPWAInstallPrompt = (): void => {
  let deferredPrompt: any;

  if ('onbeforeinstallprompt' in window) {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      const event = e as any;
      event.preventDefault();
      deferredPrompt = event;
      console.log('[PWA] Install prompt available');
    });
  }

  (window as any).installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      deferredPrompt = null;
    }
  };
};

/**
 * ENFORCER: Get initialization status
 */
export const getInitStatus = (): InitResult[] => results;

export default {
  initializeAllServices,
  setupOnlineMonitoring,
  setupPWAInstallPrompt,
  getInitStatus,
};
