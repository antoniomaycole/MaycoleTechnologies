/**
 * Stripe Payment Integration Module
 * Handles all Stripe payment processing, checkout sessions, and subscriptions
 * Integrates with analytics tracking for payment events
 */

import { getAnalytics } from './analytics-tracker';

// Type declaration for Stripe on window
declare global {
  interface Window {
    Stripe?: (publicKey: string) => any;
  }

  interface ImportMeta {
    readonly env: {
      readonly VITE_STRIPE_PUBLIC_KEY?: string;
      readonly VITE_API_BASE_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

// Stripe configuration
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Product pricing configuration
 * Matches PaymentSection and other payment components
 */
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number; // in cents (e.g., 9900 = $99.00)
  currency: string;
  interval?: 'month' | 'year' | null; // null for one-time purchases
  features: string[];
  icon?: string;
  popular?: boolean;
  stripePriceId?: string; // Stripe Price ID for subscriptions
  stripeProductId?: string; // Stripe Product ID
}

/**
 * Pricing tiers for the Tracker application
 * Used across PaymentSection and checkout flows
 */
export const PRICING_TIERS: Record<string, PricingTier> = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    description: 'Get started with essential features',
    price: 0,
    currency: 'USD',
    interval: null,
    features: [
      '30-day free access',
      'Basic inventory tracking',
      'Up to 5 products',
      'Email support',
      'Basic analytics',
    ],
    icon: 'Gift',
    stripePriceId: '',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses',
    price: 9900, // $99/month
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited inventory tracking',
      'Advanced analytics',
      'Team collaboration (up to 5 users)',
      'Real-time sync',
      'Priority email support',
      'Mobile app access',
      'Custom reports',
      'API access',
    ],
    icon: 'Zap',
    popular: true,
    stripePriceId: process.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY || '',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale operations',
    price: 29900, // $299/month
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Advanced security & compliance',
      '24/7 phone + email support',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced data export',
      'White-label options',
    ],
    icon: 'Building2',
    stripePriceId: process.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
  },
};

/**
 * Payment intent response from backend
 */
export interface PaymentIntent {
  clientSecret: string;
  publishableKey: string;
  amount: number;
  currency: string;
  status: string;
  email?: string;
  priceId?: string;
}

/**
 * Checkout session response from backend
 */
export interface CheckoutSession {
  id: string;
  url: string;
  stripeSessionId: string;
}

/**
 * Customer subscription data
 */
export interface Subscription {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

/**
 * Initialize Stripe (load script if needed)
 * This is called automatically when first payment flow is initiated
 * Stripe.js is loaded dynamically via CDN script tag
 */
let stripeInstance: any = null;

async function loadStripe() {
  if (stripeInstance) return stripeInstance;

  if (!STRIPE_PUBLIC_KEY) {
    console.error('Stripe public key not configured');
    throw new Error('Stripe public key is not configured');
  }

  // Load Stripe.js from CDN dynamically
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      // Stripe script already loaded
      resolve(window.Stripe(STRIPE_PUBLIC_KEY));
      return;
    }

