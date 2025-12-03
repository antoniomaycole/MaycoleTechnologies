import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Mail, Gift, CheckCircle, ArrowRight, Sparkles, Download, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { subscribeToNewsletter } from '../lib/email';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await subscribeToNewsletter({ email });
      
      if (result.success) {
        toast.success(result.message);
        setIsSubmitted(true);
        setEmail('');
        // Reset after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const leadMagnets = [
    {
      icon: Download,
      title: 'Free eBook',
      description: 'The Ultimate Guide to Inventory Management'
    },
    {
      icon: BookOpen,
      title: 'Best Practices',
      description: 'AI-Powered Financial Tracking for 2025'
    },
    {
      icon: TrendingUp,
      title: 'ROI Calculator',
      description: 'Calculate Your Potential Savings'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div className="absolute inset-0 bg-no-repeat" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1e7f3e 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
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
                      Join 10,000+ professionals receiving exclusive tips, industry insights, and product updates.
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
                          <span className="font-semibold">10,000+</span> subscribers already learning
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="p-10 lg:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {!isSubmitted ? (
                      <>
                        <div className="mb-6">
                          <div className="inline-flex items-center gap-2 bg-maycole-green/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-maycole-green" />
                            <span className="text-sm font-semibold text-maycole-green">100% Free</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Subscribe to Our Newsletter
                          </h3>
                          <p className="text-gray-600">
                            Get weekly insights on inventory management, financial tracking, and AI automation.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maycole-green focus:border-transparent text-gray-900"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="maycole-btn-primary w-full py-3 text-base flex items-center justify-center gap-2 group"
                          >
                            {isLoading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                <span>Subscribing...</span>
                              </>
                            ) : (
                              <>
                                <span>Get Free Resources</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </form>

                        {/* Benefits */}
                        <div className="mt-6 space-y-2">
                          {[
                            'Exclusive industry insights & trends',
                            'Early access to new features',
                            'Free downloadable resources',
                            'Unsubscribe anytime - no spam'
                          ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-maycole-green flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-gray-500 mt-6">
                          By subscribing, you agree to our Privacy Policy and consent to receive updates from{' '}
                          <span className="maycole-gradient-text">MaycoleTechnologies</span><span className="maycole-trademark">™</span>
                        </p>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                          className="w-20 h-20 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          You're All Set! 🎉
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Check your email for your free resources and confirmation.
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          className="bg-white border-2 border-maycole-green text-maycole-green hover:bg-maycole-green hover:text-white transition-all duration-300"
                        >
                          Subscribe Another Email
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}