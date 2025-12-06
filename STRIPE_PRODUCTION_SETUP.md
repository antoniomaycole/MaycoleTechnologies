# Stripe Webhook & Payment Configuration

## STATUS: ⏳ Ready to Activate (Awaiting Domain)

---

## STEP 1: Stripe Dashboard Setup

### 1.1 Switch to LIVE Keys
In **Stripe Dashboard**:
1. Go to **Developers** → **API Keys**
2. Toggle to **View live data** (top right)
3. Copy **Publishable key** (starts with `pk_live_`)
4. Copy **Secret key** (starts with `sk_live_`)

**⚠️ IMPORTANT**: Never commit live keys to GitHub!
- Use **Environment Variables** (Vercel only)
- Use **.env.local** (development only, git-ignored)

---

## STEP 2: Create Webhook Endpoint

### 2.1 Create Production Webhook

In **Stripe Dashboard**:
1. Go to **Developers** → **Webhooks**
2. Click **Add an endpoint**
3. Enter **Endpoint URL**:
   ```
   https://maycoletechnologies.com/api/webhooks/stripe
   ```
4. Select **Events to send**:
   ```
   ✅ checkout.session.completed
   ✅ checkout.session.async_payment_failed
   ✅ checkout.session.async_payment_succeeded
   ✅ payment_intent.succeeded
   ✅ charge.refunded
   ```
5. Click **Add endpoint**

### 2.2 Get Webhook Secret
After creating webhook:
1. Click the webhook endpoint
2. Scroll to **Signing secret**
3. Click **Reveal** button
4. Copy the secret (starts with `whsec_`)

---

## STEP 3: Configure Environment Variables

### 3.1 In Vercel Dashboard

Go to **Project Settings** → **Environment Variables**

Add these variables for **Production**:

```
Key: VITE_STRIPE_PUBLIC_KEY
Value: pk_live_[YOUR_LIVE_PUBLISHABLE_KEY]
✅ Check: Production

Key: STRIPE_SECRET_KEY
Value: sk_live_[YOUR_LIVE_SECRET_KEY]
✅ Check: Production

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_[YOUR_WEBHOOK_SECRET]
✅ Check: Production
```

### 3.2 Local Development (.env.local)

Create file: `c:\Users\TEMP\Downloads\MaycoleTechnologies\.env.local`

```env
# TEST KEYS (from Stripe Dashboard)
VITE_STRIPE_PUBLIC_KEY=pk_test_[YOUR_TEST_KEY]
STRIPE_SECRET_KEY=sk_test_[YOUR_TEST_KEY]
STRIPE_WEBHOOK_SECRET=whsec_test_[YOUR_TEST_WEBHOOK_SECRET]

# Email
SENDGRID_API_KEY=SG.[YOUR_SENDGRID_KEY]
SENDGRID_FROM_EMAIL=orders@maycoletechnologies.com

# Database (if using)
DATABASE_URL=your_database_url_here
```

**⚠️ WARNING**: `.env.local` is git-ignored. Never commit!

---

## STEP 4: Update Code for Production

### 4.1 Verify stripe-merchandise.ts

File: `src/lib/stripe-merchandise.ts`

```typescript
// ✅ CORRECT for both test and production
const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(publishableKey);

// Webhook handler automatically uses STRIPE_WEBHOOK_SECRET from environment
// No code changes needed!
```

### 4.2 Environment Detection

The code automatically detects environment:

```typescript
// Client-side (browser)
const isProduction = import.meta.env.PROD; // true in production build

// Server-side (API)
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
```

---

## STEP 5: Test Payment Flow

### 5.1 Test with Stripe Test Cards

Use these card numbers for testing:

| Scenario | Card Number | Exp | CVC | ZIP |
|----------|-------------|-----|-----|-----|
| ✅ Successful | 4242 4242 4242 4242 | 12/25 | 123 | 12345 |
| ❌ Declined | 4000 0000 0000 0002 | 12/25 | 123 | 12345 |
| ⚠️ Requires Auth | 4000 0000 0000 3220 | 12/25 | 123 | 12345 |

### 5.2 Test on Production Domain

1. Go to `https://maycoletechnologies.com/tracker`
2. Navigate to checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Verify:
   - ✅ Payment succeeds in Stripe Dashboard
   - ✅ Webhook received in Stripe → Webhooks → Events
   - ✅ Order confirmation email sent
   - ✅ Order appears in database

### 5.3 Monitor Webhook Delivery

In **Stripe Dashboard** → **Webhooks** → Your endpoint:

```
Status: ✅ (green = successful)
HTTP Status: 200
Signature Valid: ✅
```

---

## STEP 6: Email Configuration

