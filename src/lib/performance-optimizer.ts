/**
 * AI-Driven Performance Optimization Bot
 * Monitors and optimizes Core Web Vitals, bundle size, and image performance
 * Target: #1 SEO ranking through speed optimization
 */

import * as Sentry from '@sentry/react';

// ============================================================================
// Core Web Vitals Monitoring
// ============================================================================

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (target: <2.5s)
  fid: number; // First Input Delay (target: <100ms)
  cls: number; // Cumulative Layout Shift (target: <0.1)
  inp?: number; // Interaction to Next Paint (target: <200ms)
  ttfb?: number; // Time to First Byte (target: <600ms)
}

export interface PerformanceMetrics {
  vitals: CoreWebVitals;
  bundleSize: {
    js: number;
    css: number;
    total: number;
  };
  imageMetrics: {
    totalImages: number;
    lazyLoadedImages: number;
    webpSupported: boolean;
    averageImageSize: number;
  };
  cacheMetrics: {
    cacheHitRate: number;
    serviceWorkerActive: boolean;
  };
}

let performanceMetrics: PerformanceMetrics = {
  vitals: { lcp: 0, fid: 0, cls: 0 },
  bundleSize: { js: 0, css: 0, total: 0 },
  imageMetrics: {
    totalImages: 0,
    lazyLoadedImages: 0,
    webpSupported: false,
    averageImageSize: 0,
  },
  cacheMetrics: {
    cacheHitRate: 0,
    serviceWorkerActive: false,
  },
};

/**
 * Initialize Core Web Vitals tracking
 * Uses web-vitals library or native APIs
 */
export function initCoreWebVitalsTracking(): void {
  try {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime;
        if (lcp) performanceMetrics.vitals.lcp = lcp;
        Sentry.captureMessage(`LCP: ${performanceMetrics.vitals.lcp.toFixed(2)}ms`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Monitor Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!('hadRecentInput' in entry) || !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        performanceMetrics.vitals.cls = clsValue;
        if (clsValue > 0.1) {
          Sentry.captureMessage(`⚠️ CLS exceeded: ${clsValue.toFixed(3)}`);
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }

    // Monitor First Input Delay (FID) / Interaction to Next Paint (INP)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];
        performanceMetrics.vitals.fid = (fidEntry as any).processingDuration;
        performanceMetrics.vitals.inp = (fidEntry as any).processingDuration;
      });
      fidObserver.observe({
        entryTypes: ['first-input', 'interaction'],
        buffered: true,
      });
    }

    // Monitor Time to First Byte (TTFB)
    if ('performance' in window && performance.getEntriesByType) {
      const navigationTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        performanceMetrics.vitals.ttfb = navigationTiming.responseStart;
      }
    }

    console.log('[Performance] Core Web Vitals tracking initialized');
  } catch (error) {
    console.warn('[Performance] Failed to initialize CWV tracking:', error);
    Sentry.captureException(error);
  }
}

/**
 * Report Core Web Vitals to server/analytics
 */
export function reportCoreWebVitals(): void {
  const vitals = performanceMetrics.vitals;

  const payload = {
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    lcp: vitals.lcp,
    fid: vitals.fid,
    cls: vitals.cls,
    inp: vitals.inp,
    ttfb: vitals.ttfb,
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection?.effectiveType || 'unknown',
  };

  // Send to analytics backend
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics/cwv', JSON.stringify(payload));
  } else {
    fetch('/api/metrics/cwv', {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* fail silently */
    });
  }

  console.log('[Performance] Core Web Vitals reported:', vitals);
}

// ============================================================================
// Image Optimization Tracking
// ============================================================================

/**
 * Track image optimization metrics
 */
