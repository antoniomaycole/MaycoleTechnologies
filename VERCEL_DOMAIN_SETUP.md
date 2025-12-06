# Vercel Domain Configuration Guide - maycoletechnologies.com

## STATUS: ✅ Domain Registered | ⏳ DNS Configuration Pending

### Current Status
- **Domain**: maycoletechnologies.com - ✅ **REGISTERED**
- **DNS Resolution**: ✅ **ACTIVE** (resolves to 216.198.79.1, 64.29.17.1)
- **HTTPS/SSL**: ⏳ **Pending Vercel assignment**
- **Vercel Deployment**: ⏳ **Awaiting DNS update**

---

## STEP 1: Add Domain to Vercel Project

### In Vercel Dashboard:
1. Go to **Project Settings** → **Domains**
2. Click **"Add"** button
3. Enter: `maycoletechnologies.com`
4. Select **Continue**
5. Vercel will provide you with **DNS records** to add

### Expected Vercel DNS Records:
Vercel will show you records like:
```
Type: CNAME
Name: maycoletechnologies.com (or subdomain)
Value: cname.vercel-dns.com
```

Or for root domain:
```
Type: A
Name: @ (root)
Value: 76.76.19.165
```

---

## STEP 2: Update DNS Records at Domain Registrar

### Where to Update DNS:
**Your Domain Registrar** (wherever you registered maycoletechnologies.com)
- GoDaddy
- Namecheap
- Google Domains
- etc.

### Instructions:
1. Log into your domain registrar's control panel
2. Find **DNS Settings** or **DNS Management**
3. Add the records Vercel provided:
   - Remove existing A/CNAME records pointing to old host
   - Add Vercel's A/CNAME records
   - Keep MX records for email (if applicable)

### DNS Record Example:
```
@ (Root Domain)     A Record    76.76.19.165         (Vercel IP)
www                 CNAME       cname.vercel-dns.com (Vercel CNAME)
```

---

## STEP 3: Verification Timeline

| Action | Tool | Expected Time |
|--------|------|---|
| DNS propagation | `nslookup maycoletechnologies.com` | 5 min - 48 hours |
| SSL certificate | Vercel (auto) | 5-15 minutes after DNS |
| Deployment | Vercel | Automatic |

### Verification Commands:
```powershell
# Check DNS propagation
nslookup maycoletechnologies.com

# Check DNS full resolution
Resolve-DnsName maycoletechnologies.com -Type A

# Check HTTPS/SSL
openssl s_client -connect maycoletechnologies.com:443 -servername maycoletechnologies.com

# Check with curl
curl -I https://maycoletechnologies.com
```

---

## STEP 4: Vercel Environment Configuration

Once DNS is updated and SSL is active, configure Vercel project:

### Required Environment Variables in Vercel:

```plaintext
# Frontend (Vite - public)
VITE_API_URL=https://maycoletechnologies.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_[YOUR_LIVE_KEY]
VITE_ANALYTICS_ID=[YOUR_GA_ID]
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_APP_NAME=Maycole Technologies

# Backend/Serverless (Vercel Functions)
STRIPE_SECRET_KEY=sk_live_[YOUR_LIVE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]
SENDGRID_API_KEY=SG.[YOUR_KEY]
SENDGRID_FROM_EMAIL=orders@maycoletechnologies.com
JWT_SECRET=[GENERATE_NEW_SECURE_KEY]
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=[GENERATE_NEW_SECURE_KEY]
NEXTAUTH_URL=https://maycoletechnologies.com

# Optional Services
SENTRY_DSN=https://[YOUR_SENTRY_DSN]
VITE_SENTRY_DSN=https://[YOUR_SENTRY_DSN]
SENTRY_ENVIRONMENT=production
DATABASE_URL=postgresql://[YOUR_DB_URL]
```

### How to Set Variables in Vercel:
1. Go to **Project Settings** → **Environment Variables**
2. Click **"Add New"**
3. Enter key and value
4. Select **Production** (and Preview if desired)
5. Click **Save**
6. **Redeploy** project to apply changes

---

## STEP 5: Stripe Configuration

After DNS & SSL are active:

### Update Stripe Webhook URL:
1. Go to **Stripe Dashboard** → **Webhooks**
2. Edit existing webhook (or create new)
3. Update endpoint URL:
   ```
   https://maycoletechnologies.com/api/webhooks/stripe
   ```
4. Verify signing secret matches `STRIPE_WEBHOOK_SECRET` env var
5. Save webhook

### Update Stripe Keys:
- Switch from **Test Keys** to **Live Keys** in Stripe Dashboard
- Update Vercel environment variables with live keys
- Verify in code: `VITE_STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY`

---

## STEP 6: Email Configuration

After domain is live:

### Configure SendGrid:
1. Go to **SendGrid Dashboard** → **Sender Authentication**
2. Verify domain: `maycoletechnologies.com`
   - Add SPF records
   - Add DKIM records
3. Once verified, emails will be sent from: `orders@maycoletechnologies.com`

### Sender Options:
```
orders@maycoletechnologies.com       (transactional emails)
support@maycoletechnologies.com      (support emails)
noreply@maycoletechnologies.com      (system emails)
```

---

## TROUBLESHOOTING

### Domain shows 404:
- ✅ DNS updated?
- ✅ Vercel detects domain in project settings?
- ✅ SSL certificate issued? (Check Vercel → Domains)
- ✅ Deployment redeployed after DNS change?

### SSL certificate not issuing:
- Wait 15 minutes after DNS update
- Vercel auto-provisions Let's Encrypt certificate
- Check Vercel → Domains → Status

### DNS not propagating:
- Check with multiple DNS checkers: `whatsmydns.net`
- TTL may be 24-48 hours
- Old records may be cached

### Email bouncing:
- Verify SPF/DKIM in SendGrid
- Check DMARC policy
- Verify sender email in SendGrid settings

---

## CHECKLIST - Print & Track

- [ ] Domain registered: `maycoletechnologies.com`
- [ ] Domain resolves: `nslookup maycoletechnologies.com`
- [ ] Added domain to Vercel project
- [ ] DNS records updated at registrar (A/CNAME)
- [ ] DNS propagation verified (wait if needed)
- [ ] SSL certificate issued by Let's Encrypt
- [ ] HTTPS working: `https://maycoletechnologies.com`
- [ ] Vercel environment variables configured
- [ ] Stripe webhook URL updated
- [ ] Stripe keys switched to LIVE
- [ ] SendGrid domain verified (SPF/DKIM)
- [ ] Test payment processed
- [ ] Order confirmation email received
- [ ] Analytics tracking verified

---

## SUCCESS CRITERIA

✅ **DEPLOYMENT COMPLETE** when:
1. `https://maycoletechnologies.com` loads website
2. All routes work: `/tracker`, `/privacy`, `/terms`, `/cookies`
3. Stripe checkout accepts test card
4. Order confirmation email received
5. Analytics shows visit in Google Analytics
6. No security warnings in browser

---

## Next Steps After Domain:
1. **Complete Stripe Implementation** (email + database)
2. **Run Full QA Testing** on production domain
3. **Monitor Analytics** for issues
4. **Collect Performance Metrics**

---

**CONTACT SUPPORT**: If domain isn't resolving after 24 hours, contact your domain registrar.

**ESTIMATED TIME**: 15 minutes - 48 hours (including DNS propagation)
