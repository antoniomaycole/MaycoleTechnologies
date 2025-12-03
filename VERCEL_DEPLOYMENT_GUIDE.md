# Vercel Deployment Guide - MaycoleTechnologies

## ✅ Prerequisites Met
- ✓ React 18.3.1 + Vite 6.3.5 configured
- ✓ TypeScript strict mode enabled
- ✓ Build output: `build/` directory
- ✓ vercel.json configured for optimal deployment
- ✓ GitHub repository connected (https://github.com/AntonioMaycole/MaycoleTechnologies)

## 🚀 Deploy to Vercel (2 Options)

### Option 1: Deploy Now (Recommended)
Use Vercel CLI to deploy immediately:

```powershell
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Deploy (first time - creates new project)
vercel --prod

# 3. Follow prompts:
#    - Confirm project name: MaycoleTechnologies
#    - Link to existing project: No (or Yes if re-deploying)
#    - Environment variables: Enter them when prompted
```

### Option 2: Deploy via GitHub (Automatic)
1. Go to https://vercel.com/new
2. Import your GitHub repository: `AntonioMaycole/MaycoleTechnologies`
3. Configure environment variables in Vercel Dashboard
4. Click "Deploy" - automatic deployments on git push

## 🔐 Environment Variables to Configure in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_DEMO_MODE = false
VITE_ENABLE_ANALYTICS = false
VITE_GA_TRACKING_ID = [your GA ID]
VITE_CONTACT_EMAIL = help@maycoletechnologies.com
SENDGRID_API_KEY = [your SendGrid key]
SENDGRID_FROM_EMAIL = noreply@maycoletechnologies.com
MAILCHIMP_API_KEY = [your Mailchimp key]
VITE_SENTRY_DSN = [optional - your Sentry DSN]
```

**⚠️ IMPORTANT**: Never expose sensitive API keys in repository. Only set them in Vercel Dashboard.

## 📋 Deployment Checklist

Before deploying:
- [ ] Verify `npm run build` completes without errors (tested locally)
- [ ] Check all environment variables are correctly configured in Vercel
- [ ] Ensure .gitignore includes .env.local and node_modules
- [ ] Test with `npm run dev` locally - verify no console errors
- [ ] Review responsive design on mobile/tablet
- [ ] Check analytics tracking ID is correct
- [ ] Verify contact form SendGrid configuration
- [ ] Test newsletter signup (Mailchimp integration)

## 🌐 Post-Deployment

After successful deployment:

1. **Verify Deployment**
   ```
   https://maycoletechnologies.vercel.app (or your custom domain)
   ```

2. **Set Up Custom Domain** (Optional)
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

3. **Enable Auto-Deployments** (Recommended)
   - GitHub integration automatically deploys on push to main branch
   - Disable by unchecking in Vercel Project Settings

4. **Monitor Performance**
   - Vercel Analytics → View Core Web Vitals
   - Check build logs for any warnings

## 📊 Performance Optimization

Your build is optimized for:
- ✓ Code splitting (Vite automatic)
- ✓ CSS minification (Tailwind + PostCSS)
- ✓ Image optimization (via components)
- ✓ Lazy loading (React.lazy)
- ✓ Tree shaking (ES modules)

Vercel Edge Network will serve your assets with:
- Automatic compression (gzip/brotli)
- Geographic distribution
- CDN caching
- SSL/TLS encryption

## 🔧 Troubleshooting

**Build Fails?**
- Check `npm run build` works locally
- Verify Node.js version matches Vercel (20.x LTS recommended)
- Check for circular dependencies

**Environment Variables Not Loading?**
- Vercel needs restart after adding env vars
- Redeploy via Vercel Dashboard
- Check variable names match exactly in code

**App Loads but Shows Blank?**
- Check browser console for errors (F12)
- Verify public assets are in `public/` folder
- Check vite.config.ts base path settings

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

---

**Ready to deploy?** 🎉  
Choose Option 1 (CLI) for fastest deployment, or Option 2 (GitHub) for automatic future deployments.
