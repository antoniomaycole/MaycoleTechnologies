/**
 * Visitor Tracking Service
 * Tracks page views, user interactions, and session data
 */

interface VisitorSession {
  sessionId: string;
  startTime: number;
  lastActivityTime: number;
  pageViews: string[];
  referrer: string;
  userAgent: string;
  location: string;
  device: 'mobile' | 'tablet' | 'desktop';
  interactions: {
    clicks: number;
    scrolls: number;
    formSubmissions: number;
    buttonClicks: { [key: string]: number };
  };
}

interface PageViewEvent {
  sessionId: string;
  page: string;
  timestamp: number;
  timeOnPage?: number;
  scrollDepth?: number;
}

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventName: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class VisitorTrackingService {
  private session: VisitorSession | null = null;
  private pageViewStartTime: number = 0;
  private maxScrollDepth: number = 0;
  private isInitialized: boolean = false;
  private storageKey = 'maycole_visitor_session';
  private analyticsQueue: AnalyticsEvent[] = [];
  private queueFlushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSession();
    this.setupEventListeners();
    this.startQueueProcessor();
  }

  /**
   * Initialize visitor session
   */
  private initializeSession(): void {
    if (this.isInitialized) return;

    // Check for existing session
    const existingSession = this.getStoredSession();
    if (existingSession && this.isSessionValid(existingSession)) {
      this.session = existingSession;
    } else {
      this.session = this.createNewSession();
      this.storeSession(this.session);
    }

    this.pageViewStartTime = Date.now();
    this.isInitialized = true;

    console.log('[VisitorTracking] Session initialized:', this.session.sessionId);
  }

  /**
   * Create a new visitor session
   */
  private createNewSession(): VisitorSession {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      pageViews: [],
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      location: window.location.href,
      device: this.detectDevice(),
      interactions: {
        clicks: 0,
        scrolls: 0,
        formSubmissions: 0,
        buttonClicks: {},
      },
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Detect device type
   */
  private detectDevice(): 'mobile' | 'tablet' | 'desktop' {
    const ua = navigator.userAgent;
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /**
   * Check if session is still valid (30 minutes)
   */
  private isSessionValid(session: VisitorSession): boolean {
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    return Date.now() - session.lastActivityTime < sessionTimeout;
  }

  /**
   * Store session in localStorage
   */
  private storeSession(session: VisitorSession): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } catch (error) {
      console.warn('[VisitorTracking] Failed to store session:', error);
    }
  }

  /**
   * Retrieve stored session from localStorage
   */
  private getStoredSession(): VisitorSession | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('[VisitorTracking] Failed to retrieve session:', error);
      return null;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Track clicks
    document.addEventListener('click', (e) => this.handleClick(e), true);

    // Track scroll depth
    window.addEventListener('scroll', () => this.trackScrollDepth());

    // Track form submissions
    document.addEventListener('submit', (e) => this.handleFormSubmit(e), true);

    // Update activity time
    document.addEventListener('mousemove', () => this.updateActivityTime());
    document.addEventListener('keypress', () => this.updateActivityTime());

    // Track page visibility
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    // Before unload - send final analytics
    window.addEventListener('beforeunload', () => this.flush());
  }

  /**
   * Handle click events
   */
  private handleClick(event: MouseEvent): void {
    if (!this.session) return;

    this.session.interactions.clicks++;

    const target = event.target as HTMLElement;
    const buttonText = target.textContent?.trim() || target.id || target.className;

    if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
      const key = `btn_${buttonText.replace(/\s+/g, '_').toLowerCase()}`;
      this.session.interactions.buttonClicks[key] =
        (this.session.interactions.buttonClicks[key] || 0) + 1;

      // Track specific button clicks
      this.trackEvent('interaction', 'button_click', {
        buttonText,
        buttonId: target.id,
        buttonClass: target.className,
      });
    }

    this.storeSession(this.session);
  }

  /**
   * Handle form submissions
   */
  private handleFormSubmit(event: Event): void {
    if (!this.session) return;

    this.session.interactions.formSubmissions++;

    const form = event.target as HTMLFormElement;
    this.trackEvent('interaction', 'form_submit', {
      formId: form.id,
      formName: form.name,
      formClass: form.className,
    });

    this.storeSession(this.session);
  }

  /**
   * Track scroll depth
   */
  private trackScrollDepth(): void {
    if (!this.session) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollDepth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

    if (scrollDepth > this.maxScrollDepth) {
      this.maxScrollDepth = scrollDepth;
      this.session.interactions.scrolls++;
    }
  }

  /**
   * Update last activity time
   */
  private updateActivityTime(): void {
    if (!this.session) return;
    this.session.lastActivityTime = Date.now();
  }

  /**
   * Handle page visibility changes
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.trackEvent('session', 'page_hidden');
    } else {
      this.trackEvent('session', 'page_visible');
    }
  }

  /**
   * Track page view
   */
  public trackPageView(page: string): void {
    if (!this.session) return;

    // Record time on previous page
    const timeOnPage = Date.now() - this.pageViewStartTime;
    if (this.session.pageViews.length > 0) {
      const previousPage = this.session.pageViews[this.session.pageViews.length - 1];
      this.trackEvent('navigation', 'page_view', {
        page: previousPage,
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
      });
    }

    // Add new page view
    this.session.pageViews.push(page);
    this.pageViewStartTime = Date.now();
    this.maxScrollDepth = 0;

    this.trackEvent('navigation', 'page_view', {
      page,
      timestamp: Date.now(),
    });

    this.storeSession(this.session);
    console.log('[VisitorTracking] Page view tracked:', page);
  }

  /**
   * Track custom event
   */
  public trackEvent(
    eventType: string,
    eventName: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.session) return;

    const event: AnalyticsEvent = {
      sessionId: this.session.sessionId,
      eventType,
      eventName,
      timestamp: Date.now(),
      metadata,
    };

    this.analyticsQueue.push(event);
    console.log('[VisitorTracking] Event tracked:', eventName, metadata);
  }

  /**
   * Track product launch
   */
  public trackProductLaunch(productName: string): void {
    this.trackEvent('product', 'launch_clicked', {
      productName,
      timestamp: Date.now(),
    });
  }

  /**
   * Track lead capture
   */
  public trackLeadCapture(email: string, source: string): void {
    this.trackEvent('conversion', 'lead_captured', {
      email,
      source,
      timestamp: Date.now(),
    });
  }

  /**
   * Start queue processor for batching events
   */
  private startQueueProcessor(): void {
    this.queueFlushInterval = setInterval(() => {
      if (this.analyticsQueue.length > 0) {
        this.flush();
      }
    }, 30000); // Flush every 30 seconds
  }

  /**
   * Flush analytics queue
   */
  public async flush(): Promise<void> {
    if (this.analyticsQueue.length === 0 || !this.session) return;

    const payload = {
      sessionId: this.session.sessionId,
      events: this.analyticsQueue,
      sessionData: {
        startTime: this.session.startTime,
        lastActivityTime: this.session.lastActivityTime,
        pageViews: this.session.pageViews,
        referrer: this.session.referrer,
        device: this.session.device,
        interactions: this.session.interactions,
      },
    };

    try {
      // Send to backend analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true, // Important for beforeunload
      });

      this.analyticsQueue = [];
      console.log('[VisitorTracking] Analytics flushed');
    } catch (error) {
      console.warn('[VisitorTracking] Failed to flush analytics:', error);
      // Keep events in queue for retry
    }
  }

  /**
   * Get current session data
   */
  public getSession(): VisitorSession | null {
    return this.session;
  }

  /**
   * Get session summary
   */
  public getSessionSummary() {
    if (!this.session) return null;

    const sessionDuration = Date.now() - this.session.startTime;
    return {
      sessionId: this.session.sessionId,
      duration: sessionDuration,
      pageViews: this.session.pageViews.length,
      clicks: this.session.interactions.clicks,
      scrolls: this.session.interactions.scrolls,
      formSubmissions: this.session.interactions.formSubmissions,
      device: this.session.device,
      referrer: this.session.referrer,
      topButtons: this.session.interactions.buttonClicks,
    };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.queueFlushInterval) {
      clearInterval(this.queueFlushInterval);
    }
    this.flush();
  }
}

// Singleton instance
let instance: VisitorTrackingService | null = null;

export function getVisitorTrackingService(): VisitorTrackingService {
  if (!instance) {
    instance = new VisitorTrackingService();
  }
  return instance;
}

export type { VisitorSession, PageViewEvent, AnalyticsEvent };