export function trackImageMetrics(): void {
  try {
    const images = document.querySelectorAll('img');
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    performanceMetrics.imageMetrics.totalImages = images.length;
    performanceMetrics.imageMetrics.lazyLoadedImages = lazyImages.length;

    // Check WebP support
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    performanceMetrics.imageMetrics.webpSupported =
      canvas.toDataURL('image/webp').indexOf('image/webp') === 5;

    // Calculate average image size
    let totalSize = 0;
    const imagePromises: Promise<number>[] = [];

    images.forEach((img) => {
      if (img.src) {
        imagePromises.push(
          fetch(img.src, { method: 'HEAD' })
            .then((res) => parseInt(res.headers.get('content-length') || '0'))
            .catch(() => 0)
        );
      }
    });

    Promise.all(imagePromises)
      .then((sizes) => {
        totalSize = sizes.reduce((a, b) => a + b, 0);
        if (images.length > 0) {
          performanceMetrics.imageMetrics.averageImageSize = totalSize / images.length;
        }
      })
      .catch(() => {
        /* fail silently */
      });

    console.log('[Performance] Image metrics tracked:', performanceMetrics.imageMetrics);
  } catch (error) {
    console.warn('[Performance] Failed to track image metrics:', error);
  }
}

/**
 * Get image optimization recommendations
 */
export function getImageOptimizationRecommendations(): string[] {
  const recommendations: string[] = [];
  const metrics = performanceMetrics.imageMetrics;

  if (metrics.lazyLoadedImages / metrics.totalImages < 0.8) {
    recommendations.push(
      `⚠️ Only ${((metrics.lazyLoadedImages / metrics.totalImages) * 100).toFixed(0)}% of images use lazy loading (target: 100%)`
    );
  }

  if (!metrics.webpSupported) {
    recommendations.push('ℹ️ Browser supports WebP format for better compression');
  }

  if (metrics.averageImageSize > 100000) {
    recommendations.push(
      `⚠️ Average image size is ${(metrics.averageImageSize / 1000).toFixed(0)}KB (target: <50KB)`
    );
  }

  return recommendations;
}

// ============================================================================
// Bundle Analysis & Code Splitting
// ============================================================================

export interface BundleAnalysis {
  totalSize: number;
  mainBundle: number;
  vendorBundle: number;
  chunks: Array<{
    name: string;
    size: number;
    gzipSize: number;
    percentage: number;
  }>;
}

let bundleAnalysis: BundleAnalysis = {
  totalSize: 0,
  mainBundle: 0,
  vendorBundle: 0,
  chunks: [],
};

/**
 * Analyze bundle size from build output
 * Call this with build manifest data
 */
export function analyzeBundleSize(manifest: Record<string, any>): BundleAnalysis {
  const chunks: BundleAnalysis['chunks'] = [];
  let totalSize = 0;

  Object.entries(manifest).forEach(([name, data]: [string, any]) => {
    const size = data.file ? getFileSizeInBytes(name) : 0;
    totalSize += size;
    chunks.push({
      name,
      size,
      gzipSize: Math.floor(size * 0.3), // Estimate ~30% gzip ratio
      percentage: 0,
    });
  });

  // Calculate percentages
  chunks.forEach((chunk) => {
    chunk.percentage = (chunk.size / totalSize) * 100;
  });

  // Sort by size descending
  chunks.sort((a, b) => b.size - a.size);

  bundleAnalysis = {
    totalSize,
    mainBundle: chunks[0]?.size || 0,
    vendorBundle: chunks
      .filter((c) => c.name.includes('vendor'))
      .reduce((acc, c) => acc + c.size, 0),
    chunks: chunks.slice(0, 10), // Top 10 chunks
  };

  return bundleAnalysis;
}

/**
 * Get bundle optimization recommendations
 */
