/**
 * MaycoleTracker vol XII™ - Authenticated Tracker Wrapper
 * Integrates authentication and real-time features
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { ProfessionalTrackerApp } from './ProfessionalTrackerApp';
import { realtimeService, useRealtimeSubscription } from '../lib/realtime';
import { RealtimeEvent } from '../types/database';
import { toast } from 'sonner';
import { Bell, Wifi, WifiOff, Activity, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

interface AuthenticatedTrackerProps {
  onBack?: () => void;
}

export function AuthenticatedTracker({ onBack }: AuthenticatedTrackerProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isLoading, isAuthenticated]);

  // Connect to real-time service when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      realtimeService.connect();
      setIsRealtimeConnected(true);

      toast.success('Real-time Updates Activated', {
        description: 'You will receive live inventory updates',
        icon: <Wifi className="w-4 h-4" />,
      });

      return () => {
        realtimeService.disconnect();
        setIsRealtimeConnected(false);
      };
    }
  }, [isAuthenticated]);

  // Subscribe to all real-time events
  const handleRealtimeEvent = (event: RealtimeEvent) => {
    setRealtimeEvents((prev) => [...prev.slice(-9), event]);

    // Show toast notification for important events
    switch (event.type) {
      case 'inventory-updated':
        toast.info('Inventory Updated', {
          description: `Product ${event.payload.productId}: ${event.payload.oldQuantity} → ${event.payload.newQuantity}`,
          icon: <Package className="w-4 h-4" />,
        });
        break;

      case 'alert-created':
        toast.warning(event.payload.message, {
          description: `Product ${event.payload.productId}`,
          icon: <AlertTriangle className="w-4 h-4" />,
        });
        break;

      case 'stock-movement':
        toast.info('Stock Movement', {
          description: `${event.payload.type}: ${event.payload.quantity} units`,
          icon: <TrendingUp className="w-4 h-4" />,
        });
        break;

      case 'order-updated':
        toast.info('Order Update', {
          description: `Order ${event.payload.orderId} is now ${event.payload.status}`,
          icon: <Activity className="w-4 h-4" />,
        });
        break;
    }
  };

  useRealtimeSubscription('all', handleRealtimeEvent);

  // Handle authentication success
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast.success(`Welcome back, ${user?.firstName || 'User'}!`, {
      description: 'Starting MaycoleTracker™...',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl mb-2">Initializing MaycoleTracker™</h2>
          <p className="text-gray-400">Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl mb-4">
            Welcome to MaycoleTracker<sup className="text-xs">™</sup>
          </h1>
          <p className="text-gray-400 mb-8">AI-Native Inventory Intelligence Platform</p>
          <p className="text-gray-500 text-sm mb-8">
            Please sign in to access your inventory management dashboard with real-time updates.
          </p>
        </motion.div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Show authenticated tracker app
  return (
    <div className="relative">
      {/* Real-time status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 z-[60]"
      >
        <Badge
          variant="outline"
          className={`flex items-center gap-2 ${
            isRealtimeConnected
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {isRealtimeConnected ? (
            <>
              <Wifi className="w-3 h-3 animate-pulse" />
              <span className="hidden sm:inline">Live Updates</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </>
          )}
        </Badge>
      </motion.div>

      {/* Recent events indicator */}
      {realtimeEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-16 right-4 z-[60]"
        >
          <Badge
            variant="outline"
            className="flex items-center gap-2 border-blue-500/30 bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/20"
          >
            <Bell className="w-3 h-3" />
            <span>{realtimeEvents.length} recent events</span>
          </Badge>
        </motion.div>
      )}

      {/* Main tracker application */}
      <ProfessionalTrackerApp onBack={onBack} />
    </div>
  );
}
