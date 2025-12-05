# 🔑 API Keys & Credentials Setup Guide

Complete guide to obtaining and configuring all required API keys for production deployment.

---

## 📋 Complete Checklist

| Service  | Status      | Time   | Difficulty |
| -------- | ----------- | ------ | ---------- |
| Stripe   | ⬜ Required | 5 min  | Easy       |
| SendGrid | ⬜ Required | 5 min  | Easy       |
| Sentry   | ⬜ Optional | 5 min  | Easy       |
| Database | ⬜ Required | 10 min | Medium     |
| JWT/Auth | ⬜ Required | 2 min  | Easy       |

---

## 1. Stripe (Payments)

### Create Stripe Account

```
Step 1: https://stripe.com/
Step 2: Click "Start now"
Step 3: Sign up with business email
Step 4: Verify email
Step 5: Fill in business details
```

### Get API Keys

```
Location: https://dashboard.stripe.com/apikeys

For Development (Testing):
├─ Publishable Key (pk_test_*)
│  └─ Use as: VITE_STRIPE_PUBLIC_KEY
└─ Secret Key (sk_test_*)
   └─ Use as: STRIPE_SECRET_KEY

For Production (Live):
├─ Publishable Key (pk_live_*)
│  └─ Use as: VITE_STRIPE_PUBLIC_KEY
└─ Secret Key (sk_live_*)
   └─ Use as: STRIPE_SECRET_KEY
```

### Webhook Secret

```
Location: https://dashboard.stripe.com/webhooks

Step 1: Click "Add endpoint"
Step 2: Endpoint URL: https://YOUR-DOMAIN.com/api/webhooks/stripe
Step 3: Events: Select these:
       • payment_intent.succeeded
       • payment_intent.payment_failed
       • customer.subscription.created
       • customer.subscription.updated
       • customer.subscription.deleted
       • invoice.payment_succeeded
       • invoice.payment_failed
Step 4: Copy "Signing secret" (whsec_*)
        └─ Use as: STRIPE_WEBHOOK_SECRET
```

### Environment Variables

```bash
# .env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_ABC123...
STRIPE_SECRET_KEY=sk_test_ABC123...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...
```

### Verify Setup

```bash
# Test in your app
curl -X POST https://YOUR-API/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "usd"}'
```

---

## 2. SendGrid (Email)

### Create SendGrid Account

```
Step 1: https://sendgrid.com/
Step 2: Click "Sign Up"
Step 3: Create account
Step 4: Verify email
```

### Get API Key

```
Location: https://app.sendgrid.com/settings/api_keys

Step 1: Click "Create API Key"
Step 2: Name: "Production API Key"
Step 3: Select permissions:
       • Mail Send (✓ required)
       • Read access (optional)
Step 4: Create and copy (SG.*)
        └─ Use as: SENDGRID_API_KEY
```

### Verify From Email

```
Location: https://app.sendgrid.com/settings/sender_auth/senders

Step 1: Click "Create New Sender"
Step 2: Fill in:
       • From Name: Maycole Technologies
       • From Email: noreply@yourcompany.com
       • Reply To Email: support@yourcompany.com
       • Business Address: Your address
Step 3: Click "Create"
Step 4: Verify via email link
        └─ Use as: SENDGRID_FROM_EMAIL
```

### Test Email

```bash
# Using curl
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [{"to": [{"email": "test@example.com"}]}],
    "from": {"email": "noreply@yourcompany.com"},
    "subject": "Test Email",
    "content": [{"type": "text/plain", "value": "Test"}]
  }'
```

### Environment Variables

```bash
# .env.local
SENDGRID_API_KEY=SG.ABC123...
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
```

---

## 3. Sentry (Error Tracking) - Optional

### Create Sentry Account

```
Step 1: https://sentry.io/
Step 2: Click "Start for free"
Step 3: Sign up
Step 4: Verify email
```

### Create Project

```
Location: https://sentry.io/organizations/YOUR-ORG/projects/

Step 1: Click "Create Project"
Step 2: Select Platform: "React"
Step 3: Alert Rule: Default
Step 4: Create Project
```

### Get DSN

```
Location: Project Settings → Client Keys (DSN)

DSN Format: https://KEY@sentry.io/PROJECT_ID
└─ Use as: SENTRY_DSN (backend)
└─ Use as: VITE_SENTRY_DSN (frontend)
```

### Environment Variables

```bash
# .env.local
SENTRY_DSN=https://ABC123@sentry.io/1234567
VITE_SENTRY_DSN=https://ABC123@sentry.io/1234567
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## 4. JWT & Authentication Secrets

### Generate Secrets

#### Using OpenSSL (Recommended)

```bash
# macOS / Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

#### Using Online Generator

```
https://generate-random.org/base64
```

