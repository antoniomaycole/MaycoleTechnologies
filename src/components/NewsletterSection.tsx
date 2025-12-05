import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Mail, Gift, CheckCircle, Sparkles, Download, BookOpen, TrendingUp } from 'lucide-react';
import { LeadCapture } from './LeadCapture';

export function NewsletterSection() {
  const leadMagnets = [
    {
      icon: Download,
      title: 'Free eBook',
      description: 'The Ultimate Guide to Inventory Management',
    },
    {
      icon: BookOpen,
      title: 'Best Practices',
      description: 'AI-Powered Financial Tracking for 2025',
    },
    {
      icon: TrendingUp,
      title: 'ROI Calculator',
      description: 'Calculate Your Potential Savings',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1e7f3e 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden border-2 border-maycole-green/20 shadow-xl bg-gradient-to-br from-white to-maycole-green/5">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Side - Lead Magnets */}
                <div className="bg-gradient-to-br from-maycole-green to-maycole-gold p-10 lg:p-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm font-semibold">Free Resources</span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                      Get Expert Insights Delivered
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                      Join 10,000+ professionals receiving exclusive tips, industry insights, and
                      product updates.
                    </p>

                    {/* Lead Magnets */}
                    <div className="space-y-4">
                      {leadMagnets.map((magnet, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <magnet.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{magnet.title}</h4>
                            <p className="text-sm text-white/80">{magnet.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Trust Indicator */}
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 bg-white rounded-full border-2 border-maycole-green flex items-center justify-center text-xs font-bold text-maycole-green"
                            >
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-white/90">
                          <span className="font-semibold">10,000+</span> subscribers already
                          learning
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Lead Capture Form */}
                <div className="p-10 lg:p-12 flex flex-col justify-center">
                  <LeadCapture variant="compact" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
