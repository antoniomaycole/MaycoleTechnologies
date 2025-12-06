# PRODUCTION LAUNCH CHECKLIST - maycoletechnologies.com

## 🚀 SEQUENTIAL LAUNCH STEPS

### PHASE 1: Domain & DNS Configuration (Current Step)

**OBJECTIVE**: Get `https://maycoletechnologies.com` live with valid SSL

---

## ✅ STEP 1: CONFIRM DOMAIN REGISTRATION

**Status**: ✅ **CONFIRMED**

- ✅ Domain registered: `maycoletechnologies.com`
- ✅ Domain resolves: `216.198.79.1` (currently not pointing to Vercel)
- ✅ Currently 404 (expected - needs DNS update)

**Current DNS**:

```
maycoletechnologies.com → 216.198.79.1
                       → 64.29.17.1
```

**Next**: Point to Vercel

---

## 📋 STEP 2: UPDATE DNS RECORDS (YOU ARE HERE)

**Objective**: Point domain from current host to Vercel

### ACTION REQUIRED - You Must Complete This

1. **Log into your domain registrar** (where you registered maycoletechnologies.com)
   - GoDaddy, Namecheap, Google Domains, etc.

2. **Find DNS/Name Server settings**
   - Usually under: Domain Settings → DNS → Management

3. **Get Vercel DNS records**:
   - Go to Vercel Project → Settings → Domains
   - Add domain: `maycoletechnologies.com`
   - Vercel shows you the records to add

4. **Typical records to add**:

   ```
   Type: A
   Host: @ (root domain)
   Value: 76.76.19.165  (Vercel IP - may vary)
   TTL: 3600 (or auto)
   ```

   OR for CNAME:

   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

5. **Remove old records**:
   - Delete old A records pointing to `216.198.79.1`
   - Delete old CNAME records

6. **Save changes** - DNS propagation starts

### ⏱️ WAIT FOR DNS PROPAGATION

DNS takes **5 minutes to 48 hours** to fully propagate

**Check DNS Status**:

```powershell
# Windows
nslookup maycoletechnologies.com
Resolve-DnsName maycoletechnologies.com -Type A

# Should eventually show Vercel IP
# Example output:
# Name: maycoletechnologies.com
# Address: 76.76.19.165 ✅
```

**Online DNS checker**: https://whatsmydns.net/?domain=maycoletechnologies.com

---

## 🔐 STEP 3: VERIFY SSL CERTIFICATE (Automatic)

**Objective**: Verify HTTPS is working

### What Vercel Does (Automatic):

1. Detects your domain in project settings
2. Automatically provisions Let's Encrypt SSL cert
3. Renews automatically every 90 days

### Verification:

```powershell
# Check if HTTPS works
Invoke-WebRequest https://maycoletechnologies.com

# Should return 200 OK (not 404 at this point)
```

### Timeline:

- 🟢 **5-15 minutes** after DNS resolves = SSL issued
- 🟢 Browser shows 🔒 lock icon
- 🟡 If 15 min passed, DNS may not be propagated yet

### If SSL Not Issued:

- ⏳ Wait another 15 minutes
- ✅ Verify DNS is correctly pointing to Vercel
- ✅ Vercel → Domains → Check Status

---

## 🧪 STEP 4: TEST DOMAIN RESOLUTION & HTTPS

**Objective**: Verify domain works end-to-end

### 4.1 DNS Resolution Test

```powershell
# Should show Vercel IP
nslookup maycoletechnologies.com

# Should show: maycoletechnologies.com
# Addresses: 76.76.19.165 (or similar Vercel IP)
```

### 4.2 HTTPS Connection Test

```powershell
# Check if site loads
Invoke-WebRequest https://maycoletechnologies.com

# Should return 200 OK
# If 404: DNS propagation still in progress (wait)
# If timeout: DNS not updated yet
```

### 4.3 Browser Test

1. Open `https://maycoletechnologies.com` in browser
2. Should show website (not 404 or error)
3. Look for 🔒 lock icon (SSL verified)
4. Click lock → verify certificate is from Let's Encrypt

### 4.4 Sub-routes Test

```
✅ https://maycoletechnologies.com/               (Home)
✅ https://maycoletechnologies.com/tracker         (MaycoleTracker)
✅ https://maycoletechnologies.com/privacy        (Privacy)
✅ https://maycoletechnologies.com/terms          (Terms)
✅ https://maycoletechnologies.com/cookies        (Cookies)
```

### ✅ All Working?

**Proceed to Step 5**

---

