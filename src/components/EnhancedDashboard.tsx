/**
 * MaycoleTracker vol XII™ - Enhanced Dashboard
 * Real-time inventory dashboard with live updates
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useRealtimeSubscription } from '../lib/realtime';
import { InventoryMetrics, SalesMetrics, Product, StockAlert } from '../types/database';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Truck,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export function EnhancedDashboard() {
  const { user } = useAuth();
  const [inventoryMetrics, setInventoryMetrics] = useState<InventoryMetrics | null>(null);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Subscribe to real-time inventory updates
  useRealtimeSubscription('inventory-updated', (event) => {
    // Refresh metrics when inventory changes
    refreshMetrics();
  });

  // Subscribe to real-time alerts
  useRealtimeSubscription('alert-created', (event) => {
    // Add new alert to the list
    const newAlert: StockAlert = {
      id: event.id,
      productId: event.payload.productId,
      type: event.payload.type,
      severity: event.payload.severity,
      message: event.payload.message,
      isRead: false,
      isResolved: false,
      createdAt: event.timestamp,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  });

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load all data in parallel
      const [metrics, sales, products, alertsData] = await Promise.all([
        api.getInventoryMetrics(),
        api.getSalesMetrics(),
        api.getProducts({ lowStock: true }),
        api.getStockAlerts(),
      ]);

      setInventoryMetrics(metrics);
      setSalesMetrics(sales);
      setLowStockProducts(products.data);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      setIsRefreshing(true);
      const metrics = await api.getInventoryMetrics();
      setInventoryMetrics(metrics);
      toast.success('Metrics refreshed');
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Products',
      value: inventoryMetrics?.totalProducts.toLocaleString() || '0',
      change: '+12%',
      trend: 'up' as const,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Inventory Value',
      value: `$${inventoryMetrics?.totalValue.toLocaleString() || '0'}`,
      change: '+8%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Low Stock Items',
      value: inventoryMetrics?.lowStockItems.toString() || '0',
      change: '-5%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      title: 'Out of Stock',
      value: inventoryMetrics?.outOfStockItems.toString() || '0',
      change: '-15%',
      trend: 'down' as const,
      icon: Package,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-gray-400">
                Real-time inventory management powered by MaycoleTracker™
              </p>
            </div>
            <Button
              onClick={refreshMetrics}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge
                      variant="outline"
                      className={`${
                        stat.trend === 'up'
                          ? 'border-green-500/30 text-green-400'
                          : 'border-red-500/30 text-red-400'
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Low Stock Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No low stock items</p>
                ) : (
                  <div className="space-y-4">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                            {product.quantity} left
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">Min: {product.minStockLevel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No active alerts</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'critical'
                            ? 'bg-red-500/10 border-red-500/30'
                            : alert.severity === 'warning'
                              ? 'bg-orange-500/10 border-orange-500/30'
                              : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${
                              alert.severity === 'critical'
                                ? 'border-red-500/30 text-red-400'
                                : alert.severity === 'warning'
                                  ? 'border-orange-500/30 text-orange-400'
                                  : 'border-blue-500/30 text-blue-400'
                            }`}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sales Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl">${salesMetrics?.totalRevenue.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                  <p className="text-2xl">{salesMetrics?.totalOrders.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Average Order Value</p>
                  <p className="text-2xl">${salesMetrics?.averageOrderValue.toFixed(2) || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
