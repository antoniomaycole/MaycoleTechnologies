/**
 * Checkout Endpoint
 * Create Stripe Checkout Session for subscription
 *
 * POST /api/checkout
 *
 * Body:
 * {
 *   userId: string,
 *   priceId: string,
 *   tier: 'professional' | 'enterprise'
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { sql } from '@/lib/db/client';
import { extractToken, verifyToken } from '@/lib/auth-utils';
import { createStripeCustomer, getStripeCustomer } from '@/lib/stripe-webhook-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, tier } = req.body;

  // Verify authentication
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Validate inputs
  if (!priceId || !tier) {
    return res.status(400).json({ error: 'Missing priceId or tier' });
  }

  try {
    // Get user from database
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}::uuid
    `;

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Check if user already has a Stripe customer
    let customerId: string;
    const subscriptions = await sql`
      SELECT stripe_customer_id FROM subscriptions WHERE user_id = ${userId}::uuid
    `;

    if (subscriptions.length > 0) {
      customerId = subscriptions[0].stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await createStripeCustomer(
        user.email,
        `${user.first_name} ${user.last_name}`
      );
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      metadata: {
        userId,
        tier,
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