### 6.1 Order Confirmation Email

File: `src/lib/stripe-merchandise.ts` (lines 151-152)

```typescript
// IMPLEMENTATION NEEDED:
case 'checkout.session.completed':
  const session = event.data.object as Stripe.Checkout.Session;
  
  // TODO: Send order confirmation email
  await sendOrderConfirmationEmail({
    email: session.customer_email,
    orderId: session.id,
    amount: session.amount_total,
  });
  
  // TODO: Create order record in database
  await createOrderRecord({
    stripeSessionId: session.id,
    customerEmail: session.customer_email,
    amount: session.amount_total,
    createdAt: new Date(),
  });
  
  break;
```

### 6.2 SendGrid Configuration

1. Go to **SendGrid** → **Sender Authentication**
2. Verify domain `maycoletechnologies.com`
3. Add SPF record (from SendGrid):
   ```
   v=spf1 sendgrid.net ~all
   ```
4. Add DKIM record (from SendGrid)
5. Once verified, emails work automatically

---

## STEP 7: Database Setup (Optional)

If using Supabase or PostgreSQL:

### 7.1 Create Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  amount_cents INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'completed',
  items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_session_id ON orders(stripe_session_id);
```

### 7.2 Update Database URL

Add to Vercel environment variables:
```
DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[db]?sslmode=require
```

---

## CHECKLIST - Production Stripe Setup

- [ ] Switched Stripe to **LIVE mode**
- [ ] Copied **Live Publishable Key** (pk_live_)
- [ ] Copied **Live Secret Key** (sk_live_)
- [ ] Created **Production Webhook** at `https://maycoletechnologies.com/api/webhooks/stripe`
- [ ] Obtained **Webhook Signing Secret** (whsec_)
- [ ] Added variables to **Vercel Environment**:
  - [ ] `VITE_STRIPE_PUBLIC_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Created `.env.local` for local testing
- [ ] Redeployed project to Vercel
- [ ] Tested payment with `4242 4242 4242 4242`
- [ ] Verified webhook in Stripe Dashboard
- [ ] Configured SendGrid domain verification
- [ ] Set up order database (optional)
- [ ] Implemented order confirmation email

---

## TESTING WORKFLOW

### Phase 1: Local Testing (Development)
```bash
npm run dev
# Use pk_test_ and sk_test_ keys
# Test with Stripe test cards
```

### Phase 2: Staging Testing (Vercel Preview)
```bash
# Push to feature branch
git push origin feature/stripe-setup
# Vercel auto-deploys preview
# Still uses test keys
```

### Phase 3: Production Testing (Live)
```bash
# After domain configured
# Go to https://maycoletechnologies.com
# Use Stripe LIVE keys
# Use real test cards or small test transactions
# Monitor in Stripe Dashboard
```

---

## TROUBLESHOOTING

### "Webhook not delivering"
- ✅ Is domain live? (nslookup maycoletechnologies.com)
- ✅ Is endpoint URL correct? (https://maycoletechnologies.com/api/webhooks/stripe)
- ✅ Check Vercel logs for errors
- ✅ Verify signing secret matches env var

### "Payment successful but email not sent"
- ✅ Is SendGrid key configured?
- ✅ Is sender email verified in SendGrid?
- ✅ Check SendGrid Activity for bounces
- ✅ Check Sentry for errors

### "404 on webhook endpoint"
- ✅ Is API route deployed? (check Vercel Functions)
- ✅ Is route at `/api/webhooks/stripe`?
- ✅ Redeploy project after changes

### "Keys rejected by Stripe"
- ✅ Copied full key (no spaces)?
- ✅ Using LIVE keys in production?
- ✅ Using TEST keys in development?
- ✅ Keys belong to same Stripe account?

---

## SECURITY NOTES

🔒 **Best Practices:**
- Never commit API keys to Git
- Always use environment variables
- Rotate webhook secrets annually
- Monitor Stripe Dashboard for suspicious activity
- Use webhook signing for verification
- Implement rate limiting on API endpoints
- Log payment events for audit trail

🚨 **Never Do This:**
- ❌ Hardcode API keys in code
- ❌ Commit `.env` files with secrets
- ❌ Share API keys in messages/docs
- ❌ Use test keys in production

---

## NEXT STEPS

1. **Complete Domain Setup** (STEP 1-4 in VERCEL_DOMAIN_SETUP.md)
2. **Add Environment Variables** to Vercel (this guide)
3. **Implement Email Service** (stripe-merchandise.ts line 151)
4. **Create Database Schema** (optional, if needed)
5. **Run Full Payment Test** with live card
6. **Monitor Production** for errors

---

**Ready?** All steps above, then deploy to production!
