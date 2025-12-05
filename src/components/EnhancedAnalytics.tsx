/**
 * MaycoleTracker vol XII™ - Enhanced Analytics
 * Real-time analytics and reporting dashboard
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { api } from '../lib/api';
import { useRealtimeSubscription } from '../lib/realtime';
import { SalesMetrics } from '../types/database';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { toast } from 'sonner';

export function EnhancedAnalytics() {
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  // Subscribe to real-time order updates
  useRealtimeSubscription('order-updated', () => {
    loadAnalytics();
  });

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const metrics = await api.getSalesMetrics();
      setSalesMetrics(metrics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${salesMetrics?.totalRevenue.toLocaleString() || '0'}`,
      change: '+18.2%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Total Orders',
      value: salesMetrics?.totalOrders.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      title: 'Avg Order Value',
      value: `$${salesMetrics?.averageOrderValue.toFixed(2) || '0'}`,
      change: '+4.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '-2.3%',
      trend: 'down' as const,
      icon: Users,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Analytics & Insights
              </h1>
              <p className="text-gray-400">
                Real-time business intelligence and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={loadAnalytics} className="border-gray-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period)}
                className={
                  selectedPeriod === period ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-700'
                }
              >
                {period === '7d' && 'Last 7 Days'}
                {period === '30d' && 'Last 30 Days'}
                {period === '90d' && 'Last 90 Days'}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        stat.trend === 'up'
                          ? 'border-green-500/30 text-green-400 bg-green-500/10'
                          : 'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Revenue chart visualization</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {salesMetrics?.revenueTrend.length} data points available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesMetrics?.topSellingProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-sm text-blue-400">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-gray-400">{product.totalSales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-400">
                          ${product.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">{product.quantity} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inventory Turnover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-4xl mb-2">4.2x</p>
                  <p className="text-sm text-gray-400">Times per year</p>
                  <Badge variant="outline" className="mt-4 border-green-500/30 text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Days of Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Days of Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-4xl mb-2">87</p>
                  <p className="text-sm text-gray-400">Days on hand</p>
                  <Badge variant="outline" className="mt-4 border-blue-500/30 text-blue-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Optimal
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gross Margin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Gross Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-4xl mb-2">32.5%</p>
                  <p className="text-sm text-gray-400">Average margin</p>
                  <Badge variant="outline" className="mt-4 border-green-500/30 text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
