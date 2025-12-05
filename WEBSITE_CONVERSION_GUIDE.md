# Converting Your App from SaaS to Website

Your app was built as a **SaaS (subscription) product**, but you want a **website (one-time payments)**.

Here's how to simplify it.

---

## Architecture Comparison

### Current (SaaS - Overcomplicated)

```
Frontend (40+ components)
├─ Dashboard (for SaaS accounts)
├─ Settings (manage subscription)
├─ Team Management
└─ Complex auth

Backend (12 endpoints)
├─ Subscription management
├─ Webhook processing
├─ User accounts
└─ Team operations

Database (17 tables)
├─ Users table
├─ Subscriptions table
├─ Teams table
└─ 14 other tables
```

### What You Actually Need (Website)

```
Frontend (5-10 components)
├─ Landing page
├─ Pricing page
├─ "Buy Now" button
└─ Success page

Backend (1-2 endpoints)
├─ POST /api/checkout (create Stripe session)
└─ GET /api/success (verify payment)

Database (Optional)
├─ Orders table (if you want to track)
└─ That's it
```

---

## What to Keep vs Delete

### KEEP ✅

- All frontend styling (TailwindCSS, animations, responsive design)
- Landing page, hero, features, pricing sections
- Stripe integration (just simplified)
- Email service (SendGrid)
- Hosting on Vercel

### DELETE/SIMPLIFY ❌

```
Remove these files:
- lib/subscription-service.ts (SaaS subscriptions)
- lib/auth.ts (unless you want user accounts)
- lib/team-service.ts (no teams needed)
- api/webhooks/stripe.ts (no webhook needed)
- components/Dashboard.tsx (SaaS feature)
- components/EnhancedSettings.tsx (SaaS feature)

Keep these:
- All components for landing page
- Payment button
- Success page
```

### Environment Variables

DELETE from .env:

```bash
❌ JWT_SECRET
❌ NEXTAUTH_SECRET
❌ DATABASE_URL
❌ STRIPE_WEBHOOK_SECRET (for subscriptions)
❌ SENDGRID_FROM_EMAIL (keep this actually)
```

KEEP:

```bash
✅ VITE_STRIPE_PUBLIC_KEY
✅ STRIPE_SECRET_KEY
✅ SENDGRID_API_KEY (for order emails)
```

---

## Quick Migration Steps

### Step 1: Simplify Environment (5 min)

Edit `.env.local`:

```bash
# KEEP ONLY THIS:
VITE_STRIPE_PUBLIC_KEY=pk_test_ABC123...
STRIPE_SECRET_KEY=sk_test_ABC123...
SENDGRID_API_KEY=SG.ABC123...
SENDGRID_FROM_EMAIL=orders@yourcompany.com
NODE_ENV=development

# DELETE:
# JWT_SECRET
# NEXTAUTH_SECRET
# DATABASE_URL
# STRIPE_WEBHOOK_SECRET
```

### Step 2: Remove Complex Components (10 min)

Delete or hide these pages:

```bash
# Don't delete, just hide from navigation
- Dashboard (for SaaS accounts)
- Team Management
- Settings/Account
- Subscription management

# KEEP visible
- Home/Hero
- Pricing
- Features
- Testimonials
- Contact/CTA
```

### Step 3: Simplify API Endpoints (10 min)

Keep only:

```bash
✅ api/checkout.ts - Create payment session
✅ api/success.ts - Confirm payment (optional)
✅ api/contact.ts - Contact form (if needed)

❌ DELETE:
- api/webhooks/stripe.ts (webhook processing)
- api/auth/* (unless using auth)
- api/teams/* (unless using teams)
- api/notifications/* (unless using notifications)
```

### Step 4: Remove Database References (5 min)

Comment out or remove:

```typescript
// In your API files, remove:
// import { db } from '@/lib/db/client';
// import { users } from '@/lib/db/schema';

// No database queries needed for simple payments
```

---

## Simplest Example: Homepage with Buy Button

```tsx
// src/App.tsx
import { loadStripe } from '@stripe/js';
import { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 9999, // $99.99
        description: 'Your Service - One Time Payment',
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
    await stripe.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Welcome to MaycoleTechnologies</h1>
        <p className="text-xl text-blue-100 mb-8">
          Simple, powerful inventory management for your business
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Get Started - $99.99'}
        </button>

        <p className="text-blue-100 mt-4">✓ 30-day free trial included</p>
      </div>
    </div>
  );
}
```

```typescript
// api/checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount, description } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // ONE-TIME PAYMENT (not subscription)
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
            description: 'Inventory Management Software',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.VITE_API_URL}/success`,
    cancel_url: `${process.env.VITE_API_URL}/`,
  });

  return Response.json({ sessionId: session.id });
}
```

```tsx
// src/pages/success.tsx
export default function Success() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✓ Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">Check your email for your activation details.</p>
        <a href="/" className="px-6 py-3 bg-green-600 text-white rounded-lg">
          Back to Home
        </a>
      </div>
    </div>
  );
}
```

---

## What You Keep: Your Existing Pages

You already have great components:

- ✅ Hero section
- ✅ Features showcase
- ✅ Pricing display
- ✅ Testimonials
- ✅ FAQ
- ✅ Contact form
- ✅ Footer
- ✅ Dark/Light mode
- ✅ Responsive design

**Just add a "Buy Now" button to each of these.**

---

## Database: Do You Need It?

### No Database Needed If:

- ✅ You just want to accept payments
- ✅ Stripe stores everything
- ✅ You send email on payment
- ✅ Customers don't have accounts

### Add Simple Database If:

- You want to email customers receipts
- You want to track which customers bought
- You want to store customer feedback
- You're offering a trial period

For a simple database, use:

```bash
# FREE: Vercel Postgres (comes with Vercel hosting)
DATABASE_URL=postgresql://...

# Just create 1 simple table:
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  stripe_session_id VARCHAR(255),
  customer_email VARCHAR(255),
  amount INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Deployment (Same for Website as SaaS)

1. Push to GitHub
2. Connect to Vercel
3. Add `.env.local` variables to Vercel
4. Deploy
5. Done!

---

## Comparison: Before vs After

| Feature          | SaaS (Before)  | Website (After)  |
| ---------------- | -------------- | ---------------- |
| Sign up          | Required       | Optional         |
| Teams            | Yes            | No               |
| Dashboard        | Complex        | Simple           |
| Database         | 17 tables      | 1-2 tables       |
| Environment vars | 20+            | 3-5              |
| API endpoints    | 12             | 1-2              |
| Complexity       | High           | Low              |
| Maintenance      | High           | Low              |
| Scalability      | For many users | For one business |

---

## Bottom Line

Your app will be **simpler, faster, easier to maintain** as a website.

You'll go from:

- 15 backend endpoints → 1-2
- 17 database tables → 0-1
- 20+ environment variables → 3-5
- Complex auth/teams → Simple payment

**But keep all the beautiful UI/UX** - that's your competitive advantage!

---

## Next: Get Started

1. Read: `STRIPE_WEBSITE_SETUP.md` (5 min)
2. Create Stripe account (5 min)
3. Copy keys to `.env.local` (2 min)
4. Replace your homepage with simple example above (10 min)
5. Test payment with 4242 4242 4242 4242 (5 min)
6. Deploy to Vercel (5 min)

**Total: ~30 minutes to a working payment system** 🚀
