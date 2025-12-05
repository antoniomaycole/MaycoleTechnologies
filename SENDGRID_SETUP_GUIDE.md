# SendGrid Email Service Setup Guide

## Overview

SendGrid provides reliable transactional email delivery for:

- ✅ Contact form submissions
- ✅ Welcome/onboarding emails
- ✅ Payment confirmations
- ✅ Lead notifications
- ✅ System alerts and errors
- ✅ Newsletter campaigns (via SendGrid marketing platform)

## Installation Status

- ✅ `@sendgrid/mail` installed (npm install @sendgrid/mail)
- ✅ Email service module created: `/src/lib/email-service.ts` (350+ lines)
- ✅ Pre-built email templates for common use cases

## Files Created

### `/src/lib/email-service.ts` (350+ lines)

Complete email sending service with functions:

- `sendEmail()` - Generic email sending
- `sendContactFormEmail()` - Contact form submissions
- `sendWelcomeEmail()` - Onboarding emails
- `sendLeadNotificationEmail()` - Sales lead alerts
- `sendPaymentConfirmationEmail()` - Payment receipts
- `sendErrorNotificationEmail()` - System error alerts

## Setup Instructions

### **Step 1: Create SendGrid Account**

1. Go to https://sendgrid.com
2. Click "Sign Up Free" (starts with free tier: 100 emails/day)
3. Complete registration with business email
4. Verify email address
5. Complete onboarding survey

### **Step 2: Get API Key**

1. Log in to SendGrid dashboard: https://app.sendgrid.com
2. Go to **Settings** (left sidebar)
3. Click **API Keys** → **Create API Key**
4. Name it: "MaycoleTechnologies Production"
5. Give it **Full Access** permissions
6. Copy the full API key (starts with `SG.`)

### **Step 3: Verify Sender Email**

1. Go to **Settings** → **Sender Authentication** (or **Sender Management**)
2. Click **Create New Sender**
3. Enter details:
   - **From Email**: `noreply@maycoletechnologies.com`
   - **From Name**: `MaycoleTechnologies™`
   - **Reply To Email**: `help@maycoletechnologies.com` (optional)
   - **Business Address**: Your company address
4. Click **Create**
5. Check email for verification link from SendGrid
6. **Click verification link** to complete sender verification

### **Step 4: Add to Vercel Environment Variables**

1. Log in to https://vercel.com/dashboard
2. Select your MaycoleTechnologies project
3. Click **Settings** → **Environment Variables**
4. Add two variables:

| Variable Name         | Value                             | Environments        |
| --------------------- | --------------------------------- | ------------------- |
| `SENDGRID_API_KEY`    | Your API key (SG\_...)            | Production, Preview |
| `SENDGRID_FROM_EMAIL` | `noreply@maycoletechnologies.com` | All                 |

5. Click **Save** for each
6. Go to **Deployments** and **Redeploy** to apply variables

### **Step 5: Monitor in Dashboard**

1. Go to SendGrid dashboard: https://app.sendgrid.com
2. Click **Mail Send** (left sidebar) to see:
   - Emails sent/received counts
   - Bounce rates
   - Engagement metrics (opens, clicks)
   - Failed sends with error details

## Usage Examples

### **Send Contact Form Email**

```typescript
import { sendContactFormEmail } from '@/lib/email-service';

// In your contact form handler:
export async function handleContactSubmit(data) {
  const result = await sendContactFormEmail(
    data.name, // "John Doe"
    data.email, // "john@example.com"
    data.subject, // "Partnership Inquiry"
    data.message // "I'm interested in..."
  );

  if (result.success) {
    console.log('Email sent successfully');
  } else {
    console.error('Failed to send email:', result.error);
  }
}
```

### **Send Welcome Email**

```typescript
import { sendWelcomeEmail } from '@/lib/email-service';

// When user subscribes to newsletter:
await sendWelcomeEmail('subscriber@example.com', 'John');

// Without name:
await sendWelcomeEmail('subscriber@example.com');
```

