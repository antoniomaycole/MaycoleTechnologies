import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { Card } from './ui/card';

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

interface BotStatus {
  isRunning: boolean;
  score: number;
  completedActions: number;
  totalActions: number;
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      // In production, fetch from backend API
      const mockData = await generateMockPerformanceData();
      setMetrics(mockData.metrics);
      setBotStatus(mockData.botStatus);
      setRecommendations(mockData.recommendations);
    } catch (error) {
      console.error('[PerformanceDashboard] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformanceData = async () => {
    return {
      metrics: [
        { name: 'Page Load Time', value: 1200, threshold: 3000, status: 'good' as const },
        { name: 'DOM Interactive', value: 1800, threshold: 2000, status: 'good' as const },
        { name: 'Total JS Size', value: 245, threshold: 300, status: 'good' as const },
        { name: 'Total CSS Size', value: 78, threshold: 100, status: 'good' as const },
        { name: 'Memory Usage', value: 35, threshold: 50, status: 'good' as const },
        { name: 'Slow Resources', value: 2, threshold: 5, status: 'warning' as const },
      ],
      botStatus: {
        isRunning: true,
        score: 82,
        completedActions: 3,
        totalActions: 5,
      },
      recommendations: [
        'Enable lazy loading for below-the-fold images',
        'Implement service worker caching',
        'Consider code splitting for vendor dependencies',
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Analyzing performance...</div>
      </div>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className="w-full space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Performance Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Real-time optimization analysis and bot-driven improvements</p>
        </div>
        {botStatus && (
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                {botStatus.isRunning ? '🤖 Bot Active' : 'Bot Inactive'}
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900">{botStatus.score}</div>
            <div className="text-sm text-gray-500">Performance Score</div>
          </div>
        )}
      </div>

      {/* Bot Status Card */}
      {botStatus && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-purple-50 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Bot Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-purple-600">
                  {botStatus.isRunning ? '✓ Monitoring' : '✗ Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Actions Completed</p>
                <p className="text-lg font-bold text-green-600">
                  {botStatus.completedActions} / {botStatus.totalActions}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Optimization Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(botStatus.completedActions / botStatus.totalActions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="p-4 border-l-4" style={{
              borderLeftColor: metric.status === 'good' ? '#10b981' : metric.status === 'warning' ? '#f59e0b' : '#ef4444',
            }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Threshold: {metric.threshold}
                  </p>
                </div>
                <div className={getStatusColor(metric.status)}>
                  {getStatusIcon(metric.status)}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Recommendations
          </h3>
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">→</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-right">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </motion.div>
  );
};

export default PerformanceDashboard;
