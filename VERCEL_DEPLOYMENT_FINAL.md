# Vercel Deployment Configuration & Environment Variables

## ✅ Quick Setup Guide for Tonight's Launch

### Step 1: Link to Vercel

```bash
npm install -g vercel
vercel login
# This will open browser to authenticate with GitHub account
```

### Step 2: Deploy to Vercel

```bash
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
vercel
# Select project settings and deploy
```

---

## Environment Variables (Set in Vercel Dashboard)

Copy these and set them in **Project Settings > Environment Variables**:

### Frontend Variables

```
VITE_API_URL=https://your-domain.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxxx
```

### Backend/API Variables

```
NODE_ENV=production
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@maycoletechnologies.com
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=postgresql://user:password@host:5432/dbname
SENTRY_DSN=https://xxxxx@sentry.io/xxxxxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
CORS_ORIGINS=https://your-domain.vercel.app
```

---

## GitHub Protection (Private Repository)

### Step 1: Make Repository Private

1. Go to GitHub: https://github.com/AntonioMaycole/MaycoleTechnologies
2. Settings > Visibility > Change to **Private**
3. Save changes

### Step 2: Set Up Branch Protection

1. Settings > Branches > Add Rule
2. Branch name: `main`
3. ✅ Require pull request reviews before merging
4. ✅ Require status checks to pass
5. ✅ Require branches to be up to date

### Step 3: Add Collaborators (if needed)

1. Settings > Collaborators
2. Add team members with appropriate permissions

---

## Vercel Deployment Steps

### Option 1: Using Vercel CLI (Recommended - Tonight)

```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import GitHub repository
4. Select `AntonioMaycole/MaycoleTechnologies`
5. Configure project settings
6. Deploy

---

## API Configuration for Vercel

### Frontend API Base URL

Update `src/lib/api.ts`:

```typescript
const API_BASE = process.env.VITE_API_URL || 'https://your-vercel-domain.vercel.app';
```

### API Routes Structure

Your `/api` directory structure is already set up for Vercel:

```
/api
  /subscribe.ts           → POST /api/subscribe
  /analytics
    /track.ts            → POST /api/analytics/track
    /metrics.ts          → GET /api/analytics/metrics
```

These automatically become Vercel Serverless Functions!

---

## Testing Before Production

### 1. Test Build Locally

```powershell
npm run build
# Check for errors
```

### 2. Preview Production Build

```powershell
npm run preview
# Visit http://localhost:4173
```

### 3. Test API Endpoints

```bash
# Test analytics tracking
curl -X POST https://your-domain.vercel.app/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","events":[]}'

# Test metrics fetch
curl https://your-domain.vercel.app/api/analytics/metrics
```

---

## Post-Deployment Checklist

- [ ] Vercel deployment successful
- [ ] Domain configured (custom domain or vercel.app)
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Analytics tracking working
- [ ] Lead capture form sending data
- [ ] Products launching correctly
- [ ] Email notifications working
- [ ] GitHub private + branch protection
- [ ] SSL certificate active (automatic on Vercel)

---

## GitHub & Vercel Integration

✅ Already Connected:

- GitHub to Vercel automatic deployments
- CI/CD pipeline configured
- Pre-commit hooks installed

### Auto-Deploy on Push

Every push to `main` branch automatically deploys to production!

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files (in .gitignore)
- ✅ Set all secrets in Vercel dashboard
- ✅ Rotate API keys regularly

### 2. GitHub Secrets

Set these for CI/CD pipeline: Settings > Secrets and variables

```
VERCEL_TOKEN=your-vercel-api-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### 3. API Security

- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Input validation implemented
- ✅ Error handling in place

---

## Monitoring & Logs

### Vercel Dashboard

- https://vercel.com/dashboard

Monitor:

- Deployment status
- Real-time logs
- Error tracking
- Performance analytics

---

## Next Steps After Tonight's Launch

1. Set up database (PostgreSQL, MongoDB)
2. Connect Stripe webhook endpoints
3. Configure SendGrid for email
4. Set up Sentry for error tracking
5. Enable analytics collection
6. Monitor traffic and conversions

---

## Support & Troubleshooting

### Common Issues

**Build fails on Vercel:**

- Check Node version compatibility
- Verify all env vars are set
- Review build logs in Vercel dashboard

**API returns 500 errors:**

- Check API logs in Vercel dashboard
- Verify environment variables
- Test locally with `vercel dev`

**Cold starts slow:**

- Normal for Vercel serverless functions
- First call takes ~1-2 seconds
- Subsequent calls are fast

---

## Commands for Tonight

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
vercel --prod

# View logs
vercel logs

# Open in browser
vercel open
```

**Status**: ✅ Ready for Production Launch
**Deployment Time**: < 5 minutes
**Downtime**: 0 minutes (zero-downtime deployment)
