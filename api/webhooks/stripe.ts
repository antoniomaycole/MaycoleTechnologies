/**
 * Stripe Webhook Endpoint
 * Handles all Stripe events: payments, subscriptions, charges
 *
 * POST /api/webhooks/stripe
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {
  verifyWebhookSignature,
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleChargeSucceeded,
  handleChargeFailed,
} from '@/lib/stripe-webhook-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'] as string;
  const body = req.body;

  if (!signature) {
    console.warn('No stripe-signature header');
    return res.status(400).json({ error: 'Missing signature' });
  }

  // Verify webhook signature
  const event = await verifyWebhookSignature(JSON.stringify(body), signature);

  if (!event) {
    console.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  console.log(`Received Stripe event: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription.id);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeSucceeded(charge);
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeFailed(charge);
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('Invoice payment succeeded');
        break;
      }

      case 'invoice.payment_failed': {
        console.log('Invoice payment failed');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 OK to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
