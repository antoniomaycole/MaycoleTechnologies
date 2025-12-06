'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Zap,
  ShieldCheck,
  Users,
  BarChart3,
  Smartphone,
  Lock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { PRICING_TIERS, createCheckoutSession, formatPrice, formatInterval } from '../lib/stripe';
import { getAnalytics } from '../lib/analytics-tracker';

interface PricingCardProps {
  tierId: string;
  isAnnual?: boolean;
  onSelectPlan: (tierId: string, email: string) => void;
  isLoading?: boolean;
}

/**
 * Individual Pricing Card Component
 */
const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ tierId, isAnnual: _isAnnual = false, onSelectPlan, isLoading = false }, ref) => {
    const tier = PRICING_TIERS[tierId];
    if (!tier) return null;

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const handleSelectPlan = async () => {
      // Free tier doesn't require email/payment
      if (tierId === 'trial') {
        const analytics = getAnalytics();
        analytics.trackEvent('payment', 'trial_selected', { tierId });
        toast.success('Start your free trial today!');
        onSelectPlan(tierId, 'trial@user.local');
        return;
      }

      if (!email.trim()) {
        setEmailError('Email is required');
        return;
      }

      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email');
        return;
      }

      setLocalLoading(true);
      const analytics = getAnalytics();
      analytics.trackEvent('payment', 'plan_selected', {
        tierId,
        email: email.substring(0, 3) + '***',
      });

      try {
        onSelectPlan(tierId, email);
      } finally {
        setLocalLoading(false);
      }
    };

    const displayPrice = tier.price;
    const displayInterval = formatInterval(tier.interval);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={cn(
          'relative rounded-2xl border-2 p-8 backdrop-blur-sm',
          tier.popular
            ? 'border-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 ring-2 ring-blue-500/20'
            : 'border-gray-200 bg-white/50 hover:border-gray-300'
        )}
      >
        {/* Popular Badge */}
        {tier.popular && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2"
          >
            <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
              Most Popular
            </span>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
          <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
        </div>

        {/* Price Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900">
              {tier.price === 0 ? 'Free' : formatPrice(displayPrice)}
            </span>
            {tier.interval && <span className="text-gray-600">{displayInterval}</span>}
          </div>
          {tier.price === 0 && (
            <p className="mt-2 text-sm text-gray-600">
              30 days free access, no credit card required
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="mb-8 space-y-3">
          {tier.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Email Input for Paid Tiers */}
        {tierId !== 'trial' && (
          <div className="mb-6">
            <input
              type="email"
              placeholder="help@maycoletechnologies.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              className={cn(
                'w-full rounded-lg border-2 px-4 py-2 text-sm transition-colors',
                emailError
                  ? 'border-red-500 bg-red-50 focus:outline-none'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:outline-none'
              )}
            />
            {emailError && <p className="mt-2 text-xs text-red-600">{emailError}</p>}
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleSelectPlan}
          disabled={isLoading || localLoading}
          className={cn(
            'w-full rounded-lg py-3 font-semibold transition-all',
            tier.popular
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
              : 'border-2 border-gray-300 text-gray-900 hover:border-gray-400'
          )}
        >
          {isLoading || localLoading ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {tierId === 'trial' ? 'Start Free Trial' : 'Get Started'}
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </>
          )}
        </Button>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          {tier.price === 0
            ? 'No credit card required'
            : 'Cancel anytime. Secure payment with Stripe.'}
        </p>
      </motion.div>
    );
  }
);

PricingCard.displayName = 'PricingCard';

/**
 * Enhanced Payment Section with Stripe Integration
 * Displays pricing tiers and handles checkout flow
 */
export const EnhancedPaymentSection = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const analytics = getAnalytics();
    analytics.trackEvent('engagement', 'pricing_view', {
      billingPeriod: isAnnual ? 'annual' : 'monthly',
    });
  }, [isAnnual]);

  const handleSelectPlan = async (tierId: string, email: string) => {
    setSelectedTier(tierId);
    setIsProcessing(true);

    try {
      // For free trial
      if (tierId === 'trial') {
        const analytics = getAnalytics();
        analytics.trackEvent('payment', 'trial_initiated', { email });
        toast.success('Welcome to Maycole Tracker! Check your email to get started.');
        setSelectedTier(null);
        return;
      }

      const tier = PRICING_TIERS[tierId];
      if (!tier || !tier.stripePriceId) {
        throw new Error('Invalid pricing tier or Stripe ID not configured');
      }

      // Create checkout session with Stripe
      const { url } = await createCheckoutSession(
        tier.stripePriceId,
        email,
        `${window.location.origin}/pricing-success`,
        `${window.location.origin}/pricing`
      );

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const analytics = getAnalytics();
      analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
        context: 'plan-selection',
        tierId,
      });
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-1/2 top-0 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-20" />
        <div className="absolute -left-1/2 bottom-0 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Choose the perfect plan for your inventory management needs
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                !isAnnual ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              )}
              aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
              aria-pressed={isAnnual}
            >
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              )}
            >
              <span
                className={cn(
                  'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                isAnnual ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {Object.keys(PRICING_TIERS).map((tierId) => (
            <PricingCard
              key={tierId}
              tierId={tierId}
              isAnnual={isAnnual}
              onSelectPlan={handleSelectPlan}
              isLoading={isProcessing && selectedTier === tierId}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-2xl border-2 border-gray-200 bg-white/50 p-8 backdrop-blur-sm"
        >
          <h3 className="mb-8 text-2xl font-bold text-gray-900">Feature Comparison</h3>

          <div className="space-y-4">
            {[
              { icon: Zap, label: 'Real-time Sync', all: true },
              { icon: BarChart3, label: 'Advanced Analytics', all: true },
              { icon: Users, label: 'Team Collaboration', all: true },
              { icon: ShieldCheck, label: 'Advanced Security', professional: true },
              { icon: Smartphone, label: 'Mobile App Access', professional: true },
              { icon: Lock, label: 'Dedicated Support', enterprise: true },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 border-b border-gray-100 py-4 last:border-b-0"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="flex-1 text-gray-700">{feature.label}</span>
                  <div className="flex gap-4 sm:w-1/3">
                    <div className="text-center">
                      {(feature.all || feature.professional || feature.enterprise) && (
                        <Check className="mx-auto h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-center">
                      {(feature.all || feature.professional || feature.enterprise) && (
                        <Check className="mx-auto h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-center">
                      {(feature.all || feature.enterprise) && (
                        <Check className="mx-auto h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h3 className="mb-8 text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle.',
              },
              {
                q: 'What happens after my free trial?',
                a: 'You can upgrade to any paid plan or continue with limited features. No automatic charges.',
              },
              {
                q: 'Is my payment secure?',
                a: 'Absolutely. We use Stripe for payment processing with industry-leading security and encryption.',
              },
              {
                q: 'Do you offer discounts?',
                a: 'Yes! Annual plans come with 20% discount. Contact us for enterprise volume discounts.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg bg-blue-50 p-6 text-left"
              >
                <h4 className="font-semibold text-gray-900">{faq.q}</h4>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

EnhancedPaymentSection.displayName = 'EnhancedPaymentSection';

export default EnhancedPaymentSection;