    // Create and append Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (window.Stripe) {
        stripeInstance = window.Stripe(STRIPE_PUBLIC_KEY);
        resolve(stripeInstance);
      } else {
        reject(new Error('Stripe failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
}

/**
 * Create a payment intent for one-time purchases
 * @param amount Amount in cents
 * @param email Customer email
 * @param metadata Additional metadata
 */
export async function createPaymentIntent(
  amount: number,
  email: string,
  metadata?: Record<string, string>
): Promise<PaymentIntent> {
  try {
    const analytics = getAnalytics();
    analytics.trackEvent('payment', 'intent_start', {
      amount,
      email: email.substring(0, 3) + '***', // Mask email
    });

    const response = await fetch(`${API_BASE_URL}/payments/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        email,
        metadata: {
          ...metadata,
          source: 'website',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data as PaymentIntent;
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'payment-intent-creation',
      amount,
    });
    throw error;
  }
}

/**
 * Create a checkout session for subscriptions
 * @param priceId Stripe price ID
 * @param email Customer email
 * @param successUrl Redirect URL after successful payment
 * @param cancelUrl Redirect URL if payment is cancelled
 */
export async function createCheckoutSession(
  priceId: string,
  email: string,
  successUrl: string = `${window.location.origin}/success`,
  cancelUrl: string = `${window.location.origin}/pricing`
): Promise<CheckoutSession> {
  try {
    const analytics = getAnalytics();
    analytics.trackEvent('payment', 'checkout_start', {
      priceId,
      email: email.substring(0, 3) + '***',
    });

    const response = await fetch(`${API_BASE_URL}/payments/checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        email,
        successUrl,
        cancelUrl,
        metadata: {
          source: 'website',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data as CheckoutSession;
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'checkout-session-creation',
      priceId,
    });
    throw error;
  }
}

/**
 * Redirect to Stripe checkout
 * @param sessionId Stripe checkout session ID
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  try {
    const stripe = await loadStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message || 'Failed to redirect to checkout');
    }

    const analytics = getAnalytics();
    analytics.trackEvent('payment', 'checkout_redirect', { sessionId });
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'checkout-redirect',
      sessionId,
    });
    throw error;
  }
}

/**
 * Confirm payment with Stripe Elements
 * Used for embedded payment forms
 * @param elements Stripe Elements instance
 * @param clientSecret Payment intent client secret
 * @param returnUrl Return URL after authentication
 */
export async function confirmPayment(
  elements: any,
  clientSecret: string,
  returnUrl: string = window.location.origin
): Promise<any> {
  try {
    const stripe = await loadStripe();

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      const analytics = getAnalytics();
      analytics.trackError(error.message || 'Payment confirmation failed', {
        context: 'payment-confirmation',
        code: error.code,
      });
      throw new Error(error.message);
    }

    const analytics = getAnalytics();
    analytics.trackEvent('payment', 'success', {
      intentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });

    return paymentIntent;
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'payment-confirmation',
    });
    throw error;
  }
}

/**
 * Get customer subscription status
 * @param customerId Stripe customer ID or email
 */
export async function getSubscriptionStatus(customerId: string): Promise<Subscription | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payments/subscription?customerId=${encodeURIComponent(customerId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch subscription');
    }

    return (await response.json()) as Subscription;
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'get-subscription-status',
      customerId,
    });
    return null;
  }
}

/**
 * Cancel subscription
 * @param subscriptionId Stripe subscription ID
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    const analytics = getAnalytics();
    analytics.trackEvent('payment', 'subscription_cancel_request', {
      subscriptionId,
    });

    const response = await fetch(`${API_BASE_URL}/payments/subscription/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriptionId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    analytics.trackEvent('payment', 'subscription_cancelled', {
      subscriptionId,
    });
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'cancel-subscription',
      subscriptionId,
    });
    throw error;
  }
}

/**
 * Validate payment completion using session ID
 * Called on success redirect page
 * @param sessionId Stripe checkout session ID
 */
export async function validatePaymentSession(
  sessionId: string
): Promise<{ success: boolean; email?: string; priceId?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payments/validate-session?sessionId=${encodeURIComponent(sessionId)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Failed to validate session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const analytics = getAnalytics();
    analytics.trackError(error instanceof Error ? error.message : 'Unknown error', {
      context: 'validate-payment-session',
      sessionId,
    });
    return { success: false };
  }
}

/**
 * Get pricing tier by ID
 * @param tierId Pricing tier ID (trial, professional, enterprise)
 */
export function getPricingTier(tierId: string): PricingTier | null {
  return PRICING_TIERS[tierId] || null;
}

/**
 * Format price for display
 * @param price Price in cents
 * @param currency Currency code (USD, EUR, etc)
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(price / 100);
}

/**
 * Get monthly price for annual billing with discount
 * @param monthlyPrice Annual price
 * @param discountPercent Discount percentage (e.g., 20 for 20% off)
 */
export function calculateAnnualDiscount(
  monthlyPrice: number,
  discountPercent: number = 20
): number {
  const annualPrice = monthlyPrice * 12;
  return Math.round(annualPrice * (1 - discountPercent / 100));
}

/**
 * Format subscription interval for display
 * @param interval Interval (month, year)
 */
export function formatInterval(interval: string | null | undefined): string {
  if (!interval) return 'one-time';
  if (interval === 'month') return 'per month';
  if (interval === 'year') return 'per year';
  return interval;
}

export default {
  PRICING_TIERS,
  createPaymentIntent,
  createCheckoutSession,
  redirectToCheckout,
  confirmPayment,
  getSubscriptionStatus,
  cancelSubscription,
  validatePaymentSession,
  getPricingTier,
  formatPrice,
  calculateAnnualDiscount,
  formatInterval,
};
