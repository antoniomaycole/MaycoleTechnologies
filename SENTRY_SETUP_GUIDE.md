# Sentry Error Tracking & Performance Monitoring Guide

## Overview

Sentry provides real-time error tracking, performance monitoring, and debugging:

- ✅ Automatic error capture (uncaught exceptions, console errors)
- ✅ Session replays (watch what users did when error occurred)
- ✅ Performance monitoring (page load times, API latency)
- ✅ Source maps (see actual code, not minified)
- ✅ Breadcrumbs (track user actions leading to error)
- ✅ Alerting (get notified when errors occur)
- ✅ Team collaboration (share errors and assign to developers)

## Installation Status

- ✅ `@sentry/react` installed (npm install @sentry/react @sentry/tracing)
- ✅ Sentry module created: `/src/lib/sentry.ts` (350+ lines)
- ✅ Initialized in main.tsx before React mount
- ✅ HelmetProvider already configured (from SEO task)

## Files Created

### `/src/lib/sentry.ts` (350+ lines)

Complete error tracking service with:

- `initSentry()` - Initialize Sentry (call once in main.tsx)
- `captureException()` - Manually capture errors
- `captureMessage()` - Log custom messages
- `addBreadcrumb()` - Track user actions
- `setUser()` - Identify logged-in users
- `setContext()` - Add debugging context
- `startTransaction()` - Track performance
- `trackMetric()` - Track custom metrics
- `withErrorTracking()` - Async error wrapper
- `withSyncErrorTracking()` - Sync error wrapper
- `useSentryErrorHandler()` - React hook for error handling

## Setup Instructions

### **Step 1: Create Sentry Account**

1. Go to https://sentry.io
2. Click **Sign Up** (free tier available: 5,000 events/month)
3. Use your work email
4. Verify email address
5. Complete onboarding

### **Step 2: Create Project**

1. Click **Projects** → **Create Project**
2. Select **React** as platform
3. Alert you to: **On-Premise** or **Sentry Cloud**
   - Choose **Sentry Cloud** (recommended)
4. Select your organization
5. Name project: `maycoletechnologies`
6. Click **Create Project**

### **Step 3: Get DSN (Data Source Name)**

