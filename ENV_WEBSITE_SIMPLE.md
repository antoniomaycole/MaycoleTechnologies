# Website Environment Variables (Simplified)

For a **website with one-time payments**, you only need these 5 variables.

---

## Minimal Setup (.env.local)

```bash
# === STRIPE (Required) ===
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_TEST_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE

# === SENDGRID (Optional - for order emails) ===
SENDGRID_API_KEY=SG.YOUR_KEY_HERE
SENDGRID_FROM_EMAIL=orders@yourcompany.com

# === NODE ENVIRONMENT ===
NODE_ENV=development
```

That's it! You don't need:

- ❌ JWT_SECRET (unless using auth)
- ❌ DATABASE_URL (unless tracking orders)
- ❌ NEXTAUTH_SECRET (unless using NextAuth)
- ❌ SENTRY_DSN (unless monitoring errors)
- ❌ Webhook secrets (not needed for simple payments)

---

## Production Setup (.env.production)

```bash
# === STRIPE (Live Keys) ===
VITE_STRIPE_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY_HERE

# === SENDGRID ===
SENDGRID_API_KEY=SG.YOUR_KEY_HERE
SENDGRID_FROM_EMAIL=orders@yourcompany.com

# === NODE ENVIRONMENT ===
NODE_ENV=production
```

---

## Where to Get Keys

### Stripe (5 minutes)

```
1. https://stripe.com → Sign up
2. https://dashboard.stripe.com/apikeys
3. Copy pk_test_XXXXX (Publishable)
4. Copy sk_test_XXXXX (Secret)
5. Put in .env.local
```

### SendGrid (5 minutes) - Optional

```
1. https://sendgrid.com → Sign up
2. https://app.sendgrid.com/settings/api_keys
3. Create new API key
4. Copy key (SG.XXXXX)
5. Put in .env.local
```

---

## Test Your Setup

```bash
# Verify Stripe keys work
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Test"}'

# Should return: { "sessionId": "cs_test_XXXXX" }
```

---

## Notes

- **Keep .env.local out of git** - Add to .gitignore
- **Never share STRIPE_SECRET_KEY** - This is private!
- **VITE_STRIPE_PUBLIC_KEY is safe** - Can be public
- **Test first** - Use pk*test* keys before going live
- **Then go live** - Switch to pk*live* keys
