# 🌐 MaycoleTechnologies.com Domain Setup Guide

## ✅ Configuration Complete

Your `vercel.json` is configured for:

- **Primary Domain**: maycoletechnologies.com
- **WWW Domain**: www.maycoletechnologies.com
- **Framework**: Vite (automatic optimization)

---

## 🚀 Domain Connection Steps

### Step 1: Deploy to Vercel First

```powershell
npx vercel --prod
```

After deployment, you'll get a Vercel URL like:

- `maycoletechnologies.vercel.app`

### Step 2: Connect Custom Domain

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `maycoletechnologies.com`
5. Choose one of two options:

#### **Option A: Transfer Domain to Vercel** (Recommended)

- Vercel manages DNS automatically
- No manual DNS configuration needed
- Included with Vercel pro plan
- Simplest setup

#### **Option B: Update DNS at Current Registrar**

If domain is at GoDaddy, Namecheap, etc:

1. Get **Vercel's Nameservers**:

   - ns1.vercel.com
   - ns2.vercel.com

2. At your domain registrar:

   - Go to DNS/Nameserver settings
   - Replace existing nameservers with Vercel's
   - Wait 24-48 hours for propagation

3. Verify in Vercel Dashboard:
   - Status changes from "pending" to "active"

### Step 3: Configure www Subdomain

Vercel automatically creates www redirect, but to make it primary:

1. In Vercel Dashboard → Domains
2. Set `maycoletechnologies.com` as **Primary Domain**
3. Vercel automatically redirects `www.maycoletechnologies.com` → `maycoletechnologies.com`

---

## 🔒 SSL/HTTPS Setup

✅ **Automatic** - Vercel provides free SSL certificate

- HTTPS enabled by default
- Certificate auto-renews
- No additional configuration needed

---

## 📋 Pre-Deployment Checklist

- [ ] Domain registered (GoDaddy, Namecheap, etc.)
- [ ] Domain ownership confirmed
- [ ] Nameservers ready to update (if using Option B)
- [ ] Code built and tested locally
- [ ] All environment variables configured
- [ ] Security audit passed (0 vulnerabilities ✓)

---

## 🔗 DNS Records (If Needed)

If manually managing DNS, add these records:

### For root domain (maycoletechnologies.com):

```
Type: A or CNAME
Name: @
Value: 76.76.19.132 (Vercel IP)
OR
Type: CNAME
Name: @
Value: cname.vercel.com
```

### For www subdomain (www.maycoletechnologies.com):

```
Type: CNAME
Name: www
Value: cname.vercel.com
```

---

## ⏱️ Timeline

1. **Deploy to Vercel**: 2-3 minutes
2. **Connect Domain**: 5-10 minutes
3. **DNS Propagation**: 24-48 hours (may be instant)
4. **Live on maycoletechnologies.com**: Done!

---

## 🧪 Verify Domain Connection

After DNS propagates, test at:

- https://maycoletechnologies.com
- https://www.maycoletechnologies.com

Both should show your app with:

- ✓ SSL certificate valid
- ✓ PWA installable
- ✓ Icon buttons working
- ✓ Service Worker active

---

## 📞 Troubleshooting

**Domain not resolving?**

- Check DNS propagation: https://whatsmydns.net
- Enter: maycoletechnologies.com
- Verify nameservers are correct
- Wait 24-48 hours (DNS caching)

**SSL certificate error?**

- Vercel auto-generates certificates
- Usually appears within 30 minutes
- Check Vercel Dashboard → Domains → Status

**WWW redirect not working?**

- Set primary domain in Vercel Dashboard
- Vercel handles automatic redirect
- May take a few minutes to activate

---

## 🎉 You're All Set!

Your app will be live at:

### **https://maycoletechnologies.com**

With:

- ✅ Professional custom domain
- ✅ SSL/HTTPS security
- ✅ PWA features enabled
- ✅ Global CDN (Vercel Edge Network)
- ✅ Automatic deployments on git push
- ✅ Zero downtime deployments

---

## 📝 Next Steps

1. **Run deployment command** (see Step 1 above)
2. **Connect domain** (see Step 2 above)
3. **Update domain settings** if needed
4. **Verify DNS propagation** (24-48 hours)
5. **Test at maycoletechnologies.com** ✓

**Questions?** Contact Vercel support or check docs at https://vercel.com/docs/custom-domains