## ⚙️ STEP 5: CONFIGURE VERCEL ENVIRONMENT

**Objective**: Set up production environment variables

### 5.1 In Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Set these for **PRODUCTION** environment:

**Frontend Variables** (public, safe to expose):

```
VITE_API_URL=https://maycoletechnologies.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_[YOUR_LIVE_KEY]
VITE_ANALYTICS_ID=[YOUR_GA_ID]
VITE_SENTRY_DSN=https://[YOUR_SENTRY_KEY]@sentry.io/[PROJECT_ID]
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_APP_NAME=Maycole Technologies
```

**Backend Variables** (secret, Vercel only):

```
STRIPE_SECRET_KEY=sk_live_[YOUR_LIVE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]
SENDGRID_API_KEY=SG.[YOUR_KEY]
SENDGRID_FROM_EMAIL=orders@maycoletechnologies.com
JWT_SECRET=[GENERATE_RANDOM_32_CHAR_STRING]
NEXTAUTH_SECRET=[GENERATE_RANDOM_32_CHAR_STRING]
NEXTAUTH_URL=https://maycoletechnologies.com
NODE_ENV=production
```

**Optional** (if using database):

```
DATABASE_URL=postgresql://[USER]:[PASS]@[HOST]:[PORT]/[DB]?sslmode=require
```

### 5.2 Generate Secure Secrets

For `JWT_SECRET` and `NEXTAUTH_SECRET`:

```powershell
# Generate 32-character random string
$secret = -join((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$secret
```

Copy output and use in Vercel.

### 5.3 Important: Get Stripe LIVE Keys

**MUST be LIVE keys** (not test keys):

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click **Developers** (top-right)
3. Toggle to **View live data** (top-right)
4. Copy **Publishable key** (starts with `pk_live_`)
5. Copy **Secret key** (starts with `sk_live_`)

⚠️ **NEVER use test keys in production!**

### 5.4 Redeploy Project

After adding env vars:

1. Go to **Deployments** in Vercel
2. Click **...** on latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

---

## 🔗 STEP 6: UPDATE STRIPE WEBHOOK URLs

**Objective**: Configure Stripe to send payment events to production domain

### 6.1 In Stripe Dashboard:

1. Go to **Developers** → **Webhooks**
2. Find your webhook endpoint (or create new)
3. Update **Endpoint URL** to:
   ```
   https://maycoletechnologies.com/api/webhooks/stripe
   ```
4. Keep events selected:
   - ✅ checkout.session.completed
   - ✅ checkout.session.async_payment_failed
   - ✅ checkout.session.async_payment_succeeded
   - ✅ payment_intent.succeeded
   - ✅ charge.refunded

5. **Save webhook**

### 6.2 Verify Webhook Secret

1. In webhook details, scroll to **Signing secret**
2. Click **Reveal**
3. Copy the secret (starts with `whsec_`)
4. Verify in Vercel env vars: `STRIPE_WEBHOOK_SECRET`

### 6.3 Test Webhook Delivery

1. Back in Stripe → Webhooks → Your endpoint
2. Scroll to **Recent Events**
3. Click on any event
4. Click **Send to endpoint** (test button)
5. Check status: Should show ✅ 200 OK

---

## 🧪 STEP 7: TEST STRIPE PAYMENT FLOW END-TO-END

**Objective**: Verify payments work on production

### 7.1 Test Payment with Test Card

1. Go to `https://maycoletechnologies.com/tracker`
2. Navigate to checkout/payment section
3. Enter test card: `4242 4242 4242 4242`
4. Exp: Any future date (e.g., `12/25`)
5. CVC: Any 3 digits (e.g., `123`)
6. Billing: Any address

### 7.2 Verify Payment Succeeded

In Stripe Dashboard:

1. Go to **Payments** → **Charges**
2. Should see your test charge for `$[amount]`
3. Status should be **Succeeded** ✅

### 7.3 Verify Webhook Received

In Stripe Dashboard:

1. Go to **Developers** → **Webhooks** → Your endpoint
2. Click **Recent Events**
3. Should see `checkout.session.completed` event
4. Status should be ✅ 200 (delivered successfully)

### 7.4 Verify Order Email Sent

1. Check email inbox (whatever email you used for checkout)
2. Should receive order confirmation from: `orders@maycoletechnologies.com`
3. Email should contain:
   - ✅ Order ID / Reference number
   - ✅ Items purchased
   - ✅ Total amount
   - ✅ Date/time

**If email not received**:

- Check spam/junk folder
- Verify SendGrid domain is authenticated
- Check Vercel logs for errors
- See: STRIPE_PRODUCTION_SETUP.md → Troubleshooting

