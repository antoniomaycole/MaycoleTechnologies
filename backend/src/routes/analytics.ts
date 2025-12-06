import express, { Request, Response } from 'express';

interface AnalyticsStore {
  sessions: Map<string, any>;
  events: any[];
  pageViews: Map<string, number>;
  buttonClicks: Map<string, number>;
}

// In-memory store (in production, use a database)
const analyticsStore: AnalyticsStore = {
  sessions: new Map(),
  events: [],
  pageViews: new Map(),
  buttonClicks: new Map(),
};

export function createAnalyticsRouter() {
  const router = express.Router();

  /**
   * Track analytics events
   * POST /api/analytics/track
   */
  router.post('/track', (req: Request, res: Response) => {
    try {
      const { sessionId, events, sessionData } = req.body;

      if (!sessionId || !events) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Store session data
      analyticsStore.sessions.set(sessionId, {
        ...sessionData,
        lastUpdated: new Date(),
      });

      // Process events
      for (const event of events) {
        analyticsStore.events.push({
          ...event,
          timestamp: new Date(event.timestamp),
        });

        // Track page views
        if (event.eventType === 'navigation' && event.metadata?.page) {
          const page = event.metadata.page;
          analyticsStore.pageViews.set(page, (analyticsStore.pageViews.get(page) || 0) + 1);
        }

        // Track button clicks
        if (event.eventType === 'interaction' && event.metadata?.buttonText) {
          const button = event.metadata.buttonText;
          analyticsStore.buttonClicks.set(
            button,
            (analyticsStore.buttonClicks.get(button) || 0) + 1
          );
        }

        // Track conversions
        if (event.eventType === 'conversion') {
          console.log('[Analytics] Conversion tracked:', event.eventName, event.metadata);
        }
      }

      res.json({ success: true, message: 'Analytics tracked' });
      console.log('[Analytics] Events processed:', events.length);
    } catch (error) {
      console.error('[Analytics] Error processing events:', error);
      res.status(500).json({ error: 'Failed to process analytics' });
    }
  });

  /**
   * Get analytics metrics
   * GET /api/analytics/metrics
   */
  router.get('/metrics', (req: Request, res: Response) => {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Filter events from last 24 hours
      const recentEvents = analyticsStore.events.filter(
        (e) => new Date(e.timestamp) > last24Hours
      );

      // Calculate active visitors (sessions with activity in last 30 minutes)
      const last30Minutes = new Date(now.getTime() - 30 * 60 * 1000);
      let activeVisitors = 0;
      analyticsStore.sessions.forEach((session) => {
        if (new Date(session.lastUpdated) > last30Minutes) {
          activeVisitors++;
        }
      });

      // Calculate metrics
      const totalVisitors = analyticsStore.sessions.size;
      const totalPageViews = Array.from(analyticsStore.pageViews.values()).reduce(
        (a, b) => a + b,
        0
      );

      // Calculate average session duration
      let totalSessionDuration = 0;
      analyticsStore.sessions.forEach((session) => {
        if (session.startTime) {
          const duration = new Date(session.lastUpdated).getTime() - session.startTime;
          totalSessionDuration += duration;
        }
      });
      const avgSessionDuration =
        totalVisitors > 0 ? totalSessionDuration / totalVisitors : 0;

      // Calculate average clicks
      const totalClicks = recentEvents
        .filter((e) => e.eventType === 'interaction')
        .reduce((sum, e) => sum + (e.metadata?.clicks || 1), 0);
      const avgClicksPerSession = totalVisitors > 0 ? totalClicks / totalVisitors : 0;

      // Calculate conversion rate
      const leadCaptures = recentEvents.filter((e) => e.eventName === 'lead_captured').length;
      const conversionRate =
        totalVisitors > 0 ? leadCaptures / totalVisitors : 0;

      // Get top pages
      const topPages = Array.from(analyticsStore.pageViews.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, views]) => ({ page, views }));

      // Get top buttons
      const topButtons = Array.from(analyticsStore.buttonClicks.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, clicks]) => ({ name, clicks }));

      // Device breakdown
      const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
      analyticsStore.sessions.forEach((session) => {
        if (session.device) {
          deviceBreakdown[session.device as keyof typeof deviceBreakdown]++;
        }
      });

      // Hourly data (last 24 hours)
      const hourlyData: Array<{ hour: string; visitors: number }> = [];
      for (let i = 23; i >= 0; i--) {
        const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hour = hourAgo.getHours().toString().padStart(2, '0') + ':00';

        const visitorsInHour = recentEvents.filter((e) => {
          const eventTime = new Date(e.timestamp);
          return (
            eventTime.getHours() === hourAgo.getHours() &&
            eventTime.getDate() === hourAgo.getDate()
          );
        }).length;

        hourlyData.push({ hour, visitors: visitorsInHour });
      }

      res.json({
        totalVisitors,
        activeVisitors,
        totalPageViews,
        avgSessionDuration,
        avgClicksPerSession,
        conversionRate,
        topPages,
        topButtons,
        deviceBreakdown,
        hourlyData,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('[Analytics] Error calculating metrics:', error);
      res.status(500).json({ error: 'Failed to calculate metrics' });
    }
  });

  /**
   * Get detailed session data
   * GET /api/analytics/sessions/:sessionId
   */
  router.get('/sessions/:sessionId', (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = analyticsStore.sessions.get(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const sessionEvents = analyticsStore.events.filter((e) => e.sessionId === sessionId);

      res.json({
        session,
        events: sessionEvents,
      });
    } catch (error) {
      console.error('[Analytics] Error fetching session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  /**
   * Get all sessions
   * GET /api/analytics/sessions
   */
  router.get('/sessions', (req: Request, res: Response) => {
    try {
      const sessions = Array.from(analyticsStore.sessions.entries()).map(([id, data]) => ({
        id,
        ...data,
      }));

      // Support pagination
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      const paginatedSessions = sessions.slice(offset, offset + limit);

      res.json({
        total: sessions.length,
        limit,
        offset,
        sessions: paginatedSessions,
      });
    } catch (error) {
      console.error('[Analytics] Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  /**
   * Get conversion data
   * GET /api/analytics/conversions
   */
  router.get('/conversions', (req: Request, res: Response) => {
    try {
      const conversions = analyticsStore.events
        .filter((e) => e.eventType === 'conversion')
        .map((e) => ({
          timestamp: e.timestamp,
          type: e.eventName,
          email: e.metadata?.email,
          source: e.metadata?.source,
          sessionId: e.sessionId,
        }));

      res.json({
        total: conversions.length,
        conversions,
      });
    } catch (error) {
      console.error('[Analytics] Error fetching conversions:', error);
      res.status(500).json({ error: 'Failed to fetch conversions' });
    }
  });

  return router;
}
