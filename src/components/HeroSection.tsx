import { motion } from 'motion/react';
import { AtomicLogo } from './AtomicLogo';
import { Button } from './ui/button';
import { LeadCapture } from './LeadCapture';
import { Sparkles } from 'lucide-react';
import { getVisitorTrackingService } from '../services/VisitorTracking';

interface HeroSectionProps {
  onLaunchTracker?: () => void;
}

export function HeroSection({ onLaunchTracker }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="mt-6">
            <AtomicLogo size="lg" />
          </div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold maycole-gradient-text"
            >
              MaycoleTechnologies<span className="maycole-trademark">™</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto"
            >
              Changing The Future One Product At A Time
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center space-x-2 text-sm bg-maycole-green/10 border border-maycole-green px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-maycole-green" />
              <span className="text-gray-800 font-medium">Innovative Intelligence</span>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-maycole-green/10 border border-maycole-green px-4 py-2 rounded-full">
              <span>⚡</span>
              <span className="text-gray-800 font-medium">Spring Logic</span>
            </div>
          </motion.div>

          {/* Dual Product Launch Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            {/* MaycoleCheckBook Button */}
            <div className="w-full max-w-md">
              <Button
                onClick={() => {
                  const tracker = getVisitorTrackingService();
                  tracker.trackProductLaunch('MaycoleCheckBook™');
                  if (onLaunchTracker) {
                    onLaunchTracker();
                  } else {
                    console.warn('[HeroSection] onLaunchTracker prop not provided');
                  }
                }}
                className="maycole-btn-primary px-8 py-4 text-lg font-medium w-full group relative overflow-hidden"
              >
                <span>Launch MaycoleCheckBook™</span>
              </Button>
            </div>

            {/* MaycoleTracker Product Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="w-full max-w-md"
            >
              <div className="flex flex-col items-center gap-3 bg-maycole-green/10 border-2 border-maycole-green px-8 py-6 rounded-xl">
                <div className="text-center w-full">
                  <h3 className="text-2xl font-bold text-maycole-green mb-2">
                    MaycoleTracker vol XII
                  </h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-maycole-green font-semibold">Innovative Intelligence</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span className="text-gray-700 font-semibold">Spring Logic</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const tracker = getVisitorTrackingService();
                      tracker.trackProductLaunch('MaycoleTracker vol XII');
                      if (onLaunchTracker) {
                        onLaunchTracker();
                      }
                    }}
                    className="maycole-btn-primary w-full"
                  >
                    Launch MaycoleTracker
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Lead Capture - Seamless Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-12 w-full max-w-xl mx-auto"
            >
              <LeadCapture variant="inline" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
