import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BookOpen,
  X,
  Brain,
  Shield,
  TrendingUp,
  Zap,
  Mic,
  Scan,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function ReadmeModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Founder Notes Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 backdrop-blur-md"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        📘 Founder Notes
      </Button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-gradient-to-br from-purple-950/95 via-purple-900/95 to-black/95 border-purple-500/30 shadow-2xl backdrop-blur-md">
                <CardHeader className="relative border-b border-purple-500/20">
                  {/* Close Button */}
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-purple-300 hover:text-white hover:bg-purple-500/20 z-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Header Content */}
                  <div className="pr-12">
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                      <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                        MAYCOLETracker™
                      </span>
                      <span className="text-purple-400 ml-2 text-lg">— v1.0.0</span>
                    </CardTitle>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        Launch Date: Sept 30, 2025
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-300 border-purple-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Powered by: MAYCOLE Method™
                      </Badge>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-purple-500/5 rounded-full blur-lg" />
                </CardHeader>

                <CardContent className="p-8 overflow-y-auto max-h-[60vh]">
                  {/* What This App Does Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      🧠 What This App Does
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/40 transition-colors">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="font-medium text-purple-200">Supplies</span>
                        </div>
                        <p className="text-purple-300/80 text-sm">Track inventory in real time</p>
                      </div>

                      <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/40 transition-colors">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="font-medium text-purple-200">Analytics</span>
                        </div>
                        <p className="text-purple-300/80 text-sm">Visualize usage and trends</p>
                      </div>

                      <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/40 transition-colors">
                        <div className="flex items-center mb-2">
                          <Scan className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="font-medium text-purple-200">Scanner</span>
                        </div>
                        <p className="text-purple-300/80 text-sm">
                          Use native camera for barcode input
                        </p>
                      </div>

                      <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/40 transition-colors">
                        <div className="flex items-center mb-2">
                          <Mic className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="font-medium text-purple-200">Microphone</span>
                        </div>
                        <p className="text-purple-300/80 text-sm">Voice-activated logging</p>
                      </div>

                      <div className="md:col-span-2 bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/40 transition-colors">
                        <div className="flex items-center mb-2">
                          <Zap className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="font-medium text-purple-200">Premium Dashboard</span>
                        </div>
                        <p className="text-purple-300/80 text-sm">
                          Founder-grade insights with AI-powered analytics
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* IP Protection Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      🔐 IP Protection
                    </h3>

                    <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-500/30 rounded-lg p-6">
                      <p className="text-purple-200 leading-relaxed">
                        All logic is <strong className="text-purple-100">timestamped</strong>,{' '}
                        <strong className="text-purple-100">branded</strong>, and{' '}
                        <strong className="text-purple-100">modular</strong>. No placeholder code.
                        No rogue assets. Every component reflects the
                        <span className="text-purple-300 font-semibold"> MAYCOLE Method™</span>{' '}
                        philosophy of enterprise-grade development with complete intellectual
                        property protection.
                      </p>
                    </div>
                  </motion.div>

                  {/* Scaling Vision Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      📈 Scaling Vision
                    </h3>

                    <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 border border-purple-500/30 rounded-lg p-6">
                      <p className="text-purple-200 leading-relaxed mb-4">
                        This module is part of a larger ecosystem—
                        <strong className="text-purple-100">GroupHome™</strong>,
                        <strong className="text-purple-100"> FaithTech™</strong>,{' '}
                        <strong className="text-purple-100">MusicOps™</strong>—each built with
                        teachability and legacy in mind.
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Modular Architecture
                        </Badge>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          <Brain className="w-3 h-3 mr-1" />
                          AI-First Design
                        </Badge>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Enterprise Security
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-purple-500/20 bg-purple-950/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-purple-400">
                      © 2025{' '}
                      <span className="text-purple-300 font-medium">MaycoleTechnologies™</span>
                      <span className="mx-2">•</span>
                      Built with <span className="text-purple-300">MAYCOLE Method™</span>
                    </p>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
