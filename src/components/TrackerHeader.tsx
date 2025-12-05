import { motion } from 'motion/react';
import { MaycoleTrackerIconButton } from './MaycoleTrackerButton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LayoutDashboard, Package, BarChart3, Settings, Bell, Search, User } from 'lucide-react';

interface TrackerHeaderProps {
  currentView: 'dashboard' | 'inventory' | 'analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'inventory' | 'analytics' | 'settings') => void;
}

export function TrackerHeader({ currentView, onViewChange }: TrackerHeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-maycole-green/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <MaycoleTrackerIconButton
              size="lg"
              animated={false}
              onClick={() => onViewChange('dashboard')}
              className="cursor-pointer"
            />
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <h1 className="maycole-company-name text-xl font-semibold">
                  MaycoleTracker
                  <sup className="maycole-trademark">™</sup>
                </h1>
                <Badge
                  variant="outline"
                  className="border-maycole-green text-maycole-green text-xs"
                >
                  Enterprise
                </Badge>
              </div>
              <p className="maycole-tagline text-xs">Advanced Inventory Management System</p>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-maycole-green text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-maycole-green to-maycole-gold rounded-lg opacity-20"
                      layoutId="activeNav"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-2"
            >
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-2 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-2"
            >
              <User className="w-4 h-4" />
              <span className="sr-only">Profile</span>
            </Button>

            {/* Emergency Stock Alert */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Badge variant="destructive" className="text-xs font-medium">
                Low Stock Alert
              </Badge>
            </motion.div>
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Package className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-maycole-green/20 bg-black/90">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`
                  flex flex-col items-center space-y-1 p-2 rounded-lg font-medium transition-all duration-200
                  ${isActive ? 'text-maycole-green' : 'text-gray-400 hover:text-white'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
}