export function getBundleOptimizationRecommendations(): string[] {
  const recommendations: string[] = [];

  if (bundleAnalysis.totalSize > 500000) {
    recommendations.push(
      `⚠️ Total bundle size is ${(bundleAnalysis.totalSize / 1000).toFixed(0)}KB (target: <400KB gzipped)`
    );
  }

  if (bundleAnalysis.mainBundle > 300000) {
    recommendations.push(
      `⚠️ Main bundle is ${(bundleAnalysis.mainBundle / 1000).toFixed(0)}KB - consider code splitting`
    );
  }

  bundleAnalysis.chunks.forEach((chunk, i) => {
    if (i < 3 && chunk.percentage > 15) {
      recommendations.push(
        `💡 Chunk "${chunk.name}" is ${chunk.percentage.toFixed(1)}% of bundle - consider lazy loading`
      );
    }
  });

  return recommendations;
}

// ============================================================================
// Cache Strategy Optimization
// ============================================================================

export interface CacheStrategy {
  static: string[]; // CSS, JS, fonts (cache indefinitely)
  dynamic: string[]; // HTML, API (network first, fallback to cache)
  staleWhileRevalidate: string[]; // Images, SVG (serve stale, update in background)
  networkOnly: string[]; // API calls that must be fresh
}

/**
 * Get optimized cache strategy for Service Worker
 */
export function getOptimizedCacheStrategy(): CacheStrategy {
  return {
    static: [
      '.js',
      '.css',
      '.woff2',
      '.woff',
      '.ttf',
      '.eot',
      '/manifest.json',
      '/robots.txt',
      '/sitemap.xml',
    ],
    dynamic: ['/', '/index.html', '/api/content'],
    staleWhileRevalidate: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    networkOnly: ['/api/realtime', '/api/payments', '/api/auth'],
  };
}

/**
 * Generate Service Worker cache code
 */
export function generateServiceWorkerCode(): string {
  const strategy = getOptimizedCacheStrategy();

  return `
// Auto-generated cache strategy from performance-optimizer.ts
const CACHE_VERSION = 'v1-' + new Date().getTime();
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const DYNAMIC_CACHE = 'dynamic-' + CACHE_VERSION;
const STALE_CACHE = 'stale-' + CACHE_VERSION;

const STATIC_ASSETS = ${JSON.stringify(strategy.static)};
const DYNAMIC_ASSETS = ${JSON.stringify(strategy.dynamic)};
const STALE_ASSETS = ${JSON.stringify(strategy.staleWhileRevalidate)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.warn('Failed to cache static assets');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== STALE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Network only for real-time APIs
  if (${JSON.stringify(strategy.networkOnly)}.some(path => url.pathname.includes(path))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache first for static assets
  if (${JSON.stringify(strategy.static)}.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for images
  if (${JSON.stringify(strategy.staleWhileRevalidate)}.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.open(STALE_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Network first for dynamic content
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('/');
        });
      })
  );
});
`;
}

// ============================================================================
// Performance Recommendations Engine
// ============================================================================

export interface PerformanceReport {
  timestamp: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  vitals: CoreWebVitals;
  recommendations: string[];
  nextSteps: string[];
}

/**
 * Generate comprehensive performance report
 */
export function generatePerformanceReport(): PerformanceReport {
  const vitals = performanceMetrics.vitals;
  const imageRecs = getImageOptimizationRecommendations();
  const bundleRecs = getBundleOptimizationRecommendations();

  // Calculate performance score (0-100)
  let score = 100;

  // Deduct for Core Web Vitals
  if (vitals.lcp > 2500) score -= 15;
  else if (vitals.lcp > 1500) score -= 5;
  if (vitals.fid > 100) score -= 15;
  else if (vitals.fid > 50) score -= 5;
  if (vitals.cls > 0.1) score -= 15;
  else if (vitals.cls > 0.05) score -= 5;

  // Deduct for bundle size
  if (bundleAnalysis.totalSize > 500000) score -= 10;
  else if (bundleAnalysis.totalSize > 400000) score -= 5;

  // Deduct for image optimization
  if (
    performanceMetrics.imageMetrics.lazyLoadedImages / performanceMetrics.imageMetrics.totalImages <
    0.8
  )
    score -= 5;

  score = Math.max(0, score);

  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  const recommendations = [...imageRecs, ...bundleRecs];
  const nextSteps = getNextSteps(grade, recommendations);

  return {
    timestamp: new Date().toISOString(),
    grade,
    score,
    vitals,
    recommendations,
    nextSteps,
  };
}

