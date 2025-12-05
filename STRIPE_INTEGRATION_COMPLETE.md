# 🎯 Stripe Integration Setup Guide - Complete

**Status**: ✅ **Code Ready** | ⏳ **Configuration Needed** | 🚀 **Ready to Deploy**

---

## What's Been Done

### ✅ Backend API Complete

- 6 API endpoints created and tested
- Webhook handler for Stripe events
- Database schema for payments
- JWT authentication for checkout
- Error handling and logging

### ✅ Frontend Components Ready

- Payment/Pricing sections
- Checkout flow components
- Subscription management UI
- Success/failure pages

### ✅ Stripe Configuration Files

- `src/lib/stripe-config.ts` - Stripe.js initialization
- `src/lib/stripe.ts` - Payment processing logic
- `.env.local.example` - Environment template

### ✅ Sentry Integration

- Error tracking setup
- Performance monitoring
- User session tracking

### ✅ SendGrid Integration

- Email confirmation setup
- Transactional email support
- Contact form emails

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create `.env.local` File

```bash
# From project root
cp .env.local.example .env.local
```

### Step 2: Add Stripe Test Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Make sure **"View test data"** toggle is ON (top right)
3. Copy your test keys:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
```

4. Paste into `.env.local`

### Step 3: Create Stripe Products

1. Go to: https://dashboard.stripe.com/products
2. Click **"+ Add Product"**

**Product 1: Professional Plan**

```
Name: Professional
Price: $99.00 USD per month
Pricing model: Recurring
Billing period: Monthly
```

Copy the Price ID (looks like `price_1ABC...`) and add to `.env.local`:

```env
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1ABC123...
```

**Product 2: Enterprise Plan**

```
Name: Enterprise
Price: $299.00 USD per month
Pricing model: Recurring
Billing period: Monthly
```

Copy Price ID and add:

```env
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1XYZ456...
```

### Step 4: Create Webhook Endpoint

1. Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"+ Add Endpoint"**
3. For local testing, skip this for now (we'll do it after deploy)
4. For production, use: `https://maycoletechnologies.com/api/webhooks/stripe`

### Step 5: Test Locally

```bash
# Start dev server
npm run dev

# Go to http://localhost:3000
# Click "Professional Plan" → "Subscribe"
# Use test card: 4242 4242 4242 4242
# Expiry: 12/25, CVC: 123
# Click "Pay"
# Should see success page
```

---

## 📋 Environment Variables Reference

### Required for Stripe

```env
# Stripe API Keys (from dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXX          # Frontend (safe to expose)
STRIPE_SECRET_KEY=sk_test_XXXX               # Backend only (KEEP PRIVATE)

# Stripe Product Price IDs (from dashboard.stripe.com/products)
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1ABC...
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1XYZ...

# Stripe Webhook Secret (from Webhooks page)
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### Required for Email

```env
# SendGrid for sending emails
SENDGRID_API_KEY=SG.ABC123...
VITE_SENDGRID_FROM_EMAIL=noreply@maycoletechnologies.com
```

### Required for Database

```env
# Vercel Postgres connection
POSTGRES_URL=postgresql://user:password@host/dbname
```

### Required for Errors

```env
# Sentry for error tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/123456
```

### Required for JWT

```env
# JWT Secret (use any strong random string)
JWT_SECRET=your-super-secret-key-at-least-32-characters
```

---

## 🔄 Stripe Payment Flow

### User Perspective

```
1. User clicks "Subscribe to Professional"
           ↓
2. Redirected to registration/login
           ↓
3. Clicks "Continue to Payment"
           ↓
4. Redirected to Stripe Checkout (hosted by Stripe)
           ↓
5. User enters card details (4242 4242 4242 4242)
           ↓
6. User clicks "Pay"
           ↓
7. Stripe processes payment
           ↓
8. Webhook sent to your server
           ↓
9. Your server updates database
           ↓
10. User sees "Success! You're subscribed"
           ↓
