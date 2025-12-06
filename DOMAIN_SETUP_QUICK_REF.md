# QUICK REFERENCE - Production Domain & Stripe Setup

## 🎯 WHAT TO DO RIGHT NOW

### STEP 1: Point Domain to Vercel (5 minutes)

1. **Log into domain registrar** (GoDaddy, Namecheap, etc.)
2. **Get Vercel DNS records**:
   - Vercel Project → Settings → Domains → Add `maycoletechnologies.com`
   - Copy the A/CNAME records shown
3. **Update DNS**:
   - Delete old A records pointing to `216.198.79.1`
   - Add Vercel's A record: `76.76.19.165` (example)
4. **Wait for propagation** (5 min - 48 hours)

### STEP 2: Verify DNS Worked

```powershell
nslookup maycoletechnologies.com
# Should show Vercel IP (76.76.19.165 or similar)

# Then test in browser
https://maycoletechnologies.com
# Should load website (with 🔒 lock icon)
```

---

## 🔑 STRIPE KEYS NEEDED

Get from Stripe Dashboard (MUST BE LIVE, not test):

```
VITE_STRIPE_PUBLIC_KEY = pk_live_[YOUR_KEY]
STRIPE_SECRET_KEY = sk_live_[YOUR_KEY]
STRIPE_WEBHOOK_SECRET = whsec_[YOUR_KEY]
```

**Where to get them:**

1. Stripe Dashboard → Developers → API Keys
2. Toggle to **View live data** (top right)
3. Copy keys
4. Go to Stripe → Webhooks → Create endpoint
5. URL: `https://maycoletechnologies.com/api/webhooks/stripe`
6. Copy webhook secret

---

## 🌐 VERCEL ENV VARS TO ADD

**Project Settings** → **Environment Variables** → **Production**

```
VITE_API_URL=https://maycoletechnologies.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_[PASTE_HERE]
STRIPE_SECRET_KEY=sk_live_[PASTE_HERE]
STRIPE_WEBHOOK_SECRET=whsec_[PASTE_HERE]
SENDGRID_API_KEY=SG.[PASTE_HERE]
SENDGRID_FROM_EMAIL=orders@maycoletechnologies.com
NODE_ENV=production
```

Then **Redeploy** project.

---

## ✅ TEST PAYMENT

1. Go to `https://maycoletechnologies.com/tracker`
2. Proceed to checkout
3. Use card: `4242 4242 4242 4242`
4. Any future date & 3-digit CVC
5. Should succeed ✅

---

## 📋 ORDERED CHECKLIST

- [ ] **DNS Updated** (domain registrar)
- [ ] **DNS Propagated** (nslookup shows Vercel IP)
- [ ] **HTTPS Working** (browser shows 🔒)
- [ ] **Stripe Keys** (copied from dashboard)
- [ ] **Vercel Env Vars** (added & saved)
- [ ] **Project Redeployed** (in Vercel)
- [ ] **Stripe Webhook** (created & verified)
- [ ] **Test Payment** (succeeded ✅)

---

## 🆘 IF STUCK

| Problem              | Solution                                             |
| -------------------- | ---------------------------------------------------- |
| 404 on domain        | DNS not updated yet, wait 5-48 hours                 |
| No 🔒 lock           | SSL issuing, wait 15 min after DNS update            |
| Payment fails        | Using test keys? Use LIVE keys instead               |
| Email not sent       | SendGrid domain verified? Check SPF/DKIM             |
| Webhook not received | Domain actually live? Check webhook status in Stripe |

---

## 📚 FULL GUIDES

- **PRODUCTION_LAUNCH_CHECKLIST.md** ← START HERE
- **VERCEL_DOMAIN_SETUP.md** - Detailed DNS steps
- **STRIPE_PRODUCTION_SETUP.md** - Stripe webhook details

---

## ⏱️ TIME ESTIMATE

- DNS Update: 5 minutes
- DNS Propagation: 5 min - 48 hours
- Vercel Config: 5 minutes
- Stripe Setup: 10 minutes
- **Total**: 20 min - 48 hours (DNS being only variable)

---

**NEXT**: Read PRODUCTION_LAUNCH_CHECKLIST.md for step-by-step walkthrough
