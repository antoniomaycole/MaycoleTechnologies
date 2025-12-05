/**
 * Stripe Webhook Utilities
 * Verify webhook signatures and handle events
 */

import Stripe from 'stripe';
import { sql } from './db/client';
import { Subscription, Payment } from './db/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Verify Stripe webhook signature
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event | null> {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;

  if (!userId || !session.customer) {
    console.warn('Missing userId or customer in session metadata');
    return;
  }

  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Update database
    await sql`
      INSERT INTO subscriptions (
        user_id,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_price_id,
        tier,
        status,
        current_period_start,
        current_period_end
      )
      VALUES (
        ${userId}::uuid,
        ${session.customer},
        ${session.subscription},
        ${subscription.items.data[0].price.id},
        ${tier || 'professional'},
        ${subscription.status},
        to_timestamp(${subscription.current_period_start}),
        to_timestamp(${subscription.current_period_end})
      )
      ON CONFLICT (stripe_subscription_id) DO UPDATE SET
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        updated_at = CURRENT_TIMESTAMP;
    `;

    console.log(`Subscription created for user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    await sql`
      UPDATE subscriptions
      SET
        status = ${subscription.status},
        current_period_start = to_timestamp(${subscription.current_period_start}),
        current_period_end = to_timestamp(${subscription.current_period_end}),
        cancel_at_period_end = ${subscription.cancel_at_period_end},
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ${subscription.id};
    `;

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(subscriptionId: string) {
  try {
    await sql`
      UPDATE subscriptions
      SET
        status = 'canceled',
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ${subscriptionId};
    `;

    console.log(`Subscription deleted: ${subscriptionId}`);
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}

/**
 * Handle charge.succeeded event
 */
export async function handleChargeSucceeded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent;

  if (!paymentIntentId) {
    console.warn('No payment intent in charge');
    return;
  }

  try {
    // Get user from payment intent metadata
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
    const userId = intent.metadata?.userId;

    if (!userId) {
      console.warn('No userId in payment intent metadata');
      return;
    }

    // Insert payment record
    await sql`
      INSERT INTO payments (
        user_id,
        stripe_payment_intent_id,
        stripe_invoice_id,
        amount,
        currency,
        status,
        description
      )
      VALUES (
        ${userId}::uuid,
        ${paymentIntentId},
        ${charge.invoice || null},
        ${charge.amount},
        ${charge.currency.toUpperCase()},
        'succeeded',
        ${charge.description || 'Payment processed'}
      )
      ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET
        status = 'succeeded',
        updated_at = CURRENT_TIMESTAMP;
    `;

    console.log(`Payment recorded for user ${userId}`);
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
}

/**
 * Handle charge.failed event
 */
export async function handleChargeFailed(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent;

  if (!paymentIntentId) return;

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
    const userId = intent.metadata?.userId;

    if (userId) {
      await sql`
        UPDATE payments
        SET
          status = 'failed',
          updated_at = CURRENT_TIMESTAMP
        WHERE stripe_payment_intent_id = ${paymentIntentId};
      `;
    }
  } catch (error) {
    console.error('Error handling charge failure:', error);
  }
}

/**
 * Create Stripe customer
 */
export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

/**
 * Get Stripe customer
 */
export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}