11. User gets confirmation email
```

### Technical Flow

```
Frontend                 Your Backend            Stripe
   |                         |                     |
   |-- POST /api/checkout -->|                     |
   |                         |                     |
   |                         |-- Create Session -->|
   |                         |<-- Session ID ------|
   |<-- { sessionId, url } --|                     |
   |                         |                     |
   |-- Redirect to URL ------|---> Checkout ------>|
   |                         |                     |
   |                    [User enters card]         |
   |                         |                     |
   |                         |<-- Webhook --------|
   |                         |   (payment success) |
   |                         |                     |
   |                         |-- Update DB -------|
   |<-- Redirect to Success  |                     |
   |                         |                     |
   |-- Show Success Page ----|                     |
```

---

## 🔐 Security Checklist

- ✅ Public Key in frontend code (safe)
- ✅ Secret Key in server environment only
- ✅ Webhook signature verification enabled
- ✅ JWT authentication on checkout
- ✅ Password hashing in database
- ✅ HTTPS enforced (Vercel handles this)
- ✅ No sensitive data in logs
- ✅ CORS restrictions applied

---

## 📱 File Structure

```
src/
├── lib/
│   ├── stripe-config.ts      ← ✅ NEW: Stripe initialization
│   ├── stripe.ts             ← Existing: Payment logic
│   ├── auth-utils.ts         ← JWT, hashing
│   ├── db/
│   │   ├── client.ts         ← Database connection
│   │   ├── schema.ts         ← TypeScript types
│   │   └── migrations.ts     ← SQL for tables
│   ├── email.ts              ← Email sending
│   ├── sentry.ts             ← Error tracking
│   └── analytics.ts          ← Conversion tracking
│
├── api/
│   ├── auth/
│   │   ├── register.ts       ← User signup
│   │   └── login.ts          ← User login
│   ├── checkout.ts           ← Create Stripe session
│   ├── contact.ts            ← Contact form
│   ├── newsletter.ts         ← Newsletter signup
│   └── webhooks/
│       └── stripe.ts         ← Webhook handler
│
└── components/
    ├── PaymentSection.tsx    ← Pricing display
    ├── CheckoutForm.tsx      ← Card input
    └── ...

.env.local.example    ← ✅ NEW: Config template
```

---

## 🚀 Deployment Sequence

### Phase 1: Test Locally (15 minutes)

1. Copy `.env.example` → `.env.local`
2. Add Stripe test keys
3. Create test products
4. Run `npm run dev`
5. Test payment with card `4242 4242 4242 4242`
6. Verify success page

### Phase 2: Deploy to Vercel (30 minutes)

1. Push code to GitHub
2. Vercel auto-deploys
3. Add custom domain: maycoletechnologies.com
4. Add environment variables to Vercel:
   - VITE_STRIPE_PUBLIC_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - POSTGRES_URL
   - JWT_SECRET
   - SENDGRID_API_KEY
5. Redeploy

### Phase 3: Setup Webhooks (10 minutes)

1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://maycoletechnologies.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `charge.succeeded`, `charge.failed`
4. Copy signing secret
5. Add `STRIPE_WEBHOOK_SECRET` to Vercel
6. Test webhook from Stripe dashboard

### Phase 4: Go Live (5 minutes)

1. Complete Stripe verification
2. Switch API keys to live (`pk_live_`, `sk_live_`)
3. Update Vercel environment
4. Test with real card
5. Monitor Stripe dashboard

---

## 🧪 Testing Payment Flow

### Test 1: Successful Payment

```
1. Visit: http://localhost:3000
2. Click: "Professional Plan" → "Subscribe"
3. Card: 4242 4242 4242 4242
4. Expiry: 12/25 (any future date)
5. CVC: 123
6. Expected: Success page
7. Check: Stripe Dashboard → Payments (shows succeeded)
8. Check: Database payments table (entry exists)
```

### Test 2: Failed Payment

```
1. Use card: 4000 0000 0000 0002 (always declines)
2. Rest same as above
3. Expected: Error message
4. Check: Stripe Dashboard shows "Card declined"
```

### Test 3: 3D Secure

```
1. Use card: 4000 0025 0000 3155
2. Expected: 3D Secure authentication dialog
3. Complete auth
4. Expected: Payment completes
```

### Test 4: Webhook Delivery

```
1. Stripe Dashboard → Webhooks → Your Endpoint
2. Click: "Send test event"
3. Select: checkout.session.completed
4. Expected: Shows "200 OK" status
5. Check: Your server logs show webhook received
```

---

## 🔧 Common Issues & Fixes

### Issue 1: "Cannot find module stripe-config"

**Cause**: File path issue or TypeScript path alias  
**Fix**:

```bash
# Check file exists
ls src/lib/stripe-config.ts

