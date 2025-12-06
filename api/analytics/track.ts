/**
 * Vercel API Route: Analytics Tracking
 * Path: /api/analytics/track
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory store (in production, use a database)
const analyticsStore = {
  sessions: new Map(),
  events: [],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    }

    console.log('[Analytics] Events received:', events.length);

    res.status(200).json({
      success: true,
      message: 'Analytics tracked',
      eventsProcessed: events.length,
    });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    res.status(500).json({
      error: 'Failed to process analytics',
    });
  }
}
