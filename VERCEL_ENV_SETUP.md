# Vercel Environment Variables Setup Guide

## Overview

This guide explains how to configure environment variables for MaycoleTechnologies™ on Vercel for production deployment.

## Environment Variables Summary

### **Authentication & Credentials**

| Variable                 | Type        | Source            | Notes                                           |
| ------------------------ | ----------- | ----------------- | ----------------------------------------------- |
| `VITE_STRIPE_PUBLIC_KEY` | Public      | Stripe Dashboard  | Safe to expose; starts with `pk_`               |
| `STRIPE_SECRET_KEY`      | Private     | Stripe Dashboard  | **Never expose client-side**; starts with `sk_` |
| `STRIPE_WEBHOOK_SECRET`  | Private     | Stripe Webhooks   | Used for webhook signature verification         |
| `SENDGRID_API_KEY`       | Private     | SendGrid Settings | API authentication for email sending            |
| `VITE_SENTRY_DSN`        | Semi-Public | Sentry            | Contains public key only; safe for frontend     |

### **Configuration Variables**

| Variable                 | Value                                 | Purpose                  |
| ------------------------ | ------------------------------------- | ------------------------ |
| `VITE_API_BASE_URL`      | `https://api.maycoletechnologies.com` | Backend API endpoint     |
| `VITE_DEMO_MODE`         | `false`                               | Disable for production   |
| `VITE_ENABLE_ANALYTICS`  | `true`                                | Enable visitor tracking  |
| `VITE_ENABLE_PAYMENTS`   | `true`                                | Enable Stripe checkout   |
| `VITE_ENABLE_NEWSLETTER` | `true`                                | Enable newsletter signup |

---

## Step-by-Step Setup Instructions

### **Step 1: Access Vercel Dashboard**

1. Navigate to https://vercel.com/dashboard
2. Select your MaycoleTechnologies project
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)

### **Step 2: Configure Stripe Keys**

#### Get Publishable Key:

1. Go to https://dashboard.stripe.com/apikeys
2. Under "Standard keys", find **Publishable key** (starts with `pk_`)
3. Copy the full key

#### Add to Vercel:

- **Variable Name**: `VITE_STRIPE_PUBLIC_KEY`
- **Value**: Paste the publishable key
- **Environments**: Select `Production`, `Preview`, and `Development`
- Click **Save**

#### Get Secret Key:

1. On same Stripe API Keys page, find **Secret key** (starts with `sk_`)
2. Copy the full key

#### Add to Vercel:

- **Variable Name**: `STRIPE_SECRET_KEY`
- **Value**: Paste the secret key
- **Environments**: Select **Production and Preview ONLY** (never Development)
- Click **Save**

### **Step 3: Configure Stripe Webhook Secret**

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)

#### Add to Vercel:

- **Variable Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: Paste the webhook secret
- **Environments**: Production and Preview ONLY
- Click **Save**

### **Step 4: Configure SendGrid for Email**

#### Get SendGrid API Key:

1. Go to https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key** button
3. Name it: "MaycoleTechnologies Production"
4. Give it **Full Access**
5. Copy the API key

#### Add to Vercel:

- **Variable Name**: `SENDGRID_API_KEY`
- **Value**: Paste the API key
- **Environments**: Production and Preview ONLY
- Click **Save**

#### Verify Sender Email:

1. Go to https://app.sendgrid.com/settings/sender_auth
2. Click **Create New Sender**
3. Enter details:
   - From Email: `noreply@maycoletechnologies.com`
   - From Name: `MaycoleTechnologies™`
4. Add to Vercel:
   - **Variable Name**: `SENDGRID_FROM_EMAIL`
   - **Value**: `noreply@maycoletechnologies.com`
   - Click **Save**

### **Step 5: Configure Sentry for Error Tracking**

#### Get Sentry DSN:

1. Go to https://sentry.io (create account if needed)
2. Click **Projects** → **Create Project**
3. Select **React** platform
4. Copy the **DSN** provided (format: `https://[key]@[host].ingest.sentry.io/[id]`)

