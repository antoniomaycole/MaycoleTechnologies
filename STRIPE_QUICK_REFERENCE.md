# 🎯 Stripe Integration - Quick Reference Card

Print this or bookmark for quick access!

---

## 5-Minute Setup

```bash
# 1. Create config file
cp .env.local.example .env.local

# 2. Add these URLs to your clipboard
https://dashboard.stripe.com/apikeys
https://dashboard.stripe.com/products
https://dashboard.stripe.com/webhooks

# 3. Open each URL and copy values into .env.local

# 4. Start dev server
npm run dev

# 5. Test: Click "Subscribe" → Use 4242 4242 4242 4242
```

---

## Essential Environment Variables

```env
# Required
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...

# Optional but recommended
STRIPE_WEBHOOK_SECRET=whsec_test_...
POSTGRES_URL=postgresql://...
JWT_SECRET=your-secret
```

---

## Test Card Numbers

| Scenario  | Card                | Expiry | CVC |
| --------- | ------------------- | ------ | --- |
| Success   | 4242 4242 4242 4242 | 12/25  | 123 |
| Decline   | 4000 0000 0000 0002 | 12/25  | 123 |
| 3D Secure | 4000 0025 0000 3155 | 12/25  | 123 |

---

## File Locations

```
Project Root/
├── .env.local              ← Your config (KEEP SECRET)
├── .env.local.example      ← Template (safe to share)
├── src/
│   ├── lib/
│   │   ├── stripe-config.ts         ← ✅ Initialization
│   │   └── stripe.ts                ← Payment logic
│   └── api/
│       ├── checkout.ts              ← Create session
│       └── webhooks/stripe.ts       ← Handle events
└── STRIPE_INTEGRATION_COMPLETE.md   ← Full docs
```

---

## Key URLs

| Resource         | URL                                   |
| ---------------- | ------------------------------------- |
| Stripe Dashboard | https://dashboard.stripe.com          |
| API Keys         | https://dashboard.stripe.com/apikeys  |
| Products         | https://dashboard.stripe.com/products |
| Webhooks         | https://dashboard.stripe.com/webhooks |
| Payments         | https://dashboard.stripe.com/payments |
| Test Data        | Toggle in dashboard top-right         |

---

## Development Workflow

```
1. Copy .env.example → .env.local
   ↓
2. Add Stripe test keys
   ↓
3. Create Stripe products
   ↓
4. npm run dev
   ↓
5. Click "Subscribe"
   ↓
6. Enter 4242 4242 4242 4242
   ↓
7. See success page ✅
```

---

## Production Workflow

```
1. Complete Stripe verification
   ↓
2. Get live API keys
   ↓
3. Update .env.local / Vercel
   ↓
4. Deploy to maycoletechnologies.com
   ↓
5. Configure webhook endpoint
   ↓
6. Test with real card
   ↓
7. Monitor Stripe Dashboard ✅
```

---

## Common Commands

```bash
# Copy config template
cp .env.local.example .env.local

# Run setup script (PowerShell)
.\setup-stripe.ps1

# Start dev server
npm run dev

# Build for production
npm run build

# View Vercel logs
vercel logs

# Deploy to Vercel
git push origin main

# Check npm packages
npm list stripe
```

---

## Environment Variables Prefix Rules

| Prefix | Where      | Frontend?  |
| ------ | ---------- | ---------- |
| VITE\_ | .env.local | ✅ Exposed |
| (none) | .env.local | ❌ Secret  |

**Examples:**

- ✅ `VITE_STRIPE_PUBLIC_KEY` → Used in React components
- ❌ `STRIPE_SECRET_KEY` → Server-side only
- ❌ `JWT_SECRET` → Never expose

---

## Stripe Payment Flow (Visual)

```
User Clicks "Subscribe"
    ↓
Login/Register Page
    ↓
Stripe Checkout Page
    ↓
User Enters Card (4242 4242 4242 4242)
    ↓
Stripe Processes Payment
    ↓
Webhook Sent to Backend
    ↓
Database Updated
    ↓
Success Page ✅
    ↓
Confirmation Email Sent
```

---

## API Endpoints

```
POST /api/checkout
  → Create Stripe session
  → Returns { sessionId, url }

POST /api/webhooks/stripe
  → Receive Stripe events
  → Update database

POST /api/auth/register
  → Create user account

POST /api/auth/login
  → Login user

POST /api/contact
  → Save contact submission

POST /api/newsletter
  → Subscribe to newsletter
```

---

## Error Checklist

Issue: "Stripe is undefined"

- [ ] .env.local exists
- [ ] VITE_STRIPE_PUBLIC_KEY is set
- [ ] Restart npm run dev
- [ ] Check browser console

Issue: "Cannot find module stripe-config"

- [ ] File: src/lib/stripe-config.ts exists
- [ ] Restart npm run dev

Issue: "Test card declined"

- [ ] Using test mode keys (pk*test*)
- [ ] Using test card (4242...)
- [ ] Toggle "View test data" ON in Stripe

Issue: "Webhook failed"

- [ ] Endpoint URL correct in Stripe
- [ ] STRIPE_WEBHOOK_SECRET matches
- [ ] Webhook event was sent (check Stripe)

---

## Quick Verification

```bash
# ✅ All green? You're ready!

✓ .env.local created
✓ Stripe keys added
✓ Stripe products created
✓ npm run dev works
✓ No console errors
✓ Test payment succeeds
✓ Stripe Dashboard shows payment
✓ Database has payment record
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel auto-deploys
- [ ] Environment variables added to Vercel
- [ ] Domain pointing to Vercel
- [ ] Webhook endpoint configured
- [ ] Test payment succeeds
- [ ] Error tracking works
- [ ] Emails send successfully

---

## Support Resources

| Question         | Resource                       |
| ---------------- | ------------------------------ |
| Full setup       | STRIPE_INTEGRATION_COMPLETE.md |
| Environment vars | STRIPE_ENV_SETUP.md            |
| Production steps | STRIPE_ACTIVATION_CHECKLIST.md |
| Backend details  | BACKEND_SETUP_GUIDE.md         |
| Deployment       | VERCEL_DEPLOYMENT_GUIDE.md     |
| Emails           | SENDGRID_SETUP_GUIDE.md        |
| Errors           | SENTRY_SETUP_GUIDE.md          |

---

## Time Estimates

| Task              | Time        |
| ----------------- | ----------- |
| Setup .env        | 5 min       |
| Create products   | 10 min      |
| Test locally      | 10 min      |
| Deploy to Vercel  | 15 min      |
| Configure webhook | 10 min      |
| Go live           | 5 min       |
| **TOTAL**         | **~1 hour** |

---

**Ready?** Start with: `cp .env.local.example .env.local` 🚀
