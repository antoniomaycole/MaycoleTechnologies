import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Smartphone, Apple, Download, Star, Zap, Shield, Bell, Cloud } from 'lucide-react';
import { Button } from './ui/button';

export function MobileAppSection() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description: 'Instant data synchronization across all devices',
    },
    {
      icon: Shield,
      title: 'Offline Mode',
      description: 'Work seamlessly even without internet',
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Stay updated with instant alerts',
    },
    {
      icon: Cloud,
      title: 'Cloud Backup',
      description: 'Automatic backup to secure cloud storage',
    },
  ];

  const stats = [
    { value: '4.9', label: 'App Store Rating' },
    { value: '50K+', label: 'Downloads' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-maycole-green/10 px-4 py-2 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-maycole-green" />
              <span className="text-sm font-semibold text-maycole-green">
                Mobile Apps Available
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="maycole-gradient-text inline-block leading-tight pb-1">
                Manage On The Go
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Access <span className="maycole-gradient-text">MaycoleTracker™</span> and{' '}
              <span className="maycole-gradient-text">MaycoleCheckBook™</span> anywhere, anytime
              with our powerful mobile applications for iOS and Android.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-6 flex items-center gap-3">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-6 flex items-center gap-3">
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    {stat.label.includes('Rating') && (
                      <Star className="w-5 h-5 text-maycole-gold fill-maycole-gold" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-maycole-green/20 to-maycole-gold/20 rounded-[3rem] blur-3xl"></div>

              {/* Phone Mockup */}
              <div className="relative">
                <Card className="max-w-sm mx-auto overflow-hidden border-8 border-gray-900 rounded-[3rem] shadow-2xl">
                  <CardContent className="p-0">
                    {/* Status Bar */}
                    <div className="bg-gradient-to-r from-maycole-green to-maycole-gold px-6 py-3 text-white flex items-center justify-between text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-white/30 rounded"></div>
                        <div className="w-4 h-4 bg-white/30 rounded"></div>
                        <div className="w-4 h-4 bg-white/30 rounded"></div>
                      </div>
                    </div>

                    {/* App Screen */}
                    <div className="bg-gray-50 p-6 min-h-[600px]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Dashboard</h3>
                          <p className="text-sm text-gray-600">MaycoleTracker™</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-full"></div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Total Items</div>
                          <div className="text-2xl font-bold text-gray-900">1,247</div>
                          <div className="text-xs text-green-600 mt-1">+12% this week</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="text-xs text-gray-600 mb-1">Low Stock</div>
                          <div className="text-2xl font-bold text-gray-900">23</div>
                          <div className="text-xs text-red-600 mt-1">Needs attention</div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-lg"></div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  Item #{1000 + i}
                                </div>
                                <div className="text-xs text-gray-500">Updated 2h ago</div>
                              </div>
                              <div className="text-xs font-semibold text-maycole-green">+50</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Nav */}
                      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm flex items-center justify-around">
                        {['Home', 'Analytics', 'Scan', 'Reports', 'More'].map((item, i) => (
                          <div key={i} className="text-center">
                            <div
                              className={`w-8 h-8 mx-auto rounded-lg mb-1 ${
                                i === 0
                                  ? 'bg-gradient-to-br from-maycole-green to-maycole-gold'
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                            <div
                              className={`text-xs ${i === 0 ? 'text-maycole-green font-semibold' : 'text-gray-500'}`}
                            >
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border-2 border-maycole-green/20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-maycole-gold fill-maycole-gold" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">4.9/5</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">50K+ downloads</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
