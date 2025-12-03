/**
 * Analytics Tracking System
 * 
 * Tracks every click, interaction, and page view
 * Provides visitor metrics without requiring email capture
 * Records user behavior patterns for conversion optimization
 */

import { useEffect, useCallback, useRef } from 'react';

interface AnalyticsEvent {
  type: 'click' | 'view' | 'scroll' | 'form_start' | 'form_submit' | 'error' | 'engagement' | 'payment';
  target: string;
  section?: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface AnalyticsConfig {
  trackingId?: string;
  enableLocalStorage?: boolean;
  enableRemoteTracking?: boolean;
  remoteEndpoint?: string;
  samplingRate?: number; // 0-1, for sampling subset of events
}

class AnalyticsTracker {
  private sessionId: string;
  private userId: string | null;
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;
  private pageStartTime: number;
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      enableLocalStorage: true,
      enableRemoteTracking: true,
      samplingRate: 1, // Track all events
      ...config,
    };

    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();
    this.userId = this.getUserId();
    this.pageStartTime = Date.now();

    this.initializeTracking();
  }

  private getOrCreateSessionId(): string {
    const key = 'analytics_session_id';
    let sessionId = sessionStorage.getItem(key);

    if (!sessionId) {
      sessionId = this.generateId('session_');
      sessionStorage.setItem(key, sessionId);
    }

    return sessionId;
  }

  private getUserId(): string | null {
    const key = 'analytics_user_id';
    let userId = localStorage.getItem(key);

    if (!userId) {
      userId = this.generateId('user_');
      if (this.config.enableLocalStorage) {
        localStorage.setItem(key, userId);
      }
    }

    return userId;
  }

  private generateId(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2);
    return `${prefix}${timestamp}${random}`;
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page view
    this.trackEvent('view', 'page', {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Track all clicks
    this.setupClickTracking();

    // Track scroll depth
    this.setupScrollTracking();

    // Track visibility changes
    this.setupVisibilityTracking();

    // Setup batch flushing
    this.setupBatchFlushing();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  private setupClickTracking(): void {
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickTarget = this.getElementIdentifier(target);

      if (clickTarget) {
        this.trackEvent('click', clickTarget, {
          x: event.clientX,
          y: event.clientY,
          elementType: target.tagName,
          elementClass: target.className,
          elementId: target.id,
          text: this.truncateText(target.textContent || '', 100),
        });
      }
    }, true); // Use capture phase to catch all clicks
  }

  private setupScrollTracking(): void {
    let scrollTimeout: NodeJS.Timeout | null = null;

    window.addEventListener('scroll', () => {
      const scrollPercentage = this.getScrollDepth();

      if (scrollPercentage > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercentage;

        // Track milestones: 25%, 50%, 75%, 100%
        if (
          scrollPercentage >= 25 ||
          scrollPercentage >= 50 ||
          scrollPercentage >= 75 ||
          scrollPercentage >= 100
        ) {
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            this.trackEvent('scroll', 'page', {
              depth: scrollPercentage,
              milestone: Math.floor(scrollPercentage / 25) * 25,
            });
          }, 500); // Debounce
        }
      }
    });
  }

  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      const event = document.hidden ? 'blur' : 'focus';
      this.trackEvent('engagement', event, {
        visible: !document.hidden,
        timeOnPage: Date.now() - this.pageStartTime,
      });
    });
  }

  private setupBatchFlushing(): void {
    this.flushTimer = setInterval(() => {
      if (this.events.length >= this.batchSize / 2) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private getElementIdentifier(element: HTMLElement): string {
    // Try to get unique identifier
    if (element.id) return `#${element.id}`;
    if (element.name) return `[name="${element.name}"]`;

    // Build selector from class or tag
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }

    // Check if parent has identifying info
    if (element.parentElement) {
      const parentId = this.getElementIdentifier(element.parentElement);
      return `${parentId} > ${selector}`;
    }

    return selector;
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  private getScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const totalScroll = documentHeight - windowHeight;
    const percentage = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;

    return Math.min(Math.round(percentage), 100);
  }

  public trackEvent(
    type: AnalyticsEvent['type'],
    target: string,
    metadata?: Record<string, any>
  ): void {
    // Sampling: skip event if random number exceeds sampling rate
    if (Math.random() > (this.config.samplingRate || 1)) {
      return;
    }

    const event: AnalyticsEvent = {
      type,
      target,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      metadata,
    };

    this.events.push(event);

    // Auto-flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flush();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }

  public trackFormStart(formName: string): void {
    this.trackEvent('form_start', formName, {
      timestamp: Date.now(),
    });
  }

  public trackFormSubmit(formName: string, isSuccess: boolean): void {
    this.trackEvent('form_submit', formName, {
      success: isSuccess,
      timeSpent: Date.now() - this.pageStartTime,
    });
  }

  public trackError(errorMessage: string, context?: Record<string, any>): void {
    this.trackEvent('error', 'error', {
      message: errorMessage,
      ...context,
    });
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (this.config.enableLocalStorage) {
      localStorage.setItem('analytics_user_id', userId);
    }
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    // Store locally
    if (this.config.enableLocalStorage) {
      this.storeEventsLocally(eventsToSend);
    }

    // Send remotely
    if (this.config.enableRemoteTracking && this.config.remoteEndpoint) {
      await this.sendEventsRemote(eventsToSend);
    }
  }

  private storeEventsLocally(events: AnalyticsEvent[]): void {
    try {
      const key = `analytics_events_${Date.now()}`;
      const data = JSON.stringify(events);
      localStorage.setItem(key, data);

      // Keep only last 100 event batches
      const allKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('analytics_events_')
      );
      if (allKeys.length > 100) {
        allKeys.slice(0, allKeys.length - 100).forEach(key =>
          localStorage.removeItem(key)
        );
      }
    } catch (error) {
      console.error('Failed to store events locally:', error);
    }
  }

  private async sendEventsRemote(events: AnalyticsEvent[]): Promise<void> {
    try {
      const response = await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
        }),
        keepalive: true, // Ensure request completes even if page closes
      });

      if (!response.ok) {
        throw new Error(`Analytics endpoint returned ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send events remotely:', error);
      // Fall back to local storage
      this.storeEventsLocally(events);
    }
  }

  public getSessionMetrics(): {
    sessionId: string;
    userId: string | null;
    timeOnPage: number;
    maxScrollDepth: number;
    totalEvents: number;
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      timeOnPage: Date.now() - this.pageStartTime,
      maxScrollDepth: this.maxScrollDepth,
      totalEvents: this.events.length,
    };
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Global instance
let analyticsInstance: AnalyticsTracker | null = null;

export function initializeAnalytics(config?: AnalyticsConfig): AnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker(config);
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker();
  }
  return analyticsInstance;
}

// React Hook
export function useAnalytics() {
  const trackerRef = useRef<AnalyticsTracker | null>(null);

  useEffect(() => {
    trackerRef.current = initializeAnalytics({
      enableRemoteTracking: true,
      remoteEndpoint: '/api/analytics',
    });

    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
      }
    };
  }, []);

  const trackEvent = useCallback((
    type: AnalyticsEvent['type'],
    target: string,
    metadata?: Record<string, any>
  ) => {
    trackerRef.current?.trackEvent(type, target, metadata);
  }, []);

  const trackFormStart = useCallback((formName: string) => {
    trackerRef.current?.trackFormStart(formName);
  }, []);

  const trackFormSubmit = useCallback((formName: string, isSuccess: boolean) => {
    trackerRef.current?.trackFormSubmit(formName, isSuccess);
  }, []);

  return {
    trackEvent,
    trackFormStart,
    trackFormSubmit,
  };
}

export type { AnalyticsEvent, AnalyticsConfig };
export default AnalyticsTracker;