/**
 * Get actionable next steps based on grade
 */
function getNextSteps(grade: string, recommendations: string[]): string[] {
  const steps: string[] = [];

  if (grade === 'A') {
    steps.push('✅ Excellent performance! Monitor regularly with Sentry.');
    steps.push('📊 Track metrics in Google Search Console.');
  } else if (grade === 'B') {
    steps.push('💡 Good performance. Implement image optimization to reach A grade.');
    steps.push('⚙️ Consider code splitting for large chunks.');
  } else if (grade === 'C') {
    steps.push('⚠️ Moderate performance issues detected.');
    steps.push('🔍 Priority: Reduce bundle size to <400KB gzipped.');
    steps.push('🖼️ Priority: Optimize all images (WebP, compression, lazy loading).');
  } else if (grade === 'D' || grade === 'F') {
    steps.push('🚨 CRITICAL performance issues affecting SEO ranking.');
    steps.push('1️⃣ Immediately reduce Core Web Vitals violations.');
    steps.push('2️⃣ Split large bundles into smaller chunks.');
    steps.push('3️⃣ Implement aggressive image optimization.');
    steps.push('4️⃣ Enable Service Worker caching.');
  }

  return steps;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get file size in bytes (stub - replace with actual implementation)
 */
function getFileSizeInBytes(filename: string): number {
  // This would be populated from build manifest
  // For now, returning estimated values
  const sizes: Record<string, number> = {
    main: 350000,
    vendor: 400000,
  };
  return sizes[filename] || 50000;
}

/**
 * Get current performance metrics
 */
export function getMetrics(): PerformanceMetrics {
  return performanceMetrics;
}

/**
 * Reset metrics (useful for testing)
 */
export function resetMetrics(): void {
  performanceMetrics = {
    vitals: { lcp: 0, fid: 0, cls: 0 },
    bundleSize: { js: 0, css: 0, total: 0 },
    imageMetrics: {
      totalImages: 0,
      lazyLoadedImages: 0,
      webpSupported: false,
      averageImageSize: 0,
    },
    cacheMetrics: {
      cacheHitRate: 0,
      serviceWorkerActive: false,
    },
  };
}

/**
 * Format performance report as readable string
 */
export function formatPerformanceReport(report: PerformanceReport): string {
  return `
╔══════════════════════════════════════════════════════════════════╗
║                     PERFORMANCE OPTIMIZATION REPORT              ║
╚══════════════════════════════════════════════════════════════════╝

📊 PERFORMANCE GRADE: ${report.grade} (Score: ${report.score}/100)
⏱️  TIMESTAMP: ${report.timestamp}

🎯 CORE WEB VITALS:
   • LCP (Largest Contentful Paint): ${report.vitals.lcp.toFixed(2)}ms ${
     report.vitals.lcp <= 2500 ? '✅' : report.vitals.lcp <= 3500 ? '⚠️' : '❌'
   }
   • FID (First Input Delay): ${report.vitals.fid.toFixed(2)}ms ${
     report.vitals.fid <= 100 ? '✅' : report.vitals.fid <= 200 ? '⚠️' : '❌'
   }
   • CLS (Cumulative Layout Shift): ${report.vitals.cls.toFixed(3)} ${
     report.vitals.cls <= 0.1 ? '✅' : report.vitals.cls <= 0.25 ? '⚠️' : '❌'
   }

🔧 RECOMMENDATIONS:
${report.recommendations.map((r) => `   ${r}`).join('\n')}

📋 NEXT STEPS:
${report.nextSteps.map((s) => `   ${s}`).join('\n')}

Generated by AI Performance Optimization Bot
  `;
}