1. After creating project, you'll see setup instructions
2. Find **DSN** - looks like: `https://[key]@[host].ingest.sentry.io/[id]`
3. Copy the full DSN
4. Click **Next** to skip setup (we've already done it!)

### **Step 4: Add Environment Variable**

1. Log in to https://vercel.com/dashboard
2. Select your MaycoleTechnologies project
3. Click **Settings** → **Environment Variables**
4. Add variable:

| Variable Name     | Value                | Environments        |
| ----------------- | -------------------- | ------------------- |
| `VITE_SENTRY_DSN` | Your DSN from Sentry | Production, Preview |

5. Click **Save**
6. Go to **Deployments** and **Redeploy** to apply variable

### **Step 5: Verify Installation**

1. Deploy your application
2. Go to Sentry dashboard: https://sentry.io
3. Go to your project
4. Look for "First Event" notification
5. **Trigger a test error**:
   ```
   In browser console: throw new Error('Test error from Sentry')
   ```
6. Check Sentry dashboard - error should appear within seconds

## Usage Examples

### **Automatic Error Capture** ✅

```typescript
// These are captured automatically by Sentry:

// 1. Uncaught exceptions
throw new Error('Something went wrong');

// 2. Promise rejections
fetch('/api/data').then((r) => r.json()); // if this fails, it's tracked

// 3. Console errors
console.error('Database connection failed');

// 4. React errors (via Error Boundary)
// Errors in components are caught and tracked
```

### **Manual Exception Capture**

```typescript
import { captureException } from '@/lib/sentry';

try {
  await processPayment();
} catch (error) {
  captureException(error, {
    orderId: '123456',
    amount: 99.99,
    paymentMethod: 'stripe',
  });
}
```

### **Log Custom Messages**

```typescript
import { captureMessage } from '@/lib/sentry';

// Info level
captureMessage('User logged in', 'info', { userId: 'user123' });

// Warning level
captureMessage('API response slow', 'warning', { duration: 5000 });

// Error level
captureMessage('Payment gateway timeout', 'error', { timeout: 30000 });
```

### **Track User Actions (Breadcrumbs)**

```typescript
import { addBreadcrumb } from '@/lib/sentry';

// User clicked submit button
addBreadcrumb('Clicked submit', 'user-action', 'info', { form: 'contact' });

// API request made
addBreadcrumb('Fetched /api/products', 'http-request', 'info', { method: 'GET' });

// Navigation event
addBreadcrumb('Navigated to /products', 'navigation', 'info', { from: '/', to: '/products' });
```

### **Identify Users**

```typescript
import { setUser, clearUser } from '@/lib/sentry';

// When user logs in:
setUser('user123', 'john@example.com', 'johndoe');

// When user logs out:
clearUser();
```

### **Add Debugging Context**

```typescript
import { setContext } from '@/lib/sentry';

// When user enters payment flow:
setContext('payment', {
  cartTotal: 299.99,
  itemCount: 3,
  discountCode: 'LAUNCH20',
  shippingMethod: 'standard',
});

// When API call fails:
setContext('api-error', {
  endpoint: '/api/checkout',
  method: 'POST',
  statusCode: 500,
  retryCount: 2,
});
```

### **Track Performance**

```typescript
import { startTransaction, trackMetric } from '@/lib/sentry';

// Start a transaction
const transaction = startTransaction('checkout-flow', 'http.request');

// Do work...
await processPayment();

// Track custom metric
trackMetric('payment-processing-time', 2500, 'millisecond');

// Finish transaction
transaction.finish();
```

### **Async Error Handling Wrapper**

```typescript
import { withErrorTracking } from '@/lib/sentry';

// Automatically captures errors and tracks performance:
const result = await withErrorTracking(async () => {
  const response = await fetch('/api/data');
  return response.json();
}, 'fetch-data');
```

### **Sync Error Handling Wrapper**

```typescript
import { withSyncErrorTracking } from '@/lib/sentry';

// Automatically captures sync errors:
const result = withSyncErrorTracking(() => {
  return JSON.parse(jsonString);
}, 'parse-json');
```

## Integration with Components

### **Contact Form with Error Tracking**

```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry'

export function ContactForm() {
  const handleSubmit = async (formData) => {
    try {
      addBreadcrumb('Contact form submitted', 'user-action', 'info')

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      addBreadcrumb('Contact form sent successfully', 'user-action', 'info')
      return { success: true }
    } catch (error) {
      captureException(error, {
        formData: formData.name,
        url: window.location.href
      })
      return { success: false, error: 'Failed to send message' }
    }
  }

  return (
    // Your form JSX...
  )
}
```

### **Payment Processing with Tracking**

```typescript
import { startTransaction, setContext, captureException } from '@/lib/sentry';

export async function processPayment(amount, cardToken) {
  const transaction = startTransaction('stripe-payment', 'payment');

  setContext('payment-attempt', {
    amount,
    currency: 'USD',
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      source: cardToken,
    });

    if (response.status === 'succeeded') {
      addBreadcrumb('Payment successful', 'payment', 'info', { paymentId: response.id });
      transaction.finish();
      return { success: true, paymentId: response.id };
    }
  } catch (error) {
    captureException(error, { amount, paymentAttempt: true });
    transaction.finish();
    throw error;
  }
}
```

### **Data Fetching with Error Tracking**

```typescript
import { addBreadcrumb, captureException } from '@/lib/sentry';

export async function fetchProducts() {
  try {
    addBreadcrumb('Fetching products', 'http', 'info');

    const response = await fetch('/api/products');
    const data = await response.json();

    addBreadcrumb('Products loaded', 'http', 'info', { count: data.length });
    return data;
  } catch (error) {
    captureException(error, {
      endpoint: '/api/products',
      action: 'fetch-products',
    });
    throw error;
  }
}
```

## Sentry Dashboard Features

### **Issues Page**

Shows all detected errors grouped by type:

- Error message and stack trace
- Affected users
- Frequency and timeline
- Related breadcrumbs
- Session replay (if enabled)

### **Performance Page**

Shows application performance:

- Page load times
- API response times
- Transaction durations
- Core Web Vitals
- Slowest endpoints

### **Releases Page**

Track issues per deployment:

- Which release introduced error
- When error was fixed
- Compare performance across versions
- Rollback suggestions

### **Alerts Page**

Configure notifications:

- Send alerts to Slack/email when new errors occur
- Set thresholds for volume/frequency
- Assign to team members
- Create custom alerts

## Environment Variables

### **Required**

```env
VITE_SENTRY_DSN=https://[key]@[host].ingest.sentry.io/[id]
```

### **Optional** (already set in code)

```env
# These are configured in src/lib/sentry.ts:
NODE_ENV=production
VITE_APP_VERSION=1.0.0
```

## Configuration Options

### **Sample Rates** (in `/src/lib/sentry.ts`)

```typescript
// Line 28: Capture 100% of transactions (performance)
tracesSampleRate: 1.0,

// Line 29: Capture 10% of profiles
profilesSampleRate: 0.1,

// Line 55: Capture 10% of sessions for replay
replaysSessionSampleRate: 0.1,

// Line 56: Capture 100% of sessions with errors
replaysOnErrorSampleRate: 1.0,
```

### **In Production** (optimization):

```typescript
tracesSampleRate: 0.1,      // Sample 10% of transactions (reduces cost)
replaysSessionSampleRate: 0.05, // Sample 5% of sessions
```

## Common Issues & Solutions

### **Issue: Errors not appearing in Sentry**

**Check 1**: DSN is configured

```typescript
console.log(process.env.VITE_SENTRY_DSN); // Should show DSN
```

**Check 2**: Not in development mode

- Sentry is disabled in development by default
- Deploy to production or set NODE_ENV=production locally

**Check 3**: Error is not captured

```typescript
// Trigger test error:
throw new Error('Test error');
```

### **Issue: Too many errors from third-party scripts**

**Solution**: Update `ignoreErrors` list in `/src/lib/sentry.ts`

```typescript
ignoreErrors: [
  'ResizeObserver loop limit exceeded',
  'NetworkError: Network request failed',
  // Add more patterns as needed
];
```

### **Issue: Sensitive data being captured**

**Solution**: Sentry has built-in scrubbing:

- Passwords are masked automatically
- Credit card numbers are redacted
- API keys are hidden
- Custom data can be scrubbed with `beforeSend` hook

### **Issue: High Sentry costs**

**Solution**: Adjust sample rates (in `/src/lib/sentry.ts`):

```typescript
tracesSampleRate: 0.1,           // Track 10% of requests instead of 100%
profilesSampleRate: 0.01,        // Track 1% of profiles
replaysSessionSampleRate: 0.05   // Replay 5% of sessions
```

## Best Practices

### **1. Set User Context**

```typescript
// When user logs in
setUser('user123', 'user@example.com');

// Know which users are affected by errors
```

### **2. Add Breadcrumbs for Context**

```typescript
// Track user actions leading to error
addBreadcrumb('User clicked submit', 'user-action');
addBreadcrumb('API request started', 'http');
addBreadcrumb('Payment processed', 'transaction');
```

### **3. Use Source Maps**

```typescript
// Source maps show original code, not minified
// Already configured in our setup
```

### **4. Tag Issues for Organization**

```typescript
captureException(error, {
  tags: {
    severity: 'high',
    component: 'payment',
    feature: 'checkout',
  },
});
```

### **5. Monitor Key Transactions**

```typescript
// Track important user flows
startTransaction('checkout-flow', 'http.request');
startTransaction('payment-processing', 'payment');
```

## Pricing

### **Free Tier**

- 5,000 events/month
- 1 GB replays/month
- Community support
- 30-day event retention

### **Pro Plans** (if needed)

- Starts at $29/month
- Unlimited events
- Advanced features
- Priority support

**Current Status**: Free tier sufficient for launch

## Next Steps

1. ✅ **Module created** - Sentry service ready
2. ✅ **Initialized in main.tsx** - Captures all errors
3. **TODO**: Create Sentry account
4. **TODO**: Get DSN and add to Vercel
5. **TODO**: Deploy to production
6. **TODO**: Test error capture
7. **TODO**: Set up alerts (Slack/email)
8. **TODO**: Configure team in Sentry
9. **TODO**: Review and triage issues
10. **TODO**: Adjust sample rates for cost optimization

## Verification Checklist

- [ ] Sentry account created
- [ ] React project created in Sentry
- [ ] DSN copied
- [ ] Environment variable added to Vercel
- [ ] Project redeployed
- [ ] Error triggering shows in Sentry dashboard
- [ ] User context working (user shown in error)
- [ ] Breadcrumbs showing user actions
- [ ] Session replays enabled (can watch user before error)
- [ ] Alerts configured (Slack/email notifications)

---

**Status**: ✅ Error tracking service ready
**Package Used**: `@sentry/react` + `@sentry/tracing` (official Sentry SDK)
**Last Updated**: December 3, 2025

## Support

- Sentry Docs: https://docs.sentry.io/
- React Integration: https://docs.sentry.io/platforms/javascript/guides/react/
- API Reference: https://docs.sentry.io/api/
- Support Portal: https://support.sentry.io/
- Status Page: https://status.sentry.io/
