# 🚀 Production Deployment Guide

## Quick Setup (20 minutes)

### Phase 1: Prepare API Keys (10 minutes)

#### 1. **Stripe** (Payments)

```bash
# Go to: https://dashboard.stripe.com/apikeys
# Copy your TEST keys for development:
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_SECRET_KEY=sk_test_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

# For production, use LIVE keys (starting with pk_live_ and sk_live_)
```

#### 2. **SendGrid** (Email Service)

```bash
# Go to: https://app.sendgrid.com/settings/api_keys
# Create new API key with "Mail Send" permission
SENDGRID_API_KEY=SG.XXXXX
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### 3. **Sentry** (Error Tracking)

```bash
# Go to: https://sentry.io/organizations/YOUR-ORG/projects/
# Create new project for your app
SENTRY_DSN=https://XXXXX@sentry.io/XXXXX
VITE_SENTRY_DSN=https://XXXXX@sentry.io/XXXXX
```

#### 4. **JWT & Auth Secrets**

```bash
# Generate strong secrets using:
# Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Or use online: https://generate-random.org/base64
JWT_SECRET=<32+ character random string>
NEXTAUTH_SECRET=<32+ character random string>
```

#### 5. **Database** (PostgreSQL via Vercel)

```bash
# After Vercel setup creates Postgres:
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

### Phase 2: Deploy to Vercel (10 minutes)

#### Step 1: Connect GitHub Repository

```bash
# 1. Create GitHub repo: https://github.com/new
# 2. Push code:
git init
git add .
git commit -m "Initial commit: Full-stack app ready for deployment"
git remote add origin https://github.com/YOUR-USERNAME/maycoletechnologies.git
git push -u origin main
```

#### Step 2: Connect Vercel

```bash
# 1. Go to: https://vercel.com/dashboard
# 2. Click "Import Project"
# 3. Select your GitHub repository
# 4. Framework: Vite (auto-detected)
# 5. Click "Deploy"
```

#### Step 3: Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL=https://YOUR-PROJECT.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
SENDGRID_API_KEY=SG.XXXXX
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
JWT_SECRET=<your-secret>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://YOUR-PROJECT.vercel.app
DATABASE_URL=<postgres-connection-string>
SENTRY_DSN=https://XXXXX@sentry.io/XXXXX
VITE_SENTRY_DSN=https://XXXXX@sentry.io/XXXXX
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
LOG_LEVEL=warn
CORS_ORIGINS=https://maycoletechnologies.com,https://www.maycoletechnologies.com
```

---

### Phase 3: Database Setup (5 minutes)

#### Add Vercel Postgres

```bash
# In Vercel Dashboard:
# 1. Project Settings → Storage
# 2. Click "Create Postgres Database"
# 3. Name: "maycoletechnologies"
# 4. Copy CONNECTION STRING to DATABASE_URL env var
```

#### Initialize Database

```bash
# After deployment, database tables auto-create via migrations
# Verify in Vercel Postgres dashboard
```

---

### Phase 4: Configure Stripe Webhooks (3 minutes)

#### Webhook Setup

```bash
# 1. Go to: https://dashboard.stripe.com/webhooks
# 2. Click "Add endpoint"
# 3. Endpoint URL: https://YOUR-PROJECT.vercel.app/api/webhooks/stripe
# 4. Events: payment_intent.succeeded, customer.subscription.created, etc.
# 5. Copy signing secret → STRIPE_WEBHOOK_SECRET
```

---

## Environment Variables Reference

| Variable                 | Purpose         | Example                     | Required    |
| ------------------------ | --------------- | --------------------------- | ----------- |
| `VITE_API_URL`           | API endpoint    | `https://api.example.com`   | ✅          |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe payments | `pk_live_XXXXX`             | ✅          |
| `STRIPE_SECRET_KEY`      | Stripe backend  | `sk_live_XXXXX`             | ✅          |
| `SENDGRID_API_KEY`       | Email service   | `SG.XXXXX`                  | ✅          |
| `JWT_SECRET`             | Auth tokens     | 32+ char random             | ✅          |
| `DATABASE_URL`           | PostgreSQL      | `postgresql://...`          | ✅          |
| `SENTRY_DSN`             | Error tracking  | `https://...@sentry.io/...` | ⚠️ Optional |
| `LOG_LEVEL`              | Logging         | `warn` or `debug`           | ❌          |

---

## Verification Checklist

After deployment, verify:

- [ ] App loads at https://YOUR-PROJECT.vercel.app
- [ ] No TypeScript errors in build
- [ ] API endpoints respond (check `/api/health`)
- [ ] Stripe payments work (test mode)
- [ ] Emails send via SendGrid
- [ ] Database connected (check admin panel)
- [ ] Error tracking active (Sentry)
- [ ] Custom domain configured (if applicable)

---

## Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel Dashboard
# Common issue: missing environment variable
# Solution: Add to Vercel project settings
```

### API Endpoints Return 500

```bash
# Check function logs: Vercel Dashboard → Functions
# Likely missing DATABASE_URL or API keys
```

### Emails Not Sending

```bash
# Verify SendGrid API key is correct
# Check SendGrid dashboard for bounces/errors
# Verify SENDGRID_FROM_EMAIL is verified in SendGrid
```

### Stripe Payments Fail

```bash
# Use Stripe test keys (pk_test_*, sk_test_*)
# Check Stripe Dashboard → Events for details
# Verify webhook secret is correct
```

---

## Next Steps

1. ✅ Deploy production build
2. ✅ Setup monitoring (Sentry, logging)
3. ✅ Configure custom domain
4. ✅ Setup SSL/HTTPS (automatic with Vercel)
5. ✅ Setup automated backups
6. ✅ Monitor performance metrics
7. ✅ Setup alerts for errors
8. ✅ Document runbook for incidents

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **Sentry Docs**: https://docs.sentry.io
- **PostgreSQL Docs**: https://www.postgresql.org/docs
