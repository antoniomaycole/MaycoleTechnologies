# 🔴 CRITICAL: Stripe Activation Checklist

**Status**: ⚠️ **BLOCKED - Waiting for Live Website**

Stripe requires a **live, publicly accessible website** before you can:

- Accept real payments
- Use live API keys (sk*live*, pk*live*)
- Activate production subscriptions
- Process customer payments

---

## Current State

| Item                  | Status         | Details                                              |
| --------------------- | -------------- | ---------------------------------------------------- |
| **Website Code**      | ✅ Complete    | All backend + frontend ready                         |
| **Backend API**       | ✅ Complete    | 6 endpoints, database, webhooks ready                |
| **GitHub Repo**       | ✅ Complete    | Pushed to AntonioMaycole/MaycoleTechnologies         |
| **Domain**            | ⏳ **PENDING** | maycoletechnologies.com (not yet pointing to Vercel) |
| **Vercel Deployment** | ⏳ **PENDING** | Not yet deployed                                     |
| **Live Website**      | ❌ **MISSING** | Need https://maycoletechnologies.com live            |
| **Stripe Activation** | ❌ **BLOCKED** | Can't activate without live website                  |

---

## 🚀 Step-by-Step: Get Stripe Live (2 Hours Total)

### PHASE 1: Deploy Website to Vercel (45 minutes)

#### Step 1A: Push Code to GitHub ✅ (Already Done)

```bash
# Your code is already at:
https://github.com/AntonioMaycole/MaycoleTechnologies
```

#### Step 1B: Deploy to Vercel (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for: **MaycoleTechnologies**
5. Select your repo
6. Click **"Import"**
7. **Framework**: Select **"Vite"**
8. **Build Command**: `npm run build` (should auto-detect)
9. Click **"Deploy"**

**Expected Result**:

- ✅ Deployment completes (takes 2-3 minutes)
- ✅ Live at: `https://maycoletechnologies.vercel.app`

#### Step 1C: Connect Custom Domain (5 minutes)

1. In Vercel Dashboard → Your Project → **"Settings"**
2. Go to **"Domains"** tab
3. Click **"Add Domain"**
4. Enter: `maycoletechnologies.com`
5. Click **"Add"**
6. Select **"Nameserver"** option
7. Copy Vercel's nameservers

**Expected Result**:

- Vercel shows DNS configuration
- Status: "Pending" (waiting for DNS update)

#### Step 1D: Update DNS at Domain Registrar (5 minutes)

**Go to your domain registrar** (GoDaddy, Namecheap, etc.):

1. Find DNS Settings for `maycoletechnologies.com`
2. Replace nameservers with Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
3. Save changes
4. Wait 5-15 minutes for DNS to propagate

**Test DNS**:

```bash
nslookup maycoletechnologies.com
# Should show Vercel's nameservers
```

**Expected Result**:

- ✅ After 15 min: `https://maycoletechnologies.com` is LIVE
- ✅ Website accessible from anywhere in the world

#### Step 1E: Add Environment Variables (10 minutes)

In Vercel Dashboard → Your Project → **"Settings"** → **"Environment Variables"**:

```
VITE_DEMO_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
VITE_STRIPE_PUBLIC_KEY=pk_test_... (for now)
STRIPE_SECRET_KEY=sk_test_... (for now)
SENDGRID_API_KEY=SG...
VITE_CONTACT_EMAIL=help@maycoletechnologies.com
SENDGRID_FROM_EMAIL=noreply@maycoletechnologies.com
VITE_SENTRY_DSN=https://...
POSTGRES_URL=postgresql://... (from Vercel Postgres)
JWT_SECRET=your-jwt-secret
```

#### Step 1F: Verify Website (5 minutes)

Test in browser:

```
✅ https://maycoletechnologies.com loads
✅ Hero section displays
✅ Payment section visible
✅ Newsletter signup works
✅ Contact form works
✅ All pages responsive
```

**Status After Phase 1**: Website is LIVE ✅

---

### PHASE 2: Activate Stripe Production (45 minutes)

#### Step 2A: Complete Stripe Verification (20 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Account"** → **"Settings"** → **"Business Profile"**
3. Fill in:
   - **Business name**: MaycoleTechnologies™
   - **Website URL**: `https://maycoletechnologies.com` ← MUST BE LIVE!
   - **Business type**: Individual or Company
   - **Business location**: Your location
   - **Registered address**: Your address
4. Submit for review

**What Stripe Checks**:

