import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Check, Sparkles, ArrowRight, Gift, Shield, Zap, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TrialFeature {
  text: string;
  highlight?: boolean;
}

const trialFeatures: TrialFeature[] = [
  { text: 'No credit card required', highlight: true },
  { text: 'Full access to all Professional features', highlight: true },
  { text: 'Unlimited users during trial' },
  { text: 'Real-time AI analytics & insights' },
  { text: '1,000 items (MaycoleTracker™) or 500 transactions (MaycoleCheckBook™)' },
  { text: 'Mobile app access (iOS & Android)' },
  { text: 'Dedicated onboarding specialist' },
  { text: 'Email & chat support' },
  { text: 'Video training sessions' },
  { text: 'Data export anytime' },
  { text: 'Cancel anytime - no obligations' },
  { text: 'Upgrade/downgrade flexibility' }
];

const stats = [
  { icon: Clock, value: '14 Days', label: 'Free Trial' },
  { icon: Shield, value: '100%', label: 'Risk Free' },
  { icon: Zap, value: '2 Min', label: 'Setup Time' },
  { icon: Gift, value: '$0', label: 'Cost to Start' }
];

interface FreeTrialSectionProps {
  onLaunchTracker?: () => void;
}

export function FreeTrialSection({ onLaunchTracker }: FreeTrialSectionProps) {
  return (
    <section id="free-trial" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-maycole-green/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-l from-maycole-gold/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="overflow-hidden border-2 border-maycole-green/30 shadow-2xl bg-gradient-to-br from-white via-white to-maycole-green/5">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Side - CTA */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-6"
                  >
                    <Badge className="bg-gradient-to-r from-maycole-green to-maycole-gold text-white px-4 py-2 text-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Limited Time Offer - Start Free Today
                    </Badge>
                  </motion.div>

                  {/* Headline */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl lg:text-5xl font-bold mb-6"
                  >
                    <span className="maycole-gradient-text inline-block leading-tight pb-1">
                      Start Your Free Trial
                    </span>
                  </motion.h2>

                  {/* Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-xl text-gray-700 mb-8"
                  >
                    Experience the full power of <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span> with our 14-day free trial. No credit card required, no obligations.
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-4 mb-8"
                  >
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-lg flex items-center justify-center">
                            <stat.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      onClick={onLaunchTracker}
                      className="maycole-btn-primary px-8 py-6 text-lg flex items-center justify-center gap-2 group"
                    >
                      <span>Try MaycoleTracker™ Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      onClick={onLaunchTracker}
                      className="bg-white border-2 border-maycole-green text-maycole-green px-8 py-6 text-lg hover:bg-maycole-green hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Try MaycoleCheckBook™ Free</span>
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="text-sm text-gray-600 mt-6 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-maycole-green" />
                    <span>Trusted by 500+ enterprise companies worldwide</span>
                  </motion.p>
                </div>

                {/* Right Side - Features List */}
                <div className="bg-gradient-to-br from-maycole-green/5 to-maycole-gold/5 p-12 lg:p-16 border-l border-gray-200">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Gift className="w-6 h-6 text-maycole-green" />
                      What's Included
                    </h3>
                    <div className="space-y-3">
                      {trialFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + (index * 0.05) }}
                          viewport={{ once: true }}
                          className={`flex items-start gap-3 ${
                            feature.highlight ? 'bg-white rounded-lg p-3 border border-maycole-green/20 shadow-sm' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.highlight
                              ? 'bg-gradient-to-br from-maycole-green to-maycole-gold'
                              : 'bg-maycole-green'
                          }`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className={`text-gray-700 ${
                            feature.highlight ? 'font-semibold' : ''
                          }`}>
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-maycole-green" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-maycole-green" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-maycole-green" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-maycole-green" />
              <span>Instant Access</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Join over 500 companies already transforming their operations with{' '}
            <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span>
          </p>
        </motion.div>

        {/* Social Proof Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-maycole-green/10 via-maycole-gold/10 to-maycole-green/10 rounded-2xl p-6 max-w-4xl mx-auto border border-maycole-green/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Customer"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                <span className="text-maycole-green">2,847 companies</span> started their free trial this month
              </p>
              <p className="text-sm text-gray-600">Average setup time: 2 minutes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
