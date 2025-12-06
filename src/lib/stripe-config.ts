/**
 * Stripe Configuration and Initialization
 * Handles Stripe.js loading, initialization, and payment processing
 *
 * Usage:
 * - Import { initStripe, getStripeInstance } from '@/lib/stripe-config'
 * - Call initStripe() on app startup
 * - Use getStripeInstance() to access Stripe object
 */

// @ts-ignore - @stripe/stripe-js not installed yet
import { Stripe as StripeType } from '@stripe/stripe-js';

declare global {
  interface Window {
    Stripe?: (publicKey: string) => StripeType;
  }
}

let stripeInstance: StripeType | null = null;
let stripePromise: Promise<StripeType | null> | null = null;

/**
 * Get Stripe public key from environment
 */
function getPublicKey(): string {
  const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (!key || key.startsWith('pk_')) {
    console.warn('[Stripe] Public key not configured or invalid');
    return '';
  }
  return key;
}

/**
 * Load Stripe.js library dynamically
 */
function loadStripeJS(): Promise<StripeType | null> {
  return new Promise((resolve) => {
    if (window.Stripe) {
      resolve(window.Stripe);
      return;
    }

    // Create script tag for Stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if (window.Stripe) {
        resolve(window.Stripe);
      } else {
        console.error('[Stripe] Failed to load Stripe.js');
        resolve(null);
      }
    };
    script.onerror = () => {
      console.error('[Stripe] Error loading Stripe.js');
      resolve(null);
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize Stripe instance
 * Call this once on app startup
 */
export async function initStripe(): Promise<StripeType | null> {
  if (stripePromise) {
    return stripePromise;
  }

  const publicKey = getPublicKey();
  if (!publicKey) {
    console.warn('[Stripe] Cannot initialize - public key missing');
    return null;
  }

  stripePromise = (async () => {
    try {
      const Stripe = await loadStripeJS();
      if (!Stripe) {
        console.error('[Stripe] Failed to load Stripe.js');
        return null;
      }

      stripeInstance = Stripe(publicKey);
      console.log('[Stripe] Initialized successfully');
      return stripeInstance;
    } catch (error) {
      console.error('[Stripe] Initialization error:', error);
      return null;
    }
  })();

  return stripePromise;
}

/**
 * Get initialized Stripe instance
 * Returns null if not yet initialized
 */
export function getStripeInstance(): StripeType | null {
  return stripeInstance;
}

/**
 * Wait for Stripe to be ready
 */
export async function waitForStripe(): Promise<StripeType | null> {
  if (stripeInstance) {
    return stripeInstance;
  }
  return stripePromise || initStripe();
}

/**
 * Check if Stripe is available
 */
export function isStripeAvailable(): boolean {
  return !!stripeInstance && !!getPublicKey();
}

/**
 * Redirect to Stripe checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await waitForStripe();
  if (!stripe) {
    throw new Error('Stripe not available');
  }

  try {
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw new Error(error.message || 'Checkout redirect failed');
    }
  } catch (error) {
    console.error('[Stripe] Checkout redirect error:', error);
    throw error;
  }
}

/**
 * Retrieve checkout session details
 */
export async function retrieveCheckoutSession(sessionId: string): Promise<any> {
  try {
    const response = await fetch(`/api/checkout/session/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve session');
    }
    return await response.json();
  } catch (error) {
    console.error('[Stripe] Session retrieval error:', error);
    throw error;
  }
}

/**
 * Create payment method
 */
export async function createPaymentMethod(
  stripe: StripeType,
  elements: any,
  data: any
): Promise<any> {
  try {
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement('card'),
      billing_details: data,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentMethod;
  } catch (error) {
    console.error('[Stripe] Payment method creation error:', error);
    throw error;
  }
}

/**
 * Confirm card payment
 */
export async function confirmCardPayment(
  stripe: StripeType,
  clientSecret: string,
  data: any
): Promise<any> {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('[Stripe] Card payment confirmation error:', error);
    throw error;
  }
}

/**
 * Handle 3D Secure authentication
 */
export async function handle3DSecure(stripe: StripeType, clientSecret: string): Promise<any> {
  try {
    const result = await stripe.handleCardAction(clientSecret);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('[Stripe] 3D Secure handling error:', error);
    throw error;
  }
}

export default {
  initStripe,
  getStripeInstance,
  waitForStripe,
  isStripeAvailable,
  redirectToCheckout,
  retrieveCheckoutSession,
  createPaymentMethod,
  confirmCardPayment,
  handle3DSecure,
};