### **Send Lead Notification**

```typescript
import { sendLeadNotificationEmail } from '@/lib/email-service';

// When someone shows interest:
await sendLeadNotificationEmail('Jane Doe', 'jane@company.com', 'MaycoleCheckBook™ Pro');
```

### **Send Payment Confirmation**

```typescript
import { sendPaymentConfirmationEmail } from '@/lib/email-service';

// After successful Stripe payment:
await sendPaymentConfirmationEmail(
  'customer@example.com',
  'INV-2025-00123',
  99.0,
  'Professional Annual',
  'January 15, 2026'
);
```

### **Send System Alert**

```typescript
import { sendErrorNotificationEmail } from '@/lib/email-service';

// When something breaks:
try {
  // ... code ...
} catch (error) {
  await sendErrorNotificationEmail(error.toString(), 'Payment Processing - Stripe Integration');
}
```

## Integration with Your Forms

### **Contact Form Integration**

```typescript
// In your contact form submission handler:
import { sendContactFormEmail } from '@/lib/email-service';

export async function submitContactForm(formData) {
  try {
    // Validate form
    if (!formData.email.includes('@')) {
      return { error: 'Invalid email' };
    }

    // Send email
    const emailResult = await sendContactFormEmail(
      formData.name,
      formData.email,
      formData.subject,
      formData.message
    );

    if (!emailResult.success) {
      console.error('Email failed:', emailResult.error);
      return { error: 'Failed to send email' };
    }

    // Send welcome email to user
    await sendWelcomeEmail(formData.email, formData.name);

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Form submission error:', error);
    return { error: 'An error occurred' };
  }
}
```

### **Lead Capture Integration**

```typescript
// In LeadCapture component form handler:
import { sendWelcomeEmail, sendLeadNotificationEmail } from '@/lib/email-service';

export async function handleLeadCapture(email: string) {
  try {
    // Send welcome email to user
    await sendWelcomeEmail(email);

    // Notify team about new lead
    await sendLeadNotificationEmail('Lead', email, 'Website Signup');

    return { success: true };
  } catch (error) {
    console.error('Error in lead capture:', error);
    return { success: false };
  }
}
```

## Environment Variables Reference

### **Required**

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@maycoletechnologies.com
```

### **Optional**

```env
# Support email (for reply-to)
SUPPORT_EMAIL=help@maycoletechnologies.com

# Admin email (for notifications)
ADMIN_EMAIL=admin@maycoletechnologies.com
```

## Pricing & Limits

### **Free Tier**

- 100 emails/day
- Unlimited contacts
- API access
- Sender verification

### **Pro Plans** (if needed)

- Starts at $19.95/month
- 12,000+ emails/month
- Advanced analytics
- Dedicated IP (optional)
- Priority support

**Current Status**: Free tier should be sufficient for initial launch

## Monitoring & Troubleshooting

### **Check Delivery Status**

Go to SendGrid dashboard → **Mail Send**:

- ✅ Delivered: Email reached recipient
- ⚠️ Bounced: Email address invalid
- 🔕 Opened: User opened email
- 🔗 Clicked: User clicked link in email

### **Issue: Emails not being sent**

**Check 1**: API key configured correctly

```typescript
// Verify in your code:
console.log(process.env.SENDGRID_API_KEY); // Should show SG_...
```

**Check 2**: Sender email verified

- Go to https://app.sendgrid.com/settings/sender_auth
- Verify `noreply@maycoletechnologies.com` is verified (green checkmark)
- Check verification email if needed

**Check 3**: API key has correct permissions

- Go to https://app.sendgrid.com/settings/api_keys
- Edit your key and ensure it has "Mail Send" permission

**Check 4**: Email address is valid

- Ensure recipient email is properly formatted
- Check for typos in email domain

### **Issue: Emails going to spam**

**Solution**: Set up sender verification and SPF/DKIM records

1. Go to **Settings** → **Sender Authentication**
2. Complete **Domain Authentication** (requires DNS access)
3. Add CNAME records to your domain's DNS
4. Wait 24 hours for propagation

This is optional but improves deliverability significantly.

### **Issue: High bounce rate**

**Solution**:

1. Verify email addresses before storing them
2. Implement double opt-in (send confirmation email first)
3. Remove bounced addresses from contact lists
4. Check SendGrid dashboard for detailed bounce reasons

## Best Practices

### **1. Email Templates**

- ✅ All templates use responsive HTML (works on mobile)
- ✅ Include sender info and contact details
- ✅ Add unsubscribe links for marketing emails
- ✅ Test rendering in multiple email clients

### **2. List Management**

- ✅ Only send to opted-in subscribers
- ✅ Remove hard bounces immediately
- ✅ Monitor unsubscribe rates
- ✅ Segment lists by interest/behavior

### **3. Compliance**

- ✅ Include company address in emails
- ✅ Provide unsubscribe option
- ✅ Honor unsubscribe requests within 10 days
- ✅ Don't mislead about sender identity

### **4. Performance**

- ✅ Use SendGrid for transactional emails only (not bulk)
- ✅ Implement retry logic for failed sends
- ✅ Monitor API rate limits (100,000 emails/day free)
- ✅ Use categories to organize email types

## API Documentation

**SendGrid API Docs**: https://sendgrid.com/docs/for-developers/

### **Common Methods**

```typescript
import { sendEmail } from '@/lib/email-service';