#### Add to Vercel:

- **Variable Name**: `VITE_SENTRY_DSN`
- **Value**: Paste the DSN
- **Environments**: Production and Preview
- Click **Save**

### **Step 6: Add Configuration Variables**

Add these standard configuration variables:

| Variable                 | Value                                 | Environments        |
| ------------------------ | ------------------------------------- | ------------------- |
| `VITE_API_BASE_URL`      | `https://api.maycoletechnologies.com` | All                 |
| `VITE_DEMO_MODE`         | `false`                               | Production, Preview |
| `VITE_ENABLE_ANALYTICS`  | `true`                                | All                 |
| `VITE_ENABLE_PAYMENTS`   | `true`                                | All                 |
| `VITE_ENABLE_NEWSLETTER` | `true`                                | All                 |
| `VITE_GA_TRACKING_ID`    | `G_YOUR_ANALYTICS_ID`                 | All                 |
| `VITE_CONTACT_EMAIL`     | `help@maycoletechnologies.com`        | All                 |

---

## Security Best Practices

### **Private vs Public Keys**

| Type                | Private? | Client-Side? | Vercel Env       |
| ------------------- | -------- | ------------ | ---------------- |
| `pk_*` (Stripe)     | ❌ No    | ✅ Yes       | All environments |
| `sk_*` (Stripe)     | ✅ Yes   | ❌ No        | Production only  |
| `whsec_*` (Webhook) | ✅ Yes   | ❌ No        | Production only  |
| `SG.*` (SendGrid)   | ✅ Yes   | ❌ No        | Production only  |
| Sentry DSN          | ❌ No    | ✅ Yes       | All environments |

### **Environment-Specific Configuration**

- **Development**: Use test keys from Stripe (prefixed `pk_test_` / `sk_test_`)
- **Preview**: Use staging keys or test keys
- **Production**: Use live keys (prefixed `pk_live_` / `sk_live_`)

### **Redeploy After Changes**

After adding environment variables:

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **Redeploy** to apply new environment variables
4. Wait for deployment to complete (usually 2-3 minutes)

---

## Verification Checklist

- [ ] All Stripe keys added to Vercel
- [ ] SendGrid API key and sender email configured
- [ ] Sentry DSN added
- [ ] Webhook endpoint registered in Stripe
- [ ] All variables set to correct environments (private keys on Production only)
- [ ] Project redeployed after variable changes
- [ ] Test form submissions work (check SendGrid activity)
- [ ] Test payment flow (use Stripe test card: 4242 4242 4242 4242)
- [ ] Check Sentry dashboard for error tracking
- [ ] Monitor /api/analytics endpoint in browser DevTools

---

## Troubleshooting

### **Forms not sending emails**

1. Verify `SENDGRID_API_KEY` is set in Vercel
2. Check SendGrid Activity Dashboard for failed sends
3. Ensure sender email is verified in SendGrid

### **Stripe checkout not working**

1. Verify `VITE_STRIPE_PUBLIC_KEY` is set correctly
2. Check browser console for Stripe errors
3. Test with Stripe test card: `4242 4242 4242 4242`

### **Webhook errors**

1. Check webhook endpoint URL in Stripe dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches your webhook
3. Check Vercel logs for webhook failures

### **Sentry not capturing errors**

1. Verify `VITE_SENTRY_DSN` is set in Vercel
2. Check Sentry project settings are correct
3. Test by triggering an error in development

---

## Files Created

- `.env.example` - Local development environment template
- `.vercel-env-example.json` - Vercel environment variables reference
- `VERCEL_ENV_SETUP.md` - This setup guide

## Next Steps

1. Follow the setup instructions above
2. Redeploy your project in Vercel
3. Test each integration:
   - Email: Submit a form and check SendGrid Activity
   - Payments: Go to `/payments` (or pricing page) and test checkout
   - Errors: Check Sentry dashboard for tracked errors
4. Monitor application for 24-48 hours
5. Enable additional features as needed

---

**Last Updated**: December 3, 2025
**Maintained By**: MaycoleTechnologies Development Team
