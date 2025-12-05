/**
 * Subscription Management Service
 * Handle subscription lifecycle, upgrades, downgrades, cancellations
 */

import { sql } from '@/lib/db/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface SubscriptionDetails {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  tier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create new subscription
 */
export async function createSubscription(
  userId: string,
  customerId: string,
  priceId: string,
  tier: 'professional' | 'enterprise'
): Promise<SubscriptionDetails> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  const result = await sql`
    INSERT INTO subscriptions (
      user_id,
      stripe_customer_id,
      stripe_subscription_id,
      stripe_price_id,
      tier,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end
    )
    VALUES (
      ${userId},
      ${customerId},
      ${subscription.id},
      ${priceId},
      ${tier},
      ${subscription.status},
      ${new Date(subscription.current_period_start * 1000)},
      ${new Date(subscription.current_period_end * 1000)},
      ${subscription.cancel_at_period_end}
    )
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Get user's current subscription
 */
export async function getSubscription(userId: string): Promise<SubscriptionDetails | null> {
  const result = await sql`
    SELECT * FROM subscriptions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return result.rows[0] || null;
}

/**
 * Upgrade subscription tier
 */
export async function upgradeSubscription(
  userId: string,
  newPriceId: string,
  newTier: 'professional' | 'enterprise'
): Promise<SubscriptionDetails> {
  const subscription = await getSubscription(userId);
  if (!subscription) {
    throw new Error('No active subscription found');
  }

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      items: [
        {
          id: subscription.stripe_subscription_id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    }
  );

  const result = await sql`
    UPDATE subscriptions
    SET 
      stripe_price_id = ${newPriceId},
      tier = ${newTier},
      status = ${updatedSubscription.status},
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  userId: string,
  immediate: boolean = false
): Promise<SubscriptionDetails> {
  const subscription = await getSubscription(userId);
  if (!subscription) {
    throw new Error('No active subscription found');
  }

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      cancel_at_period_end: !immediate,
    }
  );

  if (immediate) {
    await stripe.subscriptions.del(subscription.stripe_subscription_id);
  }

  const result = await sql`
    UPDATE subscriptions
    SET 
      status = ${updatedSubscription.status},
      cancel_at_period_end = ${updatedSubscription.cancel_at_period_end},
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(userId: string): Promise<SubscriptionDetails> {
  const subscription = await getSubscription(userId);
  if (!subscription) {
    throw new Error('No subscription found');
  }

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      cancel_at_period_end: false,
    }
  );

  const result = await sql`
    UPDATE subscriptions
    SET 
      status = ${updatedSubscription.status},
      cancel_at_period_end = false,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING *
  `;

  return result.rows[0];
}

/**
 * Get subscription usage
 */
export async function getSubscriptionUsage(userId: string): Promise<{
  subscription: SubscriptionDetails | null;
  usage: {
    api_calls: number;
    storage_gb: number;
    users: number;
  };
  limits: {
    api_calls_monthly: number;
    storage_gb: number;
    users: number;
  };
}> {
  const subscription = await getSubscription(userId);

  // Define tier limits
  const tierLimits: Record<
    string,
    { api_calls_monthly: number; storage_gb: number; users: number }
  > = {
    free: { api_calls_monthly: 1000, storage_gb: 1, users: 1 },
    professional: { api_calls_monthly: 50000, storage_gb: 100, users: 10 },
    enterprise: { api_calls_monthly: -1, storage_gb: -1, users: -1 }, // Unlimited
  };

  const limits = tierLimits[subscription?.tier || 'free'];

  // Get actual usage
  const usageResult = await sql`
    SELECT
      COALESCE(SUM(CASE WHEN event_type = 'api_call' THEN 1 ELSE 0 END), 0) as api_calls,
      COALESCE(SUM(CAST(file_size AS BIGINT)), 0) as storage_bytes
    FROM analytics_events ae
    LEFT JOIN user_files uf ON uf.user_id = ae.user_id
    WHERE ae.user_id = ${userId}
      AND ae.created_at >= date_trunc('month', CURRENT_TIMESTAMP)
  `;

  const usage = usageResult.rows[0] || { api_calls: 0, storage_bytes: 0 };

  return {
    subscription,
    usage: {
      api_calls: usage.api_calls,
      storage_gb: Math.round((usage.storage_bytes / (1024 * 1024 * 1024)) * 100) / 100,
      users: 1, // Would be calculated from team members
    },
    limits,
  };
}

/**
 * Check if user has access to feature
 */
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const subscription = await getSubscription(userId);
  const tier = subscription?.tier || 'free';

  const featureMap: Record<string, string[]> = {
    analytics: ['professional', 'enterprise'],
    advanced_search: ['professional', 'enterprise'],
    file_upload: ['professional', 'enterprise'],
    data_export: ['professional', 'enterprise'],
    team_members: ['enterprise'],
    api_access: ['professional', 'enterprise'],
    webhooks: ['professional', 'enterprise'],
    sso: ['enterprise'],
    priority_support: ['enterprise'],
  };

  const allowedTiers = featureMap[feature] || [];
  return allowedTiers.includes(tier);
}