- ✅ Website must exist and be publicly accessible
- ✅ Website must have Terms of Service (provide in footer)
- ✅ Website must have Privacy Policy (provide in footer)
- ✅ Contact information must be visible
- ✅ No mature content, gambling, etc.

**Status**: Stripe reviews (usually 5 minutes to 1 hour)

#### Step 2B: Upload Documents (5 minutes)

Go to **"Account"** → **"Settings"** → **"Verification"**:

Upload:

- [ ] Government-issued ID
- [ ] Proof of address (utility bill, bank statement)
- [ ] Business documentation (if applicable)

#### Step 2C: Wait for Approval (10 minutes to 1 hour)

Stripe emails when approved. Check:

1. Stripe Dashboard
2. Email inbox
3. Spam folder

**Email Subject**: "Your Stripe account is now fully verified"

#### Step 2D: Switch to Live Keys (5 minutes)

Once approved:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Developers"** → **"API Keys"**
3. Toggle **"Test mode"** → **"Live mode"**
4. Copy:

   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)

5. Add to Vercel Environment Variables:

   ```
   VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
   STRIPE_SECRET_KEY=sk_live_XXXXX
   ```

6. Redeploy on Vercel (auto-redeploys on env var change)

#### Step 2E: Create Stripe Webhook (10 minutes)

