# GitHub & Vercel Deployment Guide

## Step 1: GitHub Setup (Push & Protect Code)

### Initialize Git (if not already done)
```bash
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Create .gitignore (Protect Sensitive Data)
```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
.vscode/
.idea/
```

### Push to GitHub
```bash
git add .
git commit -m "Initial commit: MaycoleTechnologies app - ready for production"
git branch -M main
git remote add origin https://github.com/AntonioMaycole/MaycoleTechnologies.git
git push -u origin main
```

### Protect Repository (In GitHub UI)
1. Go to: https://github.com/AntonioMaycole/MaycoleTechnologies/settings
2. Select "Branches" in left menu
3. Add rule for "main" branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Restrict who can push to matching branches

---

## Step 2: Vercel Configuration

### Create vercel.json (Already exists - verified)
Your `vercel.json` is properly configured with:
- Build command: `npm run build`
- Output directory: `build`
- Node version: 20.x
- All required environment variables defined

### Update Environment Variables for Vercel
Add these in Vercel Dashboard (Settings > Environment Variables):

```
VITE_API_URL = https://your-domain.vercel.app
VITE_STRIPE_PUBLIC_KEY = pk_live_xxxxx
STRIPE_SECRET_KEY = sk_live_xxxxx
SENDGRID_API_KEY = SG.xxxxx
DATABASE_URL = postgresql://...
JWT_SECRET = (generate random string)
SENTRY_DSN = https://xxxxx@sentry.io/xxxxx
```

---

## Step 3: Connect Vercel to GitHub

### In Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Choose "AntonioMaycole/MaycoleTechnologies"
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`
6. Add Environment Variables (see above)
7. Click "Deploy"

---

## Step 4: Post-Deployment Checklist

✅ Verify deployment URL works
✅ Check API endpoints respond
✅ Verify analytics tracking works
✅ Test lead capture form
✅ Confirm environment variables loaded
✅ Monitor build logs for errors

---

## Quick Start Commands

```bash
# 1. Configure Git
git config user.name "Antonio Maycole"
git config user.email "your@email.com"

# 2. Create .gitignore
# (See above)

# 3. Stage and commit
git add .
git commit -m "Launch: MaycoleTechnologies production-ready"

# 4. Push to GitHub
git push -u origin main

# 5. Deploy via Vercel CLI (alternative to UI)
vercel --prod
```

---

## Environment Variables Needed

| Variable | Type | Where to Get |
|----------|------|-------------|
| VITE_API_URL | Public | Your Vercel domain |
| VITE_STRIPE_PUBLIC_KEY | Public | Stripe Dashboard |
| STRIPE_SECRET_KEY | Secret | Stripe Dashboard |
| SENDGRID_API_KEY | Secret | SendGrid Account |
| DATABASE_URL | Secret | Your Database Provider |
| JWT_SECRET | Secret | Generate: `openssl rand -base64 32` |
| SENTRY_DSN | Public | Sentry Dashboard |

---

## Security Best Practices

✅ Never commit .env files
✅ Use Vercel's environment variables UI
✅ Enable branch protection on main
✅ Require PR reviews before merge
✅ Use secrets in GitHub Actions
✅ Rotate JWT_SECRET monthly
✅ Monitor Sentry for errors
✅ Enable 2FA on both GitHub & Vercel accounts

