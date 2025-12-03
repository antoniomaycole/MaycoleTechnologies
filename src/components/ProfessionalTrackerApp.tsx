import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { ReadmeModal } from './ReadmeModal';
import { EnhancedDashboard } from './EnhancedDashboard';
import { EnhancedAnalytics } from './EnhancedAnalytics';
import { EnhancedSettings } from './EnhancedSettings';
import { InventoryList } from './InventoryList';
import { 
  FileText, Mic, QrCode, AlertTriangle, Settings, BarChart3, 
  Users, Moon, Sun, Bell, Wifi, Shield, Star, Crown, 
  Search, Filter, Download, Upload, Zap, Database,
  Play, Pause, Volume2, VolumeX, Package, TrendingUp,
  DollarSign, Truck, CheckCircle, Calendar, Clock,
  ArrowUpRight, ArrowDownRight, Home, Activity,
  Scan, FileBarChart, UserCheck, Layers, Target,
  Globe, Smartphone, Monitor, Lock, Brain
} from 'lucide-react';

interface ProfessionalTrackerAppProps {
  onBack?: () => void;
}

type AppView = 'launcher' | 'dashboard' | 'analytics' | 'reports' | 'suppliers' | 'settings';
type SubscriptionTier = 'free' | 'professional' | 'enterprise';

