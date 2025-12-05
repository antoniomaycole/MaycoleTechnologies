# 🎯 Stripe Setup for Website (Not SaaS)

This guide is for setting up **one-time payments** on your website (like selling services or products), **NOT** recurring subscriptions.

---

## What You Actually Need for a Website

### ❌ You DON'T Need:

- Subscription billing (monthly/yearly charges)
- Customer portal
- Invoice management
- Complex webhook handling
- Recurring payment automation

### ✅ You DO Need:

- Simple payment collection (one-time)
- "Pay Now" buttons
- Order processing
- Email confirmations
- Payment status tracking

---

## 5-Minute Stripe Setup for Website

### Step 1: Create Stripe Account

```
1. Go to https://stripe.com
2. Click "Start now"
3. Sign up with your business email
4. Verify your email
5. Fill in basic business info
   - Business name
   - Country
   - Business type (Freelancer/Sole Proprietor)
```

### Step 2: Get Your API Keys (Test Mode)

```
Location: https://dashboard.stripe.com/apikeys

You'll see:
├─ Publishable key (pk_test_XXXXX)
│  └─ Safe to put in frontend/HTML
│  └─ Use as: VITE_STRIPE_PUBLIC_KEY
│
└─ Secret key (sk_test_XXXXX)
   └─ NEVER share - backend only
   └─ Use as: STRIPE_SECRET_KEY
```

### Step 3: Copy Keys to Your Project

```bash
# Edit .env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX  # Copy from dashboard
STRIPE_SECRET_KEY=sk_test_XXXXX       # Copy from dashboard
```

### Step 4: Test with Stripe Test Cards

```
Use these in test mode:
├─ Success: 4242 4242 4242 4242
├─ Decline: 4000 0000 0000 0002
└─ Requires auth: 4000 0025 0000 3155

Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

### Step 5: That's It! 🎉

You now have everything needed for test payments.

---

## Implementation Options

### Option 1: Simple Checkout (Easiest)

```typescript
// For selling a single product or service
import { loadStripe } from '@stripe/js';

const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

const handleCheckout = async () => {
  // Send to your backend
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 10000, // $100.00 in cents
      description: 'Your Service Name',
      email: 'customer@example.com',
    }),
  });

  const { sessionId } = await response.json();

  // Redirect to Stripe Checkout
  await stripe.redirectToCheckout({ sessionId });
};
```

Backend (`/api/checkout`):

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { amount, description, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount, // in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // <-- KEY: "payment" for one-time, NOT "subscription"
    success_url: `https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://yoursite.com/pricing`,
    customer_email: email,
  });

  res.json({ sessionId: session.id });
};
```

### Option 2: Payment Form (Most Control)

```typescript
// For custom styling/UX
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';

const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { email: 'customer@example.com' },
      },
    });

    if (error) {
      console.error('Payment failed:', error.message);
    } else {
      console.log('Payment successful:', paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay $100</button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripe}>
      <PaymentForm />
    </Elements>
  );
}
```

### Option 3: Payment Links (No Code!)

```
Simplest option - no backend needed:

1. Go to https://dashboard.stripe.com/payment-links
2. Click "Create payment link"
3. Add your products/pricing
4. Set success/cancel URLs
5. Get your link: https://pay.stripe.com/pay/...
6. Add link to your website: <a href="...">Buy Now</a>
```

---

## Environment Variables for Website

You only need 2 variables (NOT subscriptions):

```bash
# .env.local (Development)
VITE_STRIPE_PUBLIC_KEY=pk_test_ABC123...
STRIPE_SECRET_KEY=sk_test_ABC123...

# .env.production (Production)
VITE_STRIPE_PUBLIC_KEY=pk_live_ABC123...
STRIPE_SECRET_KEY=sk_live_ABC123...
```

Remove these from your env files:

```bash
# DELETE THESE for a website:
STRIPE_WEBHOOK_SECRET=whsec_...  # Not needed for simple payments
VITE_STRIPE_PLAN_ID=...          # Not needed
VITE_STRIPE_TIER=...             # Not needed
```

---

## Going Live (Switch to Live Keys)

### Step 1: Activate Your Account

```
1. https://dashboard.stripe.com/account
2. Complete "Activate your account"
   - Verify phone number
   - Add business details
   - Add banking info
   - Accept terms
