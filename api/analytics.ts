/**
 * Analytics Endpoint
 * Track and retrieve user activity metrics
 *
 * GET /api/analytics?userId=xxx&period=week
 * POST /api/analytics/event
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { extractToken, verifyToken } from '@/lib/auth-utils';

interface AnalyticsEvent {
  event_type: string;
  event_name: string;
  user_id: string;
  session_id: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

interface AnalyticsMetrics {
  total_users: number;
  active_users: number;
  new_users: number;
  total_revenue: number;
  conversion_rate: number;
  avg_session_duration: number;
  feature_usage: Record<string, number>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify authentication
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    if (req.method === 'POST') {
      return handleAnalyticsEvent(req, res, userId);
    } else if (req.method === 'GET') {
      return handleAnalyticsQuery(req, res, userId);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Analytics] Error:', error);
    return res.status(500).json({
      error: 'Analytics processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Track analytics events
 */
async function handleAnalyticsEvent(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { event_type, event_name, properties, session_id } = req.body;

  if (!event_type || !event_name) {
    return res.status(400).json({ error: 'Missing event_type or event_name' });
  }

  try {
    // Create analytics event table if doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        event_type VARCHAR(50) NOT NULL,
        event_name VARCHAR(100) NOT NULL,
        session_id VARCHAR(100),
        properties JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert event
    const result = await sql`
      INSERT INTO analytics_events (user_id, event_type, event_name, session_id, properties)
      VALUES (${userId}, ${event_type}, ${event_name}, ${session_id}, ${JSON.stringify(
      properties || {}
    )})
      RETURNING id, created_at
    `;

    return res.status(201).json({
      success: true,
      event_id: result.rows[0]?.id,
      timestamp: result.rows[0]?.created_at,
    });
  } catch (error) {
    console.error('[Analytics Event] Error:', error);
    return res.status(500).json({
      error: 'Failed to record analytics event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Query analytics metrics
 */
async function handleAnalyticsQuery(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { period = 'week', metric_type = 'overview' } = req.query;

  try {
    // Ensure analytics tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        event_type VARCHAR(50) NOT NULL,
        event_name VARCHAR(100) NOT NULL,
        session_id VARCHAR(100),
        properties JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Calculate period date
    const periodDate = calculatePeriodDate(period as string);

    // Get user metrics
    const userMetrics = await sql`
      SELECT
        COUNT(DISTINCT user_id) as total_active_users,
        COUNT(DISTINCT event_name) as unique_events,
        COUNT(*) as total_events,
        MAX(created_at) as last_activity
      FROM analytics_events
      WHERE created_at >= ${periodDate}
    `;

    // Get feature usage breakdown
    const featureUsage = await sql`
      SELECT
        event_name,
        COUNT(*) as usage_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM analytics_events
      WHERE user_id = ${userId} AND created_at >= ${periodDate}
      GROUP BY event_name
      ORDER BY usage_count DESC
    `;

    // Get session data
    const sessionMetrics = await sql`
      SELECT
        session_id,
        COUNT(*) as event_count,
        MAX(created_at) - MIN(created_at) as session_duration,
        COUNT(DISTINCT event_type) as event_types_count
      FROM analytics_events
      WHERE user_id = ${userId} AND created_at >= ${periodDate}
      GROUP BY session_id
    `;

    const avgSessionDuration = calculateAverageSessionDuration(sessionMetrics.rows as any[]);

    return res.status(200).json({
      period,
      metrics: {
        total_active_users: userMetrics.rows[0]?.total_active_users || 0,
        unique_events: userMetrics.rows[0]?.unique_events || 0,
        total_events: userMetrics.rows[0]?.total_events || 0,
        avg_session_duration: avgSessionDuration,
        last_activity: userMetrics.rows[0]?.last_activity,
      },
      feature_usage: featureUsage.rows,
      session_metrics: sessionMetrics.rows.slice(0, 10),
    });
  } catch (error) {
    console.error('[Analytics Query] Error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Helper: Calculate period date
 */
function calculatePeriodDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case 'day':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Helper: Calculate average session duration
 */
function calculateAverageSessionDuration(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  const totalDuration = sessions.reduce((sum, session) => {
    const duration = session.session_duration ? parseInt(session.session_duration as string) : 0;
    return sum + duration;
  }, 0);

  return Math.round(totalDuration / sessions.length);
}
