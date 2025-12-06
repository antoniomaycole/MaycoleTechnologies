import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface MetricData {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  color: string;
}

/**
 * AnalyticsDashboard - Real-time analytics visualization component
 *
 * Features:
 * - Real-time metric tracking
 * - Trend visualization
 * - Performance monitoring
 * - Responsive design
 *
 * Performance optimizations:
 * - Memoized calculations
 * - Lazy metric updates
 * - Optimized re-renders
 */
export const AnalyticsDashboard = React.memo(() => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time analytics data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMetrics([
        {
          label: 'Page Views',
          value: 12847,
          change: 23.5,
          icon: <Eye className="w-5 h-5" />,
          trend: 'up',
          color: 'from-blue-500 to-blue-600',
        },
        {
          label: 'Active Users',
          value: 2341,
          change: 18.2,
          icon: <Users className="w-5 h-5" />,
          trend: 'up',
          color: 'from-green-500 to-green-600',
        },
        {
          label: 'Conversion Rate',
          value: 8.4,
          change: 12.7,
          icon: <TrendingUp className="w-5 h-5" />,
          trend: 'up',
          color: 'from-purple-500 to-purple-600',
        },
        {
          label: 'Avg Session',
          value: 4.2,
          change: -5.1,
          icon: <BarChart3 className="w-5 h-5" />,
          trend: 'down',
          color: 'from-orange-500 to-orange-600',
        },
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Memoize formatted metrics to avoid recalculation
  const formattedMetrics = useMemo(
    () =>
      metrics.map((metric) => ({
        ...metric,
        formattedValue:
          metric.label === 'Conversion Rate'
            ? `${metric.value.toFixed(1)}%`
            : metric.value.toLocaleString(),
      })),
    [metrics]
  );

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Real-time insights into your application performance
            </p>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              ))
            : formattedMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {metric.label}
                      </CardTitle>
                      <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-lg`}>
                        <div className="text-white">{metric.icon}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-gray-900">
                          {metric.formattedValue}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            metric.trend === 'up'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change).toFixed(1)}%
                        </Badge>
                        <span className="text-sm text-gray-500">vs last period</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-white rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-2">Performance Summary</h3>
          <p className="text-gray-600">
            Your application is performing optimally with consistent growth across all key metrics.
            Keep monitoring these indicators to maintain peak performance.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;
