/**
 * Stripe Checkout API for Merchandise Store
 * This module handles creating Stripe checkout sessions for merchandise orders
 */

// @ts-ignore - stripe not installed yet
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

export interface CheckoutItem {
  id: string;
  name: string;
  price: number; // in cents
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  customer: CustomerInfo;
  shipping: number; // in cents
  tax: number; // in cents
}

/**
 * Create a Stripe checkout session for merchandise orders
 */
export async function createMerchandiseCheckoutSession(
  request: CheckoutRequest
): Promise<{ sessionId: string }> {
  try {
    // Validate request
    if (!request.items || request.items.length === 0) {
      throw new Error('No items in cart');
    }

    if (!request.customer?.email) {
      throw new Error('Customer email is required');
    }

    // Create line items from cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = request.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            product_id: item.id,
          },
        },
        unit_amount: Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (request.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(request.shipping),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item if applicable
    if (request.tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(request.tax),
        },
        quantity: 1,
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/store?success=true`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/store?canceled=true`,
      customer_email: request.customer.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX', 'GB', 'AU'],
      },
      metadata: {
        firstName: request.customer.firstName,
        lastName: request.customer.lastName,
        address: request.customer.address,
        city: request.customer.city,
        state: request.customer.state,
        zip: request.customer.zip,
        country: request.customer.country,
      },
    });

    if (!session.id) {
      throw new Error('Failed to create checkout session');
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook for payment completion
 */
export async function handleStripeWebhook(
  body: string | Buffer,
  signature: string
): Promise<{ success: boolean; event?: Stripe.Event }> {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Handle successful payment
        console.log('Payment successful:', session.id);
        // Email and database integration deferred to Phase 2
        // When implemented: send order confirmation email and create order record
        break;

      case 'checkout.session.async_payment_failed':
        // Handle failed payment
        console.log('Payment failed');
        break;

      case 'checkout.session.async_payment_succeeded':
        // Handle async payment success (bank transfer, etc.)
        console.log('Async payment succeeded');
        break;
    }

    return { success: true, event };
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}

/**
 * Get checkout session details
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Create a payment intent for merchandise orders (alternative to checkout sessions)
 */
export async function createPaymentIntent(
  request: CheckoutRequest
): Promise<{ clientSecret: string }> {
  try {
    const totalAmount =
      request.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      request.shipping +
      request.tax;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount),
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: request.customer.email,
      metadata: {
        customer_email: request.customer.email,
        customer_name: `${request.customer.firstName} ${request.customer.lastName}`,
      },
    });

    return { clientSecret: paymentIntent.client_secret || '' };
  } catch (error) {
    console.error('Payment intent error:', error);
    throw error;
  }
}