export function ProfessionalTrackerApp({ onBack }: ProfessionalTrackerAppProps) {
  const [currentView, setCurrentView] = useState<AppView>('launcher');
  const [darkMode, setDarkMode] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [subscriptionTier] = useState<SubscriptionTier>('professional');
  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setCurrentView('dashboard');
            break;
          case '2':
            e.preventDefault();
            setCurrentView('analytics');
            break;
          case '3':
            e.preventDefault();
            setCurrentView('reports');
            break;
          case '4':
            e.preventDefault();
            setCurrentView('suppliers');
            break;
          case '5':
            e.preventDefault();
            setCurrentView('settings');
            break;
        }
      }
      
      if (e.key === ' ') {
        e.preventDefault();
        toggleVoice();
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        setCurrentView('launcher');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLaunchApp = async () => {
    setLoading(true);
    
    // Simulate app launch
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setCurrentView('dashboard');
    
    toast.success('MaycoleTracker™ Launched Successfully!', {
      description: 'Welcome to AI-Native Inventory Intelligence',
      icon: <Zap className="w-4 h-4" />
    });
  };

  const toggleVoice = () => {
    setVoiceActive(!voiceActive);
    toast.info(voiceActive ? 'Voice Control Disabled' : 'Voice Control Activated', {
      description: voiceActive ? 'Click to speak' : 'Listening for commands...',
      icon: <Mic className="w-4 h-4" />
    });
  };

  const activateScanner = () => {
    setScannerActive(true);
    toast.info('Barcode Scanner Activated', {
      description: 'Point camera at barcode to scan',
      icon: <QrCode className="w-4 h-4" />
    });
    
    // Simulate scan
    setTimeout(() => {
      setScannerActive(false);
      toast.success('Item Scanned Successfully!', {
        description: 'Product added to inventory',
        icon: <CheckCircle className="w-4 h-4" />
      });
    }, 3000);
  };

  const toggleEmergency = () => {
    setEmergencyMode(!emergencyMode);
    toast[emergencyMode ? 'info' : 'error'](
      emergencyMode ? 'Emergency Mode Disabled' : 'Emergency Mode Activated',
      {
        description: emergencyMode ? 'Normal operations restored' : 'Priority alerts enabled',
        icon: <AlertTriangle className="w-4 h-4" />
      }
    );
  };

  // Purple-themed MaycoleTracker Icon Component
  const MaycoleTrackerIcon = ({ size = 'md', animated = false }: { size?: 'sm' | 'md' | 'lg' | 'xl', animated?: boolean }) => {
    const sizeMap = {
      sm: { container: 50, circle: 50, crossH: 30, crossV: 2.5, dot: 5, offsetCorner: 15 },
      md: { container: 60, circle: 60, crossH: 36, crossV: 3, dot: 6, offsetCorner: 18 },
      lg: { container: 80, circle: 80, crossH: 48, crossV: 4, dot: 8, offsetCorner: 24 },
      xl: { container: 140, circle: 140, crossH: 84, crossV: 7, dot: 14, offsetCorner: 42 }
    };

    const dims = sizeMap[size];
    const center = dims.container / 2;

    return (
      <motion.div
        animate={animated ? { rotate: 360 } : {}}
        transition={animated ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
        className="relative"
        // eslint-disable-next-line react/no-unknown-property
        style={{ width: dims.container, height: dims.container }}
      >
        {/* Purple gradient circle */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div 
          className="absolute rounded-full shadow-2xl"
          style={{
            width: dims.circle,
            height: dims.circle,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.3)'
          }}
        />

        {/* White cross and dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Horizontal line */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.crossH,
              height: dims.crossV,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
          />
          
          {/* Vertical line */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.crossV,
              height: dims.crossH,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
          />

          {/* Four corner dots */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.dot * 2,
              height: dims.dot * 2,
              top: dims.offsetCorner,
              left: dims.offsetCorner,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)'
            }}
          />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.dot * 2,
              height: dims.dot * 2,
              top: dims.offsetCorner,
              right: dims.offsetCorner,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)'
            }}
          />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.dot * 2,
              height: dims.dot * 2,
              bottom: dims.offsetCorner,
              left: dims.offsetCorner,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)'
            }}
          />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div 
            className="absolute bg-white rounded-full shadow-lg"
            style={{
              width: dims.dot * 2,
              height: dims.dot * 2,
              bottom: dims.offsetCorner,
              right: dims.offsetCorner,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)'
            }}
          />
        </div>

        {/* Pulsing glow effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
              filter: 'blur(20px)',
              opacity: 0.6
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    );
  };

  // WILD Document Icon with Purple Theme
  const WildDocumentIcon = ({ size = 100, animated = true }: { size?: number, animated?: boolean }) => (
    <motion.div
      className="relative mx-auto"
      style={{ width: size, height: size * 1.2 }}
      animate={animated ? {
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Document Stack */}
      <div className="relative">
        {/* Background documents */}
        <div className="absolute top-2 left-2 w-16 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg transform rotate-12 opacity-60" />
        <div className="absolute top-1 left-1 w-16 h-20 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg shadow-lg transform rotate-6 opacity-80" />
        
        {/* Main document */}
        <div className="relative w-16 h-20 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-xl border border-purple-200">
          {/* Document lines */}
          <div className="absolute top-3 left-2 right-2 space-y-1">
            <div className="h-0.5 bg-purple-400 rounded" />
            <div className="h-0.5 bg-purple-400 rounded w-3/4" />
            <div className="h-0.5 bg-purple-400 rounded w-1/2" />
            <div className="h-0.5 bg-purple-400 rounded w-5/6" />
          </div>
          
          {/* WILD badge */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            WILD
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg"
          animate={animated ? {
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-2 -right-3 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
          animate={animated ? {
            x: [0, 8, 0],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
    </motion.div>
  );

  // Launcher Screen with Purple Theme
  if (currentView === 'launcher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white">
        <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
          
          {/* Purple Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-400/10" />
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-400/20 to-transparent rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            
            {/* MaycoleTracker Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <MaycoleTrackerIcon size="xl" animated={false} />
            </motion.div>

            {/* App Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                  MaycoleTracker
                </span>
                <sup className="text-purple-400 text-lg">™</sup>
              </h1>
              <p className="text-xl md:text-2xl text-purple-300 mb-2">
                AI-Native Inventory Intelligence
              </p>
              <p className="text-sm md:text-base text-purple-400/80 mb-8">
                Restaurant Operations • Professional Plan
              </p>
            </motion.div>

            {/* Status Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
            >
              <Badge className={`flex items-center gap-2 px-3 py-2 ${isOnline ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              
              <Badge className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Crown className="w-4 h-4" />
                Professional Plan
              </Badge>
              
              <Badge className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 border-purple-600/30">
                <Shield className="w-4 h-4" />
                Enterprise Security
              </Badge>
              
              {notifications > 0 && (
                <Badge className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border-red-500/30">
                  <Bell className="w-4 h-4" />
                  {notifications} Alerts
                </Badge>
              )}
            </motion.div>

            {/* Launch Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <Button
                onClick={handleLaunchApp}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-12 py-6 text-xl font-medium group relative overflow-hidden border-none shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  {loading ? 'Launching...' : 'Launch App'}
                </div>
                
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                onClick={toggleVoice}
                variant="outline"
                className={`border-purple-500/50 text-purple-300 hover:bg-purple-500/10 ${voiceActive ? 'bg-purple-500/20' : ''}`}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice Control
              </Button>
              
              <Button
                onClick={activateScanner}
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                disabled={scannerActive}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {scannerActive ? 'Scanning...' : 'Barcode Scanner'}
              </Button>
              
              <Button
                onClick={toggleEmergency}
                variant="outline"
                className={`border-purple-500/50 text-purple-300 hover:bg-purple-500/10 ${emergencyMode ? 'bg-red-500/20 border-red-500/50 text-red-300' : ''}`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Mode
              </Button>
              
              <ReadmeModal />
            </motion.div>

            {/* Keyboard Shortcuts Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 text-xs text-purple-400/60"
            >
              <p>Keyboard Shortcuts: Ctrl+1-5 (Navigate) • Space (Voice) • Esc (Home)</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate view based on currentView
  const renderView = () => {
    const navigationBar = (viewTitle: string) => (
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentView('launcher')}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <span className="text-gray-400">|</span>
              <h2 className="text-xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {viewTitle}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                {subscriptionTier}
              </Badge>
              {notifications > 0 && (
                <Badge variant="outline" className="border-red-500/30 text-red-400">
                  <Bell className="w-3 h-3 mr-1" />
                  {notifications}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="relative">
            {navigationBar('Dashboard')}
            <div className="pt-16">
              <EnhancedDashboard />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="relative">
            {navigationBar('Analytics')}
            <div className="pt-16">
              <EnhancedAnalytics />
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="relative">
            {navigationBar('Inventory Management')}
            <div className="pt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InventoryList />
              </div>
            </div>
          </div>
        );

      case 'suppliers':
        return (
          <div className="relative">
            {navigationBar('Suppliers')}
            <div className="pt-16">
              <div className="min-h-screen bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-500" />
                        Supplier Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-center py-12">
                        Supplier management interface coming soon...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="relative">
            {navigationBar('Settings')}
            <div className="pt-16">
              <EnhancedSettings />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If not launcher, render the appropriate view
  if (currentView !== 'launcher') {
    return renderView();
  }

  // Launcher screen (existing code continues below)
}