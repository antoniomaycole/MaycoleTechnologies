import { motion } from 'motion/react';
import { AtomicLogo } from './AtomicLogo';
import { CleanIcon } from '../MaycoleTracker-Website-Logo-Transfer';
import { Button } from './ui/button';
import { BrandedIconButton } from './ui/branded-icon-button';
import { LeadCapture } from './LeadCapture';
import { Sparkles } from 'lucide-react';

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
          
          {/* Single MaycoleCheckBook Launch Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <Button
              onClick={onLaunchTracker}
              className="maycole-btn-primary px-8 py-4 text-lg font-medium group relative overflow-hidden"
            >
              <span>Launch MaycoleCheckBook™</span>
            </Button>
            
            {/* Branded Icon Button Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-4"
            >
              <BrandedIconButton 
                size="lg" 
                variant="default"
                text="MaycoleTechnologies"
              />
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