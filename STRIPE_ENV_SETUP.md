# Stripe Environment Variables Configuration Guide

## 📋 Quick Checklist

Use this to track which environment variables you've configured:

### Stripe API Keys (REQUIRED)

- [ ] VITE*STRIPE_PUBLIC_KEY (pk_test* or pk*live*)
- [ ] STRIPE*SECRET_KEY (sk_test* or sk*live*)
- [ ] STRIPE*WEBHOOK_SECRET (whsec_test* or whsec*live*)

### Stripe Product Price IDs (REQUIRED)

- [ ] VITE*STRIPE_PRICE_PROFESSIONAL_MONTHLY (price*...)
- [ ] VITE*STRIPE_PRICE_PROFESSIONAL_YEARLY (price*...)
- [ ] VITE*STRIPE_PRICE_ENTERPRISE_MONTHLY (price*...)
- [ ] VITE*STRIPE_PRICE_ENTERPRISE_YEARLY (price*...)

### Email Service (REQUIRED for emails)

- [ ] SENDGRID_API_KEY (SG....)
- [ ] VITE_SENDGRID_FROM_EMAIL (your-email@...)

### Database (REQUIRED for storage)

- [ ] POSTGRES_URL (postgresql://...)

### JWT (REQUIRED for auth)

- [ ] JWT_SECRET (any long random string)

### Error Tracking (OPTIONAL but recommended)

- [ ] VITE_SENTRY_DSN (https://...)

### Analytics (OPTIONAL)

- [ ] VITE_GA_TRACKING_ID (G-....)

---

## Step-by-Step Setup

### 1. Get Stripe Test Keys

**URL**: https://dashboard.stripe.com/apikeys

1. Log in to your Stripe account
2. Look for the toggle **"View test data"** in the top right
3. **Click it to turn it ON** (you should see blue toggle)
4. Copy these values:

**Publishable Key:**

```
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXX
```

**Secret Key:**

```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
```

⚠️ **Keep secret key PRIVATE** - never expose in frontend

### 2. Create Stripe Products

**URL**: https://dashboard.stripe.com/products

#### Product 1: Professional Plan

1. Click **"+ Add Product"**
2. Fill in:
   - **Name**: Professional
   - **Description**: For growing businesses
   - **Price**: $99.00
   - **Currency**: USD
   - **Pricing model**: Recurring
   - **Billing period**: Monthly
3. Click **"Create product"**
4. On product page, find the **Price** section
5. Copy the **Price ID** (looks like `price_1ABC123XYZ`)
6. Add to `.env.local`:
   ```
   VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1ABC123XYZ
   ```

#### Product 2: Enterprise Plan

1. Click **"+ Add Product"**
2. Fill in:
   - **Name**: Enterprise
   - **Description**: For large-scale operations
   - **Price**: $299.00
   - **Currency**: USD
   - **Pricing model**: Recurring
   - **Billing period**: Monthly
3. Click **"Create product"**
4. Copy the **Price ID**
5. Add to `.env.local`:
   ```
   VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1XYZ456ABC
   ```

#### Optional: Yearly Plans

Repeat the above for yearly billing (recommended):

- Professional: $990/year (15% discount)
- Enterprise: $2,990/year (15% discount)

Add to `.env.local`:

```
VITE_STRIPE_PRICE_PROFESSIONAL_YEARLY=price_yearly_id
VITE_STRIPE_PRICE_ENTERPRISE_YEARLY=price_yearly_id
```

### 3. Get Webhook Signing Secret

**For Production Only** (skip for local testing)

**URL**: https://dashboard.stripe.com/webhooks

1. Click **"+ Add Endpoint"**
2. For now, use: `http://localhost:3000/api/webhooks/stripe`
3. Select events:
   - checkout.session.completed
   - charge.succeeded
   - charge.failed
   - customer.subscription.updated
   - customer.subscription.deleted
4. Click **"Add Endpoint"**
5. Click the endpoint you just created
6. Find **"Signing secret"** and click **"Reveal"**
7. Copy the value (starts with `whsec_`)
8. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_test_XXXXX
   ```

---

## 📁 Where to Put Environment Variables

### For Local Development

**File**: `.env.local`

```env
# Create this file in project root (same level as package.json)
# Add your Stripe keys here

VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_SECRET_KEY=sk_test_XXXXX
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1ABC...
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1XYZ...
```

⚠️ **Never commit .env.local to git!**

Check `.gitignore`:

```
# Should already contain:
.env
.env.local
.env.*.local
```

### For Vercel Deployment

**Dashboard**: https://vercel.com/dashboard

1. Go to your project → **Settings** → **Environment Variables**
2. Click **"Add Environment Variable"**
3. Fill in each variable:
   - **Name**: VITE_STRIPE_PUBLIC_KEY
   - **Value**: pk_test_XXXXX
   - **Environments**: Select all (or specific ones)
4. Click **"Add**

5. Repeat for each variable:

   - STRIPE_SECRET_KEY
   - VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY
   - VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY
   - STRIPE_WEBHOOK_SECRET
   - POSTGRES_URL
   - JWT_SECRET
   - SENDGRID_API_KEY

6. Click **"Save"** when done
7. Go to **Deployments** and **Redeploy** to apply changes

---

## 🔄 When Switching from Test to Live

### Test to Live Conversion (5 minutes)

1. **Complete Stripe Verification**

   - Stripe Dashboard → Account → Settings → Business Profile
   - Upload business documents
   - Wait for approval (5 min - 1 hour)

2. **Switch API Keys**

   - Stripe Dashboard → Developers → API Keys
   - Toggle **"View test data"** OFF (turn blue toggle OFF)
   - Copy live keys (start with `pk_live_` and `sk_live_`)

3. **Update Environment Variables**

   - `.env.local` for local testing:
     ```
     VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
     STRIPE_SECRET_KEY=sk_live_XXXXX
     ```
   - Vercel for production:
     - Update each variable in Vercel dashboard
     - Redeploy

4. **Update Webhook Endpoint**

   - Stripe Dashboard → Webhooks
   - Change URL from localhost to: `https://maycoletechnologies.com/api/webhooks/stripe`
   - Update signing secret if changed

5. **Test with Real Card**
   - Use your actual credit card (you'll be charged)
   - Verify payment appears in Stripe Dashboard
   - Check database for payment record

---

## 🧪 Testing Your Configuration

### Test 1: Check Keys are Loaded

```bash
# In dev console (F12 → Console)
# Type:
window.__STRIPE_PUBLIC_KEY__
# Should return your key (pk_test_...)
```

### Test 2: Verify Stripe.js Loads

```bash
# In dev console:
typeof window.Stripe
# Should return: "function"
```

### Test 3: Test Payment Flow

1. Visit: http://localhost:3000
2. Click: "Professional Plan" → "Subscribe"
3. Card: 4242 4242 4242 4242
4. Expiry: 12/25
5. CVC: 123
6. Expected: Success page
7. Check Stripe Dashboard: Payments section should show transaction

---

## 🚨 Common Configuration Issues

### Issue: "Stripe public key is undefined"

**Cause**: Environment variable not set or misspelled

**Fix**:

1. Check `.env.local` file exists
2. Check line: `VITE_STRIPE_PUBLIC_KEY=pk_test_...`
3. No spaces: `VITE_STRIPE_PUBLIC_KEY = pk_test_` ❌ (wrong)
4. Correct: `VITE_STRIPE_PUBLIC_KEY=pk_test_` ✅
5. Restart dev server: `npm run dev`

### Issue: "Invalid API Key provided"

**Cause**: Key is malformed or truncated

**Fix**:

1. Copy entire key from Stripe dashboard (no partial copy)
2. Ensure no extra spaces or characters
3. Key format:
   - Test public: `pk_test_[your-test-publishable-key]`
   - Test secret: `sk_test_[your-test-secret-key]`
   - Live public: `pk_live_[your-live-publishable-key]`
   - Live secret: `sk_live_[your-live-secret-key]`

### Issue: "No pricing data"

**Cause**: Price IDs not set in environment

**Fix**:

1. Create products in Stripe Dashboard
2. Get Price ID for each product
3. Add to `.env.local`:
   ```
   VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_XXXXX
   VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_YYYYY
   ```
4. Restart dev server

### Issue: "Webhook verification failed"

**Cause**: Signing secret is wrong

**Fix**:

1. Get exact secret from Stripe Webhooks page
2. Click "Reveal" to show full secret
3. Copy (ensure no spaces at start/end)
4. Paste into STRIPE_WEBHOOK_SECRET
5. Ensure it's in server environment (not frontend)

---

## 📱 Environment Variable Summary

| Variable                               | Value Format                | Where      | Frontend? | Example              |
| -------------------------------------- | --------------------------- | ---------- | --------- | -------------------- |
| VITE_STRIPE_PUBLIC_KEY                 | pk*test*/pk*live*           | .env.local | ✅ Yes    | pk_test_ABC...       |
| STRIPE_SECRET_KEY                      | sk*test*/sk*live*           | .env.local | ❌ No     | sk_test_XYZ...       |
| STRIPE_WEBHOOK_SECRET                  | whsec*test*/whsec*live*     | .env.local | ❌ No     | whsec_test_123...    |
| VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY | price\_...                  | .env.local | ✅ Yes    | price_1ABC...        |
| VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY   | price\_...                  | .env.local | ✅ Yes    | price_1XYZ...        |
| POSTGRES_URL                           | postgresql://...            | .env.local | ❌ No     | postgresql://user... |
| JWT_SECRET                             | Any long string             | .env.local | ❌ No     | abc123xyz789...      |
| SENDGRID_API_KEY                       | SG....                      | .env.local | ❌ No     | SG.ABCXYZ...         |
| VITE_SENTRY_DSN                        | https://...ingest.sentry.io | .env.local | ✅ Yes    | https://abc@xyz...   |

**Frontend columns** means:

- ✅ Yes: Safe to expose in code (prefixed with VITE\_)
- ❌ No: Keep secret in server environment only

---

## ✅ Verification Checklist

After setting up, verify:

- [ ] `.env.local` file exists in project root
- [ ] VITE_STRIPE_PUBLIC_KEY is set
- [ ] STRIPE_SECRET_KEY is set
- [ ] VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY is set
- [ ] VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY is set
- [ ] All keys start with correct prefixes (pk*test*, sk*test*, etc.)
- [ ] No spaces or special characters in keys
- [ ] `.gitignore` includes `.env.local`
- [ ] `npm run dev` works without errors
- [ ] Stripe.js loads (check console for errors)
- [ ] Test payment completes successfully

---

## 🚀 Next Steps

1. **Create `.env.local`**

   ```bash
   cp .env.local.example .env.local
   ```

2. **Add Stripe test keys** from https://dashboard.stripe.com/apikeys

3. **Create Stripe products** at https://dashboard.stripe.com/products

4. **Add Price IDs** to `.env.local`

5. **Test locally**

   ```bash
   npm run dev
   # Visit http://localhost:5173
   # Click "Subscribe"
   # Use test card 4242 4242 4242 4242
   ```

6. **Deploy to Vercel**

   - Push to GitHub
   - Vercel auto-deploys
   - Add environment variables in Vercel Dashboard
   - Redeploy

7. **Go live**
   - Get live API keys
   - Update all environment variables
   - Configure webhook endpoint
   - Test with real card

---

**Questions?** Check:

- `STRIPE_INTEGRATION_COMPLETE.md` - Full setup guide
- `STRIPE_ACTIVATION_CHECKLIST.md` - Production steps
- `.env.local.example` - All available options
