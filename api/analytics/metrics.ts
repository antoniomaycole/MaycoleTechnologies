/**
 * Vercel API Route: Get Analytics Metrics
 * Path: /api/analytics/metrics
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data for now - connect to database later
const mockMetrics = {
  totalVisitors: 1234,
  activeVisitors: 45,
  totalPageViews: 5678,
  avgSessionDuration: 285000, // 4.75 minutes
  avgClicksPerSession: 8.3,
  conversionRate: 0.12, // 12%
  topPages: [
    { page: 'Home', views: 2345 },
    { page: 'MaycoleTracker', views: 1234 },
    { page: 'Pricing', views: 987 },
  ],
  topButtons: [
    { name: 'Launch MaycoleTracker', clicks: 567 },
    { name: 'Launch MaycoleCheckBook', clicks: 456 },
    { name: 'Get Started', clicks: 345 },
  ],
  deviceBreakdown: {
    mobile: 450,
    tablet: 234,
    desktop: 550,
  },
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    visitors: Math.floor(Math.random() * 100),
  })),
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      ...mockMetrics,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('[Metrics API] Error:', error);
    res.status(500).json({
      error: 'Failed to fetch metrics',
    });
  }
}
