# Stripe Payment Integration Guide

## Overview

This document outlines the complete Stripe payment integration for MaycoleTechnologies™ Tracker application. The implementation enables seamless subscription management and one-time payments while maintaining analytics tracking for all payment events.

## Architecture

### Components

1. **`src/lib/stripe.ts`** - Payment processing library

   - Handles Stripe initialization and API communication
   - Manages checkout sessions, payment intents, and subscriptions
   - Integrates with AnalyticsTracker for payment event logging
   - Pricing tier management and formatting utilities

2. **`src/components/EnhancedPaymentSection.tsx`** - Payment UI

   - Displays three pricing tiers (Trial, Professional, Enterprise)
   - Handles user email input and plan selection
   - Manages checkout flow and redirects to Stripe
   - Includes feature comparison and FAQ sections
   - Fully styled with Tailwind CSS and motion animations

3. **`src/lib/analytics-tracker.ts`** - Updated to support payment events
   - Added 'payment' event type for tracking payment interactions
   - Tracks pricing views, plan selections, payment success/failures
   - Automatic error logging for payment processing issues

### Pricing Tiers

#### Free Trial

- **Price**: $0
- **Duration**: 30 days
- **Features**:
  - Basic inventory tracking
  - Up to 5 products
  - Email support
  - Basic analytics

#### Professional

- **Price**: $99/month
- **Duration**: Monthly or Annual (with 20% discount)
- **Features**:
  - Unlimited inventory tracking
  - Advanced analytics
  - Team collaboration (up to 5 users)
  - Real-time sync
  - Priority email support
  - Mobile app access
  - Custom reports
  - API access

#### Enterprise

- **Price**: $299/month
- **Duration**: Monthly or Annual (with 20% discount)
- **Features**:
  - Everything in Professional
  - Unlimited team members
  - Advanced security & compliance
  - 24/7 phone + email support
  - Dedicated account manager
  - Custom integrations
  - SLA guarantee
  - Advanced data export
  - White-label options

## Setup Instructions

### 1. Stripe Account Configuration

1. Create a Stripe account at https://dashboard.stripe.com
2. Go to **Settings > API Keys**
3. Copy your **Publishable Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`) - KEEP PRIVATE!

### 2. Create Products and Prices

#### Professional Monthly

1. Go to **Products** in Stripe Dashboard
2. Click **Add product**
3. Name: "Tracker Professional Monthly"
4. Price: $99.00 USD, Monthly billing
5. Copy the Price ID (starts with `price_`)

#### Professional Annual

1. Same as above but set for Annual billing
2. Price: $948.00 (20% discount from $1,188)
3. Copy the Price ID

#### Enterprise Monthly

1. Name: "Tracker Enterprise Monthly"
2. Price: $299.00 USD, Monthly billing
3. Copy the Price ID

#### Enterprise Annual

1. Name: "Tracker Enterprise Annual"
2. Price: $2,388.00 (20% discount from $2,988)
3. Copy the Price ID

### 3. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Stripe API Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Stripe Price IDs
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_XXX
VITE_STRIPE_PRICE_PROFESSIONAL_YEARLY=price_XXX
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_XXX
VITE_STRIPE_PRICE_ENTERPRISE_YEARLY=price_XXX

# Webhook Secret (generated in Webhooks section)
STRIPE_WEBHOOK_SECRET=whsec_test_XXX

# API Configuration
VITE_API_BASE_URL=https://your-api.com

# Feature Flag
VITE_ENABLE_PAYMENTS=true
```

### 4. Webhook Configuration

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Endpoint URL: `https://your-api.com/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** to `STRIPE_WEBHOOK_SECRET`

## Frontend Integration

### Using EnhancedPaymentSection

```tsx
import { EnhancedPaymentSection } from '@/components';

export function PricingPage() {
  return (
    <div>
      <EnhancedPaymentSection />
    </div>
  );
}
```

### Custom Payment Handling

```tsx
import { createCheckoutSession, PRICING_TIERS } from '@/lib/stripe';
import { getAnalytics } from '@/lib/analytics-tracker';

