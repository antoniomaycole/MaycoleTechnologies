import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from './ui/utils';
import { toast } from 'sonner';
import { getAnalytics } from '../lib/analytics-tracker';

interface LeadCaptureProps {
  variant?: 'modal' | 'inline' | 'compact' | 'full';
  onLeadCapture?: (email: string, name?: string) => void;
  className?: string;
}

interface LeadFormState {
  email: string;
  name: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

/**
 * Lead Capture Component
 * Converts website visitors into email subscribers and traceable leads
 * Features:
 * - Email validation
 * - Name capture (optional)
 * - Success tracking
 * - Multiple display variants
 * - Integration with Mailchimp API
 * - Lead scoring
 */
export const LeadCapture = React.forwardRef<HTMLDivElement, LeadCaptureProps>(
  ({ variant = 'inline', onLeadCapture, className }, ref) => {
    const [formState, setFormState] = useState<LeadFormState>({
      email: '',
      name: '',
      isLoading: false,
      isSuccess: false,
      error: null,
    });

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: value,
        error: null,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Track form submission attempt
      const analytics = getAnalytics();
      analytics.trackFormStart('lead-capture');

      // Validation
      if (!formState.email.trim()) {
        setFormState(prev => ({
          ...prev,
          error: 'Email is required',
        }));
        return;
      }

      if (!validateEmail(formState.email)) {
        setFormState(prev => ({
          ...prev,
          error: 'Please enter a valid email address',
        }));
        return;
      }

      setFormState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        // Call API to subscribe to Mailchimp/email service
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email,
            name: formState.name || 'Subscriber',
            source: 'website-visitor',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to subscribe');
        }

        await response.json();

        // Track successful form submission
        analytics.trackFormSubmit('lead-capture', true);

        // Success state
        setFormState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        // Call optional callback
        onLeadCapture?.(formState.email, formState.name);

        // Show success message
        toast.success('Welcome! Check your email for exclusive insights on Voice First Apps 🎉');

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormState({
            email: '',
            name: '',
            isLoading: false,
            isSuccess: false,
            error: null,
          });
        }, 3000);
      } catch (error) {
        // Track failed form submission
        analytics.trackFormSubmit('lead-capture', false);
        analytics.trackError(
          error instanceof Error ? error.message : 'Unknown error',
          { source: 'lead-capture-submission' }
        );
        
        setFormState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to subscribe. Please try again.',
        }));
        toast.error('Subscription failed. Please try again.');
      }
    };

    // Modal variant - full-width form
    if (variant === 'modal') {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'bg-white rounded-xl shadow-2xl p-8 max-w-md mx-auto border border-gray-200',
            className
          )}
        >
          <h3 className="text-2xl font-bold maycole-gradient-text mb-2">
            Get Early Access
          </h3>
          <p className="text-gray-600 mb-6">
            Join our community preparing to take over the world with Voice First Apps
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Your Name (optional)"
                value={formState.name}
                onChange={handleInputChange}
                disabled={formState.isLoading || formState.isSuccess}
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formState.email}
                onChange={handleInputChange}
                disabled={formState.isLoading || formState.isSuccess}
                className={cn(
                  'w-full',
                  formState.error && 'border-red-500'
                )}
              />
              {formState.error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formState.error}
                </p>
              )}
            </div>

            {formState.isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Subscribed!</p>
                  <p className="text-sm text-green-800">Check your email for next steps</p>
                </div>
              </div>
            ) : (
              <Button
                type="submit"
                disabled={formState.isLoading}
                className="w-full maycole-btn-primary"
              >
                {formState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe Now
                  </>
                )}
              </Button>
            )}
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      );
    }

    // Inline variant - horizontal form
    if (variant === 'inline') {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={cn(
            'w-full max-w-2xl mx-auto',
            className
          )}
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formState.name}
              onChange={handleInputChange}
              disabled={formState.isLoading || formState.isSuccess}
              className="flex-1 min-w-0"
            />
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formState.email}
              onChange={handleInputChange}
              disabled={formState.isLoading || formState.isSuccess}
              className={cn(
                'flex-1 min-w-0',
                formState.error && 'border-red-500'
              )}
            />
            <Button
              type="submit"
              disabled={formState.isLoading || formState.isSuccess}
              className="maycole-btn-primary whitespace-nowrap"
            >
              {formState.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : formState.isSuccess ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </Button>
          </form>
          {formState.error && (
            <p className="text-red-500 text-sm mt-2">{formState.error}</p>
          )}
        </motion.div>
      );
    }

    // Compact variant - small footer form
    if (variant === 'compact') {
      return (
        <motion.div
          ref={ref}
          className={cn('w-full', className)}
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formState.email}
              onChange={handleInputChange}
              disabled={formState.isLoading || formState.isSuccess}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={formState.isLoading || formState.isSuccess}
              className="maycole-btn-primary"
            >
              {formState.isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Mail className="w-3 h-3" />
              )}
            </Button>
          </form>
        </motion.div>
      );
    }

    // Full variant - complete card with all fields
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={cn(
          'bg-gradient-to-br from-maycole-green/10 to-maycole-blue/10 rounded-2xl border-2 border-maycole-green/30 p-8 w-full max-w-2xl mx-auto',
          className
        )}
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold maycole-gradient-text">
              Become a Voice First Pioneer
            </h2>
            <p className="text-gray-700 text-lg">
              Get exclusive early access to MaycoleTechnologies' Voice First Apps platform
            </p>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-maycole-green flex-shrink-0" />
              <span>Early access to Voice First App features</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-maycole-green flex-shrink-0" />
              <span>Exclusive insights on voice technology trends</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-maycole-green flex-shrink-0" />
              <span>Direct access to our innovation team</span>
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formState.name}
                onChange={handleInputChange}
                disabled={formState.isLoading || formState.isSuccess}
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="your@company.com"
                value={formState.email}
                onChange={handleInputChange}
                disabled={formState.isLoading || formState.isSuccess}
                className={formState.error ? 'border-red-500' : ''}
              />
              {formState.error && (
                <p className="text-red-500 text-sm mt-2">{formState.error}</p>
              )}
            </div>

            {formState.isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center"
              >
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Welcome aboard!</p>
                <p className="text-sm text-green-800">Check your email for exclusive content</p>
              </motion.div>
            ) : (
              <Button
                type="submit"
                disabled={formState.isLoading}
                className="w-full maycole-btn-primary h-12 text-base font-semibold"
              >
                {formState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Get Early Access
                  </>
                )}
              </Button>
            )}
          </form>

          <p className="text-xs text-gray-600 text-center">
            🔒 Your information is secure. We never spam. Unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    );
  }
);

LeadCapture.displayName = 'LeadCapture';

export default LeadCapture;