// Basic email
await sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  htmlContent: '<h1>Hello!</h1>',
});

// With tracking
await sendEmail({
  to: 'user@example.com',
  subject: 'Newsletter',
  htmlContent: '<h1>Newsletter</h1>',
  trackingSettings: {
    openTracking: true,
    clickTracking: true,
  },
});

// Multiple recipients
await sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Team Update',
  htmlContent: '<h1>Update</h1>',
});

// With tags for filtering
await sendEmail({
  to: 'user@example.com',
  subject: 'Invoice',
  htmlContent: '<h1>Invoice</h1>',
  tags: ['payment', 'invoice', 'important'],
});
```

## Testing in Development

### **Option 1: Use SendGrid Sandbox Mode**

```typescript
// In development, use test API key
const SENDGRID_API_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.SENDGRID_API_KEY_PROD
    : process.env.SENDGRID_API_KEY_DEV;
```

### **Option 2: Log to Console**

```typescript
if (process.env.NODE_ENV !== 'production') {
  console.log('[Email Preview]', config);
  return { success: true, preview: config };
}
```

### **Option 3: Use SendGrid Test Endpoint**

- SendGrid provides test mode in dashboard
- Emails won't actually send
- Useful for testing without quota usage

## Next Steps

1. ✅ **Module created** - Email service ready to use
2. ✅ **SendGrid SDK installed** - `@sendgrid/mail` added
3. **TODO**: Create SendGrid account and get API key
4. **TODO**: Verify sender email in SendGrid
5. **TODO**: Add environment variables to Vercel
6. **TODO**: Integrate with contact form
7. **TODO**: Integrate with lead capture
8. **TODO**: Test email delivery
9. **TODO**: Monitor SendGrid dashboard
10. **TODO**: Set up SPF/DKIM for improved deliverability

## Verification Checklist

- [ ] SendGrid account created
- [ ] API key generated
- [ ] Sender email verified
- [ ] Environment variables added to Vercel
- [ ] Project redeployed
- [ ] Contact form sends emails
- [ ] Welcome emails received by new subscribers
- [ ] Admin receives lead notifications
- [ ] Email templates display correctly
- [ ] Monitoring dashboard shows delivery stats

---

**Status**: ✅ Email service module ready for integration
**Package Used**: `@sendgrid/mail` (official SendGrid SDK)
**Last Updated**: December 3, 2025

## Support

- SendGrid Docs: https://sendgrid.com/docs/
- API Reference: https://sendgrid.com/docs/api-reference/
- Support Portal: https://support.sendgrid.com/
- Status Page: https://status.sendgrid.com/
