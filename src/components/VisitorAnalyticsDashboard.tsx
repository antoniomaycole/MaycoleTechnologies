/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BarChart3, TrendingUp, Clock, Mouse, Zap } from 'lucide-react';
import { Card } from './ui/card';

interface VisitorMetrics {
  totalVisitors: number;
  activeVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  avgClicksPerSession: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  topButtons: Array<{ name: string; clicks: number }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  hourlyData: Array<{ hour: string; visitors: number }>;
}

export const VisitorAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<VisitorMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      console.error('[VisitorAnalytics] Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading visitor analytics...</div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!metrics) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const MetricCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: string;
  }> = ({ icon, label, value, trend }) => (
    <motion.div variants={itemVariants}>
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-2">↑ {trend}</p>}
          </div>
          <div className="text-maycole-green opacity-20 ml-4">{icon}</div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      className="w-full space-y-6 p-6 bg-white rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Visitor Analytics</h2>
        <p className="text-gray-600">Real-time tracking of your website visitors and interactions</p>
      </div>

      {/* Key Metrics Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={<Users size={32} />}
          label="Total Visitors"
          value={metrics.totalVisitors}
          trend="+12% today"
        />
        <MetricCard
          icon={<Zap size={32} />}
          label="Active Visitors"
          value={metrics.activeVisitors}
          trend="Live"
        />
        <MetricCard
          icon={<BarChart3 size={32} />}
          label="Total Page Views"
          value={metrics.totalPageViews}
        />
        <MetricCard
          icon={<Clock size={32} />}
          label="Avg Session Duration"
          value={`${Math.round(metrics.avgSessionDuration / 1000)}s`}
        />
        <MetricCard
          icon={<Mouse size={32} />}
          label="Avg Clicks/Session"
          value={metrics.avgClicksPerSession.toFixed(1)}
        />
        <MetricCard
          icon={<TrendingUp size={32} />}
          label="Conversion Rate"
          value={`${(metrics.conversionRate * 100).toFixed(2)}%`}
        />
      </motion.div>

      {/* Device Breakdown */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Desktop', value: metrics.deviceBreakdown.desktop },
              { label: 'Mobile', value: metrics.deviceBreakdown.mobile },
              { label: 'Tablet', value: metrics.deviceBreakdown.tablet },
            ].map((device) => {
              const total =
                metrics.deviceBreakdown.desktop +
                metrics.deviceBreakdown.mobile +
                metrics.deviceBreakdown.tablet;
              const percentage = total > 0 ? (device.value / total) * 100 : 0;
              return (
                <div key={device.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{device.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {device.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-maycole-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Top Pages */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-3">
              {metrics.topPages.map((page, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{page.page}</span>
                  <span className="text-sm font-semibold text-maycole-green">{page.views}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Buttons */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Clicked Buttons</h3>
            <div className="space-y-3">
              {metrics.topButtons.map((btn, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{btn.name}</span>
                  <span className="text-sm font-semibold text-maycole-green">{btn.clicks}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-right mt-4">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </motion.div>
  );
};

export default VisitorAnalyticsDashboard;
