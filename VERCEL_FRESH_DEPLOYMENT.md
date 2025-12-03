# Vercel Fresh Deployment Guide

## Status: READY FOR DEPLOYMENT ✅

All code is built, tested, and committed to GitHub. This is a clean deployment from scratch.

## Prerequisites Completed

- ✅ Code audit completed (0 critical issues)
- ✅ Security hardening applied
- ✅ Git repository initialized and pushed to GitHub
- ✅ PWA implementation (Service Worker, Web Manifest)
- ✅ IconButton component integrated with Lucide React icons
- ✅ Build verified successful
- ✅ Dependencies clean (0 vulnerabilities after npm audit fix)
- ✅ vercel.json fixed (removed invalid domains property)
- ✅ All changes committed to GitHub

## Fresh Deployment Steps

### Step 1: Clean Up Old Deployments

All old failed deployments have been removed from local Vercel configuration.

### Step 2: Deploy to Vercel (First Time)

```bash
# From the project directory:
npx vercel --prod

# You will be prompted to:
# 1. Sign in to Vercel (use your GitHub account)
# 2. Link to existing project or create new one
# 3. Confirm build settings (npm run build)
# 4. Confirm output directory (build)
# 5. Confirm environment variables (will ask for each one)
```

### Step 3: Configure Environment Variables

When prompted, set these environment variables in Vercel Dashboard:

```
VITE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=your-tracking-id
VITE_CONTACT_EMAIL=help@maycoletechnologies.com
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@maycoletechnologies.com
MAILCHIMP_API_KEY=your-mailchimp-key
VITE_SENTRY_DSN=your-sentry-dsn
```

### Step 4: Connect Custom Domain

After first deployment succeeds:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `maycoletechnologies.com`
3. Follow DNS instructions:
   - Option A: Transfer nameservers to Vercel
   - Option B: Update CNAME records with your current registrar

### Step 5: Verify Deployment

```bash
# Check deployment status:
npx vercel status

# View deployment URL in output
# Example: https://maycoletechnologies.vercel.app
```

## Important Notes

### Environment Variable Setup

- Add environment variables via Vercel Dashboard, NOT in `.env` file
- `.env.example` provided as template (don't commit actual `.env` with secrets)
- Variables are automatically injected during build

### Vercel.json Configuration

- ✅ Fixed: Removed unsupported `domains` property
- ✅ Configured: Build command, output directory, framework
- ✅ Configured: Cache headers for Service Worker (no cache)
- ✅ Configured: Content-Type headers for manifest.json

### Build Output

- Output Directory: `build/` (Vite default)
- Build Command: `npm run build`
- Framework: Vite (auto-detected)
- Build Time: ~25 seconds

## After Successful Deployment

1. Test all features at deployed URL
2. Verify Service Worker installation
3. Test offline functionality
4. Check PWA install prompt on mobile
5. Monitor deployment logs for any errors

## Rollback (if needed)

To rollback to a previous deployment:

```bash
npx vercel rollback
```

## Support

If deployment fails:

1. Check build logs: `npx vercel logs --follow`
2. Verify environment variables are set
3. Ensure all dependencies are installed: `npm install`
4. Rebuild locally: `npm run build`
5. Check vercel.json syntax

---

**Last Updated:** December 3, 2025
**Project:** MaycoleTechnologies
**Status:** Ready for clean deployment