```

### Step 2: Get Live Keys

```
1. https://dashboard.stripe.com/apikeys
2. Toggle "View test data" → OFF
3. Copy your LIVE keys:
   - Publishable key (pk_live_XXXXX)
   - Secret key (sk_live_XXXXX)
```

### Step 3: Update Environment Variables

```bash
# .env.production
VITE_STRIPE_PUBLIC_KEY=pk_live_ABC123...  # Your live key
STRIPE_SECRET_KEY=sk_live_ABC123...       # Your live key
```

### Step 4: Deploy to Production

Your live payments are now active!

---

## What Your Code Actually Does

### For One-Time Payments:

```
User clicks "Buy Now"
  ↓
Redirects to Stripe Checkout
  ↓
Customer enters card details
  ↓
Stripe processes payment
  ↓
Redirect back to your site (success page)
  ↓
Send confirmation email
```

### NOT What You Need (Subscriptions):

```
❌ Recurring billing
❌ Customer portal login
❌ Invoice generation
❌ Dunning (retry failed payments)
❌ Proration calculations
❌ Webhook subscriptions
```

---

## Quick Reference: What to Delete

Your app currently has code for **SaaS subscriptions**. For a website with one-time payments, you can delete:

### Files to Simplify/Remove:

```
❌ lib/subscription-service.ts     (subscription billing)
❌ api/checkout.ts                 (complex checkout)
❌ api/webhooks/stripe.ts          (subscription webhooks)
✅ Keep: Payment buttons & simple checkout
```

### Code to Remove from `.env`:

```
❌ STRIPE_WEBHOOK_SECRET
❌ NEXT_AUTH_SECRET (if not using auth)
❌ JWT_SECRET (if not using auth)
❌ Database config (if just a website)
```

---

## Simple Example: "Buy Now" Button

```tsx
// components/BuyButton.tsx
import { loadStripe } from '@stripe/js';

export function BuyButton() {
  const handleClick = async () => {
    const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 9999, // $99.99
        description: 'Premium Service - 1 Month',
      }),
    });

    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <button onClick={handleClick} className="px-6 py-3 bg-blue-600 text-white rounded">
      Buy Now - $99.99
    </button>
  );
}
```

```typescript
// api/checkout.ts (Backend)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount, description } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // One-time payment, not subscription
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: description },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: 'https://yoursite.com/success',
    cancel_url: 'https://yoursite.com/pricing',
  });

  return Response.json({ sessionId: session.id });
}
```

---

## Testing Checklist

- [ ] Test payment with `4242 4242 4242 4242` (succeeds)
- [ ] Test decline with `4000 0000 0000 0002` (fails)
- [ ] Verify success redirect works
- [ ] Check email confirmation sends
- [ ] Check Stripe dashboard shows payment
- [ ] Switch to live keys
- [ ] Test with real card (small amount like $0.01)

---

## Next Steps

1. **Create Stripe Account** (5 min) - Use test mode first
2. **Add Keys to .env.local** (2 min) - Copy pk*test* and sk*test*
3. **Implement Payment Button** (10 min) - Use example above
4. **Test with Test Card** (5 min) - Use 4242 4242 4242 4242
5. **Go Live** (5 min) - Switch to pk*live* keys

**That's it!** You have a working payment system. 🎉

---

## FAQ

**Q: Do I need webhooks?**
A: No, unless you're doing advanced things like:

- Sending confirmation emails from backend
- Updating inventory
- Complex order tracking
  For a simple website, client-side handling is fine.

**Q: Can I use subscriptions later?**
A: Yes! You can add subscription products anytime. Just change `mode: 'payment'` to `mode: 'subscription'`.

**Q: How much does Stripe charge?**
A: 2.9% + $0.30 per transaction. No monthly fee.

**Q: Do I need a database?**
A: Not unless you want to track orders. Stripe stores everything - you can look it up in your Stripe dashboard anytime.

**Q: Can customers download invoices?**
A: Automatically! Stripe generates PDFs that customers can download from their email.