1. Stripe Dashboard → **"Developers"** → **"Webhooks"**
2. Click **"+ Add Endpoint"**
3. **Endpoint URL**: `https://maycoletechnologies.com/api/webhooks/stripe`
4. **Events**: Select:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.succeeded`
   - `charge.failed`
5. Click **"Add Endpoint"**
6. Copy **Signing Secret** (starts with `whsec_`)

Add to Vercel:

```
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
```

Redeploy on Vercel.

#### Step 2F: Create Products & Prices (10 minutes)

1. Stripe Dashboard → **"Products"**
2. Click **"+ Add Product"**
3. Create 3 products:

**Product 1: Free Trial**

- Name: "Free Trial"
- Price: $0
- No subscription (one-time)

**Product 2: Professional**

- Name: "Professional Plan"
- Price: $99/month OR $990/year
- Recurring: Monthly or Yearly

**Product 3: Enterprise**

- Name: "Enterprise Plan"
- Price: $299/month OR $2,990/year
- Recurring: Monthly or Yearly

4. Copy Price IDs (starts with `price_live_`)
5. Add to Vercel:

```
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_live_XXXXX
VITE_STRIPE_PRICE_PROFESSIONAL_YEARLY=price_live_XXXXX
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_live_XXXXX
VITE_STRIPE_PRICE_ENTERPRISE_YEARLY=price_live_XXXXX
```

---

### PHASE 3: Test Live Payment Flow (30 minutes)

#### Step 3A: Test with Stripe Test Card

1. Go to `https://maycoletechnologies.com`
2. Click **"Professional Plan"** → **"Subscribe"**
3. Use Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/25
   CVC: 123
   ```
4. Complete checkout
5. Check Stripe Dashboard → **"Payments"** → Payment should show

#### Step 3B: Test with Real Payment

1. Update Vercel to use Live API keys (already done in Step 2D)
2. Go to `https://maycoletechnologies.com`
3. Click **"Professional Plan"** → **"Subscribe"**
4. Use your **real credit card** (you'll be charged $99)
5. Complete checkout
6. Verify in Stripe Dashboard that payment succeeded
7. Check database that subscription was recorded

#### Step 3C: Test Webhook

1. Complete a test payment
2. Stripe automatically sends webhook to `/api/webhooks/stripe`
3. Check:
   - Stripe Dashboard → **"Webhooks"** → Event status (green checkmark)
   - Your Vercel logs for successful processing
   - Database: Subscription should be recorded

---

## 📋 Pre-Deployment Checklist

### Website Content ✅

- [ ] **Terms of Service** page exists at `/terms`
- [ ] **Privacy Policy** page exists at `/privacy`
- [ ] **About Us** section complete
- [ ] **Contact information** visible
- [ ] **Pricing** clearly displayed
- [ ] No illegal/mature content

### Technical Setup ✅

- [ ] Website builds without errors
- [ ] Website responsive on mobile
- [ ] HTTPS working (Vercel auto-enables)
- [ ] Service Worker registered
- [ ] Analytics tracking implemented
- [ ] Error tracking (Sentry) configured

### Stripe Preparation ✅

- [ ] All backend API endpoints created
- [ ] Stripe.js library loaded
- [ ] Payment components ready
- [ ] Webhook handler implemented
- [ ] Database schema created
- [ ] Environment variables documented

### Business Setup ✅

- [ ] Business name finalized
- [ ] Business address ready
- [ ] Government ID available
- [ ] Proof of address available
- [ ] Business documentation ready
- [ ] Tax information ready (if needed)

---

## ⏱️ Timeline

| Phase     | Task                 | Time         | Status       |
| --------- | -------------------- | ------------ | ------------ |
| **1**     | Deploy to Vercel     | 10 min       | ⏳ TODO      |
| **1**     | Connect domain       | 10 min       | ⏳ TODO      |
| **1**     | Update DNS           | 15 min       | ⏳ TODO      |
| **1**     | Add env variables    | 10 min       | ⏳ TODO      |
| **1**     | Verify website       | 5 min        | ⏳ TODO      |
| **2**     | Stripe verification  | 30 min       | ⏳ TODO      |
| **2**     | Switch to live keys  | 10 min       | ⏳ TODO      |
| **2**     | Create webhook       | 10 min       | ⏳ TODO      |
| **2**     | Create products      | 15 min       | ⏳ TODO      |
| **3**     | Test payment flow    | 30 min       | ⏳ TODO      |
| **TOTAL** | **LIVE WITH STRIPE** | **~2 hours** | ⏳ **READY** |

---

## 🚨 Critical Prerequisites

**Website MUST be live at `https://maycoletechnologies.com` BEFORE:**

- ✅ Submitting Stripe for verification
- ✅ Requesting production API keys
- ✅ Processing real payments
- ✅ Accepting customer subscriptions

**If you try to activate Stripe without a live website**, Stripe will:

- ❌ Reject your verification
- ❌ Suspend your account
- ❌ Require additional documentation

---

## 💰 What Happens When Live

### Customers Can:

1. ✅ Click "Professional Plan"
2. ✅ Sign up account
3. ✅ Enter payment card
4. ✅ Complete transaction (REAL MONEY CHARGED)
5. ✅ Get subscription access
6. ✅ Receive confirmation email

### You Receive:

1. ✅ Payment in Stripe account
2. ✅ 2.9% + $0.30 fee deducted
3. ✅ Remaining balance (e.g., $99 → $95.53)
4. ✅ Daily settlements to bank account
5. ✅ Complete transaction records

### Automatic Actions:

1. ✅ Webhook updates database
2. ✅ Subscription created in database
3. ✅ Confirmation email sent
4. ✅ Analytics event recorded
5. ✅ Sentry logs transaction

---

## 🔒 Security Checklist

Before going live:

- [ ] HTTPS enabled (Vercel default)
- [ ] JWT_SECRET strong (32+ characters)
- [ ] Stripe keys in environment variables (not hardcoded)
- [ ] Webhook signature verified
- [ ] CORS restrictions applied
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't leak data
- [ ] Passwords hashed (bcryptjs, not SHA256)
- [ ] No sensitive data in logs

---

## 📞 If Something Goes Wrong

### Website Won't Deploy

- Check build logs in Vercel dashboard
- Ensure all environment variables set
- Verify GitHub repo is correct
- Re-run deployment

### Domain Not Pointing to Vercel

- Check DNS propagation (can take 24 hours)
- Use: `nslookup maycoletechnologies.com`
- Verify nameservers match Vercel's
- Clear DNS cache: `ipconfig /flushdns` (Windows)

### Stripe Verification Rejected

- Add Terms of Service page
- Add Privacy Policy page
- Add contact information
- Add business address to website
- Resubmit verification

### Payment Processing Fails

- Verify live API keys are in Vercel
- Check webhook signing secret exact match
- Check database connection string
- Review Vercel logs for errors
- Test webhook in Stripe dashboard

---

## ✅ Success Criteria

When complete, you have:

1. ✅ Live website at `https://maycoletechnologies.com`
2. ✅ Stripe account fully verified
3. ✅ Live API keys activated
4. ✅ Webhook configured and receiving events
5. ✅ Products & prices created in Stripe
6. ✅ Backend API processing payments
7. ✅ Database recording subscriptions
8. ✅ Customers can purchase

**Overall**: **PRODUCTION READY FOR MONETIZATION**

---

**Next Step**: Start with Phase 1 Step 1A - Deploy to Vercel (takes 45 minutes, then website is live!)

Ready to deploy? 🚀
