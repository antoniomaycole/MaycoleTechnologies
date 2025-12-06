/**
 * Performance Analyzer Service
 * Real-time monitoring and optimization suggestions
 * Integrates with AI bot for automated optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  recommendation?: string;
}

interface WebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
  FCP: number; // First Contentful Paint
}

interface OptimizationReport {
  timestamp: Date;
  metrics: PerformanceMetric[];
  webVitals: WebVitals;
  score: number; // 0-100
  suggestions: string[];
  bottlenecks: string[];
}

export class PerformanceAnalyzer {
  private metrics: PerformanceMetric[] = [];
  private webVitals: Partial<WebVitals> = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
    this.measureInitialMetrics();
  }

  /**
   * Initialize performance observer
   */
  private initializeObserver(): void {
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe various performance entry types
      this.observer.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'resource'],
        buffered: true,
      });

      console.log('[Performance] Observer initialized');
    } catch (error) {
      console.warn('[Performance] Observer not supported:', error);
    }
  }

  /**
   * Process performance entries
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    if (entry.entryType === 'paint') {
      const paintEntry = entry as PerformancePaintTiming;
      if (paintEntry.name === 'first-contentful-paint') {
        this.webVitals.FCP = paintEntry.startTime;
      }
    } else if (entry.entryType === 'largest-contentful-paint') {
      const lcpEntry = entry as any;
      this.webVitals.LCP = lcpEntry.renderTime || lcpEntry.loadTime;
    } else if (entry.entryType === 'first-input') {
      const fidEntry = entry as any;
      this.webVitals.FID = fidEntry.processingDuration;
    } else if (entry.entryType === 'layout-shift') {
      const clsEntry = entry as any;
      this.webVitals.CLS = (this.webVitals.CLS || 0) + clsEntry.value;
    }
  }

  /**
   * Measure initial metrics
   */
  private measureInitialMetrics(): void {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (perfData) {
      this.webVitals.TTFB = perfData.responseStart - perfData.requestStart;

      // Calculate metrics
      const metrics: PerformanceMetric[] = [
        {
          name: 'DOM Interactive',
          value: perfData.domInteractive - perfData.fetchStart,
          threshold: 2000,
          status: this.getStatus(perfData.domInteractive - perfData.fetchStart, 2000),
        },
        {
          name: 'DOM Content Loaded',
          value: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          threshold: 2500,
          status: this.getStatus(perfData.domContentLoadedEventEnd - perfData.fetchStart, 2500),
        },
        {
          name: 'Page Load Time',
          value: perfData.loadEventEnd - perfData.fetchStart,
          threshold: 3000,
          status: this.getStatus(perfData.loadEventEnd - perfData.fetchStart, 3000),
        },
        {
          name: 'Resource Count',
          value: performance.getEntriesByType('resource').length,
          threshold: 50,
          status: this.getStatus(performance.getEntriesByType('resource').length, 50),
        },
      ];

      this.metrics = metrics;
      console.log('[Performance] Initial metrics:', metrics);
    }
  }

  /**
   * Get performance status
   */
  private getStatus(value: number, threshold: number): 'good' | 'warning' | 'critical' {
    if (value <= threshold * 0.8) return 'good';
    if (value <= threshold) return 'warning';
    return 'critical';
  }

  /**
   * Analyze bundle size
   */
  async analyzeBundleSize(): Promise<PerformanceMetric[]> {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      const bundleMetrics: PerformanceMetric[] = [];

      // Analyze JS bundles
      const jsResources = resources.filter((r) => r.name.includes('.js'));
      const jsSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      bundleMetrics.push({
        name: 'Total JS Size',
        value: jsSize / 1024, // Convert to KB
        threshold: 300, // 300 KB
        status: this.getStatus(jsSize, 300 * 1024),
        recommendation: jsSize > 300 * 1024 ? 'Consider code splitting or minification' : undefined,
      });

      // Analyze CSS
      const cssResources = resources.filter((r) => r.name.includes('.css'));
      const cssSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      bundleMetrics.push({
        name: 'Total CSS Size',
        value: cssSize / 1024, // Convert to KB
        threshold: 100, // 100 KB
        status: this.getStatus(cssSize, 100 * 1024),
      });

      return bundleMetrics;
    } catch (error) {
      console.error('[Performance] Error analyzing bundles:', error);
      return [];
    }
  }

  /**
   * Analyze network performance
   */
  async analyzeNetworkPerformance(): Promise<PerformanceMetric[]> {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      const slowResources = resources.filter((r) => r.duration > 1000);
      const avgDuration = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;

      return [
        {
          name: 'Average Resource Load Time',
          value: avgDuration,
          threshold: 500,
          status: this.getStatus(avgDuration, 500),
          recommendation: avgDuration > 500 ? 'Optimize resource delivery or use CDN' : undefined,
        },
        {
          name: 'Slow Resources',
          value: slowResources.length,
          threshold: 5,
          status: this.getStatus(slowResources.length, 5),
        },
      ];
    } catch (error) {
      console.error('[Performance] Error analyzing network:', error);
      return [];
    }
  }

  /**
   * Analyze memory usage
   */
  async analyzeMemoryUsage(): Promise<PerformanceMetric[]> {
    try {
      if (!(performance as any).memory) {
        return [];
      }

      const memory = (performance as any).memory;
      return [
        {
          name: 'Memory Used',
          value: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
          threshold: 50, // 50 MB
          status: this.getStatus(memory.usedJSHeapSize, 50 * 1024 * 1024),
          recommendation:
            memory.usedJSHeapSize > 50 * 1024 * 1024
              ? 'Memory usage is high - check for memory leaks'
              : undefined,
        },
      ];
    } catch (error) {
      console.error('[Performance] Error analyzing memory:', error);
      return [];
    }
  }

  /**
   * Generate comprehensive report
   */
  async generateReport(): Promise<OptimizationReport> {
    const bundleMetrics = await this.analyzeBundleSize();
    const networkMetrics = await this.analyzeNetworkPerformance();
    const memoryMetrics = await this.analyzeMemoryUsage();

    const allMetrics = [...this.metrics, ...bundleMetrics, ...networkMetrics, ...memoryMetrics];

    // Calculate overall score
    const score = this.calculateScore(allMetrics);

    // Generate suggestions
    const suggestions = this.generateSuggestions(allMetrics);

    // Identify bottlenecks
    const bottlenecks = allMetrics
      .filter((m) => m.status === 'critical')
      .map((m) => m.name);

    const report: OptimizationReport = {
      timestamp: new Date(),
      metrics: allMetrics,
      webVitals: this.webVitals as WebVitals,
      score,
      suggestions,
      bottlenecks,
    };

    console.log('[Performance] Report generated:', report);
    return report;
  }

  /**
   * Calculate performance score
   */
  private calculateScore(metrics: PerformanceMetric[]): number {
    const goodCount = metrics.filter((m) => m.status === 'good').length;
    const warningCount = metrics.filter((m) => m.status === 'warning').length;
    const criticalCount = metrics.filter((m) => m.status === 'critical').length;

    const score = (goodCount * 100 + warningCount * 50 + criticalCount * 0) / metrics.length;
    return Math.round(score);
  }

  /**
   * Generate optimization suggestions
   */
  private generateSuggestions(metrics: PerformanceMetric[]): string[] {
    const suggestions: string[] = [];

    metrics.forEach((metric) => {
      if (metric.recommendation) {
        suggestions.push(`${metric.name}: ${metric.recommendation}`);
      }

      if (metric.status === 'critical') {
        if (metric.name.includes('Load Time')) {
          suggestions.push('Implement lazy loading and code splitting');
        }
        if (metric.name.includes('Size')) {
          suggestions.push('Enable gzip compression and minification');
        }
        if (metric.name.includes('Memory')) {
          suggestions.push('Investigate memory leaks and optimize data structures');
        }
      }
    });

    // Add general optimization suggestions
    suggestions.push('Enable HTTP/2 push for critical resources');
    suggestions.push('Implement service worker for offline support');
    suggestions.push('Use modern image formats (WebP)');
    suggestions.push('Implement resource prefetching');

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Get metrics for specific category
   */
  getMetrics(category: 'all' | 'bundle' | 'network' | 'memory' = 'all'): PerformanceMetric[] {
    if (category === 'all') return this.metrics;
    // Can be extended for specific categories
    return this.metrics;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton instance
let instance: PerformanceAnalyzer | null = null;

export function getPerformanceAnalyzer(): PerformanceAnalyzer {
  if (!instance) {
    instance = new PerformanceAnalyzer();
  }
  return instance;
}

export type { PerformanceMetric, WebVitals, OptimizationReport };
