import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingTrialButtonProps {
  onLaunchTracker?: () => void;
}

export function FloatingTrialButton({ onLaunchTracker }: FloatingTrialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <div className="relative">
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3 text-white" />
            </button>

            {/* Main Button */}
            <Button
              onClick={() => {
                if (onLaunchTracker) {
                  onLaunchTracker();
                } else {
                  console.warn('[FloatingTrialButton] onLaunchTracker prop not provided');
                }
              }}
              className="maycole-btn-primary px-6 py-4 text-base font-semibold shadow-2xl flex items-center gap-2 group relative overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Content */}
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Start Free Trial</span>

              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-lg"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </Button>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-3 -left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              14 Days FREE
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