### 7.5 Verify Database Record Created

If using database:

1. Check your database (Supabase, PostgreSQL, etc.)
2. Query `orders` table
3. Should see new order with:
   - ✅ stripe_session_id
   - ✅ customer_email
   - ✅ amount_cents
   - ✅ status: "completed"

---

## ✅ LAUNCH CHECKLIST

Print this and check off as you complete:

### PHASE 1: Domain & DNS

- [ ] Domain registered: `maycoletechnologies.com`
- [ ] Domain resolves: `nslookup` shows Vercel IP
- [ ] SSL certificate issued: Browser shows 🔒 lock
- [ ] HTTPS works: `https://maycoletechnologies.com` loads

### PHASE 2: Vercel Configuration

- [ ] Environment variables added (frontend & backend)
- [ ] Stripe LIVE keys configured (not test keys)
- [ ] JWT_SECRET and NEXTAUTH_SECRET generated
- [ ] Project redeployed after env vars

### PHASE 3: Stripe Setup

- [ ] Stripe webhook URL updated to production domain
- [ ] Webhook secret matches env var
- [ ] Test webhook delivery successful
- [ ] Switched Stripe dashboard to LIVE mode

### PHASE 4: Payment Testing

- [ ] Test payment with `4242 4242 4242 4242` succeeded
- [ ] Charge visible in Stripe Dashboard
- [ ] Webhook received `checkout.session.completed`
- [ ] Order confirmation email received
- [ ] Database order record created (if applicable)

### PHASE 5: Full Site Testing

- [ ] All 6 routes load and work:
  - [ ] `/` (home)
  - [ ] `/tracker` (app)
  - [ ] `/privacy` (policy)
  - [ ] `/terms` (policy)
  - [ ] `/cookies` (policy)
- [ ] Analytics tracking active (Google Analytics)
- [ ] Error tracking active (Sentry)
- [ ] No console errors

### PHASE 6: Performance & Security

- [ ] Load test with multiple users (Vercel auto-scales)
- [ ] Monitor error rate (should be ~0%)
- [ ] Check Vercel Analytics for performance
- [ ] Verify no sensitive data in logs

---

## 🎯 SUCCESS CRITERIA

### ✅ LAUNCH IS COMPLETE WHEN:

1. ✅ `https://maycoletechnologies.com` loads website with SSL
2. ✅ All 6 routes work without errors
3. ✅ Stripe checkout accepts payment
4. ✅ Order confirmation email sent automatically
5. ✅ Webhook events logged in Stripe Dashboard
6. ✅ No errors in Vercel logs or Sentry
7. ✅ Analytics show visitor traffic
8. ✅ PWA installable on mobile

---

## 📞 TROUBLESHOOTING

### Domain shows 404:

```
✅ Is DNS updated? (nslookup maycoletechnologies.com)
✅ Wait 5-48 hours for propagation
✅ Check whatsmydns.net for global propagation
✅ Vercel → Domains → Status should be ✅ Active
```

### SSL not issuing:

```
✅ Wait 15 minutes after DNS update
✅ Vercel auto-provisions Let's Encrypt
✅ If still pending: DNS records wrong, fix and redeploy
```

### Payment fails:

```
✅ Using LIVE Stripe keys (not test)?
✅ Webhook secret matches env var?
✅ Domain is live (not localhost)?
✅ Check Sentry for detailed error
```

### Email not sending:

```
✅ SendGrid API key configured?
✅ Domain verified in SendGrid?
✅ Sender email correct (orders@...)?
✅ Check SendGrid Activity log
```

---

## 📚 REFERENCE DOCUMENTS

- **VERCEL_DOMAIN_SETUP.md** - Detailed DNS configuration
- **STRIPE_PRODUCTION_SETUP.md** - Stripe webhook & payment setup
- **SECURITY.md** - Security best practices
- **API_KEYS_SETUP.md** - Environment variables guide

---

## 🚀 NEXT PHASES

After Phase 1 (Domain):

1. **Phase 2**: Email Implementation (stripe-merchandise.ts)
2. **Phase 3**: Database Schema (order records)
3. **Phase 4**: Full QA & Launch

---

**ESTIMATED TOTAL TIME**:

- Phase 1: 1-48 hours (DNS propagation)
- Phase 2-4: 2-4 hours (once domain is live)

**TOTAL**: 3-52 hours (domain being the only variable)

---

**Ready to begin?** Start with **STEP 2: UPDATE DNS RECORDS** above!