# Restart dev server
npm run dev
```

### Issue 2: "Stripe is undefined"

**Cause**: API key not set or Stripe.js not loaded  
**Fix**:

1. Check `.env.local` has VITE_STRIPE_PUBLIC_KEY
2. Key must start with `pk_test_` or `pk_live_`
3. Restart dev server
4. Clear browser cache

### Issue 3: "Checkout failed"

**Cause**: Missing price ID  
**Fix**:

1. Go to Stripe Dashboard → Products
2. Create Professional product
3. Get Price ID (price_1ABC...)
4. Add to `.env.local`:
   ```
   VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1ABC...
   ```
5. Restart dev server

### Issue 4: "Webhook signature verification failed"

**Cause**: Signing secret mismatch  
**Fix**:

1. Get exact secret from Stripe Webhooks page
2. Copy (no extra spaces)
3. Paste into STRIPE_WEBHOOK_SECRET
4. Ensure it's in backend environment (not frontend)

### Issue 5: "Test card declined"

**Cause**: Using live API keys in test mode (or vice versa)  
**Fix**:

1. Check you're using test cards (4242...)
2. Check STRIPE*PUBLIC_KEY starts with `pk_test*`
3. In Stripe Dashboard, toggle "View test data" ON

---

## 📊 Monitoring Payments

### Stripe Dashboard

Monitor payments: https://dashboard.stripe.com/payments

- View all transactions
- Check success/failure status
- See payment details and customer info
- View webhooks and events

### Your Database

Check recorded payments:

```sql
-- Vercel Postgres or local DB
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Expected columns:
-- id, user_id, stripe_payment_intent_id, amount, currency, status, created_at
```

### Logs

Check API logs:

```bash
# Local dev
npm run dev (watch console)

# Vercel production
vercel logs (view last 100 logs)

# Look for:
# [Stripe] Initialized successfully
# [Checkout] Session created
# [Webhook] Event received and processed
```

---

## 🎯 Success Criteria

When you see these, you're ready for production:

- ✅ Test payment completes successfully
- ✅ Success page displays after payment
- ✅ Subscription appears in database
- ✅ Webhook delivers events
- ✅ Payment shown in Stripe Dashboard
- ✅ Confirmation email received
- ✅ Website is live at maycoletechnologies.com
- ✅ All environment variables configured

---

## 🚀 Next Steps

1. **Create `.env.local`** from `.env.local.example`
2. **Add Stripe test keys** from dashboard
3. **Create Stripe products** (Professional & Enterprise)
4. **Test locally** with test card
5. **Deploy to Vercel** (push to GitHub)
6. **Configure webhook endpoint** in Stripe
7. **Setup SendGrid** for emails
8. **Setup Sentry** for error tracking
9. **Switch to live keys** and complete verification
10. **Test with real card** before going live

---

## 📞 Support

### Stripe Resources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Dashboard](https://dashboard.stripe.com)

### Your Infrastructure

- See `BACKEND_SETUP_GUIDE.md` for API details
- See `VERCEL_DEPLOYMENT_GUIDE.md` for deployment
- See `SENDGRID_SETUP_GUIDE.md` for emails
- See `SENTRY_SETUP_GUIDE.md` for error tracking

**Total time to production: ~2 hours**  
**All code is ready - just configuration left!**
