import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Settings } from 'lucide-react';
import { DevPanel } from './DevPanel';
import { Button } from './ui/button';

export function DevButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + Shift + D
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Floating Dev Button - Bottom Right Corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          onClick={() => setIsPanelOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-2 border-white/20 hover:scale-110 transition-transform"
          title="Open Developer Panel"
        >
          <motion.div
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-6 h-6" />
          </motion.div>
        </Button>
        
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="font-medium">Dev Panel</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dev Panel Modal */}
      <AnimatePresence>
        {isPanelOpen && (
          <DevPanel onClose={() => setIsPanelOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}