### Create Secrets

```bash
# Generate three strong secrets:
JWT_SECRET=<paste-generated-secret>
NEXTAUTH_SECRET=<paste-generated-secret>
```

### Environment Variables

```bash
# .env.local
JWT_SECRET=ABC123LONG/RANDOM/STRING==
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=XYZ789LONG/RANDOM/STRING==
NEXTAUTH_URL=https://yourapp.com
```

---

## 5. Database

### Vercel Postgres (Recommended)

#### Create Database

```
Location: https://vercel.com/dashboard

Step 1: Select your project
Step 2: Storage tab → Create → Postgres
Step 3: Name: maycoletechnologies
Step 4: Region: Choose nearest
Step 5: Create
```

#### Get Connection String

```
Location: Storage → Postgres → .env.local

Shows: DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
└─ Copy entire string to .env.local
```

### Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@ep-xxxx.postgres.vercel-storage.com/dbname?sslmode=require
```

---

## 6. All Environment Variables Summary

### Create `.env.local`

```bash
# Copy from .env.example and fill in your values

# API Configuration
VITE_API_URL=https://api.yourcompany.com

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_ABC123...
STRIPE_SECRET_KEY=sk_test_ABC123...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...

# SendGrid
SENDGRID_API_KEY=SG.ABC123...
SENDGRID_FROM_EMAIL=noreply@yourcompany.com

# Authentication
JWT_SECRET=ABC123LONG/RANDOM/STRING==
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=XYZ789LONG/RANDOM/STRING==
NEXTAUTH_URL=https://yourcompany.com

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Sentry (Optional)
SENTRY_DSN=https://ABC123@sentry.io/1234567
VITE_SENTRY_DSN=https://ABC123@sentry.io/1234567

# Other
LOG_LEVEL=debug
NODE_ENV=development
```

---

## 7. Security Best Practices

### ✅ DO:

- [x] Use strong, random secrets (32+ characters)
- [x] Store secrets in `.env.local` (never commit)
- [x] Rotate secrets quarterly
- [x] Use different keys for dev/prod
- [x] Restrict Stripe key permissions
- [x] Enable 2FA on all accounts
- [x] Monitor API usage regularly
- [x] Audit API key access logs

### ❌ DON'T:

- [ ] Commit `.env.local` to git
- [ ] Share API keys via email/chat
- [ ] Use same keys for dev and prod
- [ ] Leave unused API keys active
- [ ] Hardcode secrets in code
- [ ] Post secrets in GitHub issues
- [ ] Use weak or simple secrets
- [ ] Forget to rotate old keys

---

## 8. Verification Checklist

### Before Deployment

- [ ] All API keys obtained and validated
- [ ] `.env.local` created with all values
- [ ] `.env.local` added to `.gitignore`
- [ ] Environment variables test in local dev
- [ ] Build succeeds without errors
- [ ] All services respond correctly
- [ ] Stripe test payment works
- [ ] SendGrid test email sends
- [ ] Database connections work

### After Deployment

- [ ] Add same env vars to Vercel/hosting
- [ ] Verify app loads successfully
- [ ] Test all API endpoints
- [ ] Check error tracking (Sentry)
- [ ] Monitor Stripe webhooks
- [ ] Test email delivery
- [ ] Verify database connectivity

---

## 9. Troubleshooting

### API Key Not Found

```bash
# Check if .env.local exists
cat .env.local

# Check if key is loaded
console.log(process.env.SENDGRID_API_KEY) // Should not be undefined
```

### Authentication Fails

```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Check token expiration time
# Verify NEXTAUTH_SECRET matches across instances
```

### Stripe Webhook Not Firing

```bash
# 1. Verify webhook URL is accessible
# 2. Check webhook secret is correct
# 3. Check Stripe Dashboard → Webhooks → Events
# 4. Look for error details in event logs
```

### SendGrid Emails Bouncing

```bash
# 1. Verify SENDGRID_FROM_EMAIL is verified in SendGrid
# 2. Check SendGrid dashboard for bounce notifications
# 3. Verify recipient email address is correct
# 4. Check email subject/content for spam triggers
```

---

## 10. Next Steps

1. ✅ Obtain all API keys (45 minutes total)
2. ✅ Create `.env.local` file with values
3. ✅ Test all integrations locally
4. ✅ Add env vars to Vercel/hosting
5. ✅ Deploy to production
6. ✅ Monitor first week of activity
7. ✅ Setup alerts and notifications
8. ✅ Schedule quarterly key rotation

---

## Support Links

- **Stripe**: https://support.stripe.com
- **SendGrid**: https://support.sendgrid.com
- **Sentry**: https://sentry.io/support
- **Vercel**: https://vercel.com/support
- **PostgreSQL**: https://www.postgresql.org/support