async function handlePayment(tierId: string, email: string) {
  const tier = PRICING_TIERS[tierId];

  if (tier.stripePriceId) {
    const session = await createCheckoutSession(tier.stripePriceId, email, '/success', '/pricing');

    // Redirect to Stripe checkout
    window.location.href = session.url;
  }
}
```

### Analytics Integration

All payment events are automatically tracked:

```tsx
// Tracked events include:
// - pricing_view: User views pricing page
// - plan_selected: User selects a plan
// - trial_initiated: User starts free trial
// - payment:intent_start: Payment intent created
// - payment:checkout_start: Checkout session created
// - payment:success: Payment completed successfully
// - payment:subscription_cancelled: Subscription cancelled
```

## Backend Implementation

### Required Endpoints

#### POST `/api/payments/intent`

Create a payment intent for one-time purchases

```json
{
  "amount": 9900,
  "email": "user@example.com",
  "metadata": {
    "source": "website",
    "timestamp": "2025-12-03T..."
  }
}
```

Response:

```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "publishableKey": "pk_test_xxx",
  "amount": 9900,
  "currency": "usd",
  "status": "requires_payment_method"
}
```

#### POST `/api/payments/checkout-session`

Create a checkout session for subscriptions

```json
{
  "priceId": "price_xxx",
  "email": "user@example.com",
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/pricing"
}
```

Response:

```json
{
  "id": "cs_xxx",
  "url": "https://checkout.stripe.com/pay/xxx",
  "stripeSessionId": "cs_xxx"
}
```

#### GET `/api/payments/subscription`

Get customer subscription status

```
?customerId=cus_xxx or ?customerId=user@example.com
```

Response:

```json
{
  "id": "sub_xxx",
  "status": "active",
  "priceId": "price_xxx",
  "currentPeriodEnd": 1704067200,
  "cancelAtPeriodEnd": false
}
```

#### POST `/api/payments/subscription/cancel`

Cancel a subscription

```json
{
  "subscriptionId": "sub_xxx",
  "timestamp": "2025-12-03T..."
}
```

#### GET `/api/payments/validate-session`

Validate payment completion on success page

```
?sessionId=cs_xxx
```

Response:

```json
{
  "success": true,
  "email": "user@example.com",
  "priceId": "price_xxx"
}
```

#### POST `/webhooks/stripe`

Stripe webhook handler - processes payment events

- Updates customer subscription status
- Sends confirmation emails
- Updates user permissions
- Logs to database

## Testing Payments

### Stripe Test Cards

Use these card numbers in test mode:

**Successful Payment**

- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

**Requires Authentication**

- Card: 4000 0025 0000 3155
- Expiry: Any future date
- CVC: Any 3 digits

**Declined Card**

- Card: 5555 5555 5555 4444
- Expiry: Any future date
- CVC: Any 3 digits

### Testing Workflow

1. Visit `/pricing` page
2. Select a paid plan (Professional or Enterprise)
3. Enter a test email
4. Click "Get Started"
5. Use test card 4242 4242 4242 4242
6. Complete payment
7. Redirect to success page
8. Check analytics for payment events

## Analytics Events

### Payment-Related Events

```typescript
// Pricing page viewed
analytics.trackEvent('pricing', 'trial_selected', { tierId: 'trial' });
analytics.trackEvent('pricing', 'plan_selected', { tierId: 'professional', email: '***' });

// Checkout flow
analytics.trackEvent('payment', 'intent_start', { amount: 9900 });
analytics.trackEvent('payment', 'checkout_start', { priceId: 'price_xxx' });
analytics.trackEvent('payment', 'checkout_redirect', { sessionId: 'cs_xxx' });

// Payment result
analytics.trackEvent('payment', 'success', {
  intentId: 'pi_xxx',
  amount: 9900,
  status: 'succeeded',
});

// Errors
analytics.trackError('Card declined', {
  context: 'payment-confirmation',
  code: 'card_declined',
});

// Subscription management
analytics.trackEvent('payment', 'subscription_cancel_request', { subscriptionId: 'sub_xxx' });
analytics.trackEvent('payment', 'subscription_cancelled', { subscriptionId: 'sub_xxx' });
```

## Security Considerations

1. **API Keys**

   - Never expose Secret Key in frontend code
   - Use `.env.local` file (added to `.gitignore`)
   - Rotate keys regularly in production

2. **HTTPS Only**

   - All payment operations require HTTPS
   - Ensure Vercel deployment uses HTTPS

3. **PCI Compliance**

   - Never handle raw card data
   - Use Stripe Elements or Stripe.js
   - Use Stripe-hosted checkout for maximum security

4. **Webhook Verification**

   - Verify webhook signatures on backend
   - Use `STRIPE_WEBHOOK_SECRET` to validate requests
   - Never trust webhook data without verification

5. **Email Validation**
   - Validate email on frontend
   - Validate again on backend
   - Use verified email for customer records

## Deployment

### Vercel Configuration

1. Go to Vercel project settings
2. Add environment variables:

   ```
   VITE_STRIPE_PUBLIC_KEY
   VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY
   VITE_STRIPE_PRICE_PROFESSIONAL_YEARLY
   VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY
   VITE_STRIPE_PRICE_ENTERPRISE_YEARLY
   VITE_API_BASE_URL
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   ```

3. Update backend endpoints:

   - Development: `http://localhost:3000/api`
   - Production: `https://your-api.com`

4. Test webhook delivery after deployment

## Troubleshooting

### "Stripe public key not configured"

- Check `VITE_STRIPE_PUBLIC_KEY` in `.env.local`
- Ensure key starts with `pk_`
- Verify it's not expired in Stripe Dashboard

### "Failed to create checkout session"

- Verify backend `/api/payments/checkout-session` is working
- Check `VITE_API_BASE_URL` configuration
- Review backend logs for errors

### "Payment declined" error

- For test mode: Use test card numbers listed above
- For production: Card number format is invalid
- Verify card is not expired
- Check billing address matches card

### Webhook events not received

- Verify endpoint URL in Stripe Dashboard
- Check webhook secret in environment variables
- Ensure backend is publicly accessible
- Review webhook delivery logs in Stripe Dashboard

## Future Enhancements

1. **Payment Plans**

   - Custom billing cycles
   - Discount codes and promotional pricing
   - Volume discounts for enterprise

2. **Subscription Management**

   - Customer billing portal
   - Self-service plan upgrades/downgrades
   - Payment method updates

3. **Advanced Analytics**

   - Conversion rate optimization
   - Customer lifetime value tracking
   - Churn prediction

4. **International Support**
   - Multi-currency pricing
   - Local payment methods
   - Tax calculation and compliance

## Related Files

- Component: `src/components/EnhancedPaymentSection.tsx`
- Library: `src/lib/stripe.ts`
- Analytics: `src/lib/analytics-tracker.ts`
- Config: `.env.example`
- Docs: This file

## Support

For questions or issues:

1. Check Stripe documentation: https://stripe.com/docs
2. Review webhook logs in Stripe Dashboard
3. Check application logs on Vercel
4. Contact support: help@maycoletechnologies.com

---

Last Updated: December 3, 2025
Stripe API Version: v3
