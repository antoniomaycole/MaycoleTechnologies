import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, Code, Database, Mail } from 'lucide-react';
import { Button } from './ui/button';

export function DemoDisclaimer() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Safe check for demo mode - with multiple fallbacks
  let isDemoMode = false;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DEMO_MODE === 'true') {
      isDemoMode = true;
    }
  } catch (e) {
    // Silently fail - demo mode will be false
  }
  
  if (!isDemoMode || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Icon & Message */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base font-semibold flex items-center gap-2 flex-wrap">
                  <span>🚧 Demo Mode</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-xs md:text-sm font-normal">
                    This is a demonstration site. Forms are simulated and data is not saved.
                  </span>
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs opacity-90 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    UI Complete
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Backend in Development
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Forms Simulated
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-white hover:bg-white/20 h-8 w-8 p-0"
              aria-label="Dismiss demo banner"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
