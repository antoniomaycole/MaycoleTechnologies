# 🚀 Stripe Integration - Immediate Action Items

**Print this page or keep it open while setting up!**

---

## RIGHT NOW (Next 2 Minutes)

### ✅ Task 1: Copy Environment Template

```bash
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
cp .env.local.example .env.local
```

**Expected result**: `.env.local` file appears in project root

---

## NEXT (5 Minutes) - Get Stripe Test Keys

### ✅ Task 2: Get Public Key

1. **Open**: https://dashboard.stripe.com/apikeys
2. **Look for**: Toggle **"View test data"** in top-right
3. **Toggle it ON** (should be blue)
4. **Find**: "Publishable key" section
5. **Click**: Copy button (or select and Ctrl+C)
6. **Paste into `.env.local`** on this line:
   ```env
   VITE_STRIPE_PUBLIC_KEY=PASTE_HERE
   ```

**Example**: `VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX123abc`

### ✅ Task 3: Get Secret Key

1. **Same page** (https://dashboard.stripe.com/apikeys)
2. **Find**: "Secret key" section
3. **Click**: Copy button
4. **Paste into `.env.local`** on this line:
   ```env
   STRIPE_SECRET_KEY=PASTE_HERE
   ```

**Example**: `STRIPE_SECRET_KEY=sk_test_XXXXX456def`

**⚠️ WARNING**: Keep secret key private! Never commit .env.local to git!

---

## THEN (10 Minutes) - Create Stripe Products

### ✅ Task 4: Create Professional Plan

1. **Open**: https://dashboard.stripe.com/products
2. **Click**: **"+ Add Product"**
3. **Fill in**:
   - **Name**: `Professional`
   - **Price**: `99.00`
   - **Currency**: `USD`
   - **Billing period**: `Monthly` (select "Recurring")
4. **Click**: **"Create Product"**
5. **Find** the Price ID on product page
   - Looks like: `price_1ABC123XYZ...`
6. **Copy** the Price ID
7. **Paste** into `.env.local`:
   ```env
   VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=PASTE_HERE
   ```

### ✅ Task 5: Create Enterprise Plan

1. **Click**: **"+ Add Product"** (again)
2. **Fill in**:
   - **Name**: `Enterprise`
   - **Price**: `299.00`
   - **Currency**: `USD`
   - **Billing period**: `Monthly` (select "Recurring")
3. **Click**: **"Create Product"**
4. **Copy** the Price ID
5. **Paste** into `.env.local`:
   ```env
   VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=PASTE_HERE
   ```

---

## AFTER THAT (5 Minutes) - Verify Configuration

### ✅ Task 6: Check .env.local File

Open `.env.local` and verify these lines are filled:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX         ✅ Not empty
STRIPE_SECRET_KEY=sk_test_XXXXX              ✅ Not empty
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=...   ✅ Not empty
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=...     ✅ Not empty
```

**Checklist**:

- [ ] All 4 lines have values (not "PASTE_HERE")
- [ ] No typos or extra spaces
- [ ] Keys start with correct prefix:
  - Public: starts with `pk_test_` ✅
  - Secret: starts with `sk_test_` ✅
  - Prices: starts with `price_` ✅

---

## TESTING (10 Minutes)

### ✅ Task 7: Start Dev Server

```bash
npm run dev
```

**Expected output**:

```
VITE v6.4.1 dev server running at:
  > Local:    http://localhost:5173/
```

### ✅ Task 8: Test Payment

1. **Open**: http://localhost:5173
2. **Wait for page** to load (may take 10 seconds)
3. **Scroll down** to Pricing section
4. **Click**: "Professional Plan"
5. **Click**: "Subscribe" button
6. **Use test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25` (or any future date)
   - CVC: `123`
   - Name: Any name (e.g., "Test User")
7. **Click**: "Pay"

**Expected result**:

- ✅ Form submits (no error)
- ✅ Redirected to Stripe checkout
- ✅ Payment page appears
- ✅ After completing: Success page
- ✅ Success message displays

---

## VERIFICATION (5 Minutes)

### ✅ Task 9: Verify in Stripe Dashboard

1. **Open**: https://dashboard.stripe.com/payments
2. **Look for**: Your test payment
   - Should show amount: $99.00
   - Status: "Succeeded" (green checkmark)
   - Recent transaction (within last minute)

**Expected result**:

- ✅ Payment visible in dashboard
- ✅ Status shows "Succeeded"
- ✅ Amount is $99.00

### ✅ Task 10: Verify Build Still Works

```bash
# Stop dev server: Press Ctrl+C
npm run build
```

**Expected result**:

```
✅ built in 1m 22s
```

---

## SUCCESS! 🎉

If you completed all 10 tasks successfully:

- ✅ Stripe is configured for local development
- ✅ Test payment flow works end-to-end
- ✅ Code builds without errors
- ✅ You're ready to deploy to production

---

## NEXT: Deploy to Production (45 minutes)

When you're ready:

1. Push code to GitHub: `git add . && git commit -m "Stripe integration" && git push`
2. Vercel auto-deploys
3. Configure webhook endpoint (see `STRIPE_ACTIVATION_CHECKLIST.md`)
4. Test on live domain
5. Switch to live API keys
6. Test with real card

**See**: `STRIPE_INTEGRATION_COMPLETE.md` for detailed deployment guide

---

## TROUBLESHOOTING

### Issue: "Cannot find .env.local"

- [ ] File exists in project root (same level as package.json)
- [ ] Filename is exactly `.env.local` (with dot at start)
- [ ] Restart dev server: `npm run dev`

### Issue: "Stripe is undefined in console"

- [ ] VITE_STRIPE_PUBLIC_KEY is set in .env.local
- [ ] Key starts with `pk_test_`
- [ ] Restart dev server
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Test payment fails"

- [ ] Using correct test card: 4242 4242 4242 4242
- [ ] Expiry is future date: 12/25 or later
- [ ] "View test data" toggle is ON in Stripe
- [ ] Wait 5 seconds after page loads

### Issue: "Can't find price IDs"

- [ ] Go to https://dashboard.stripe.com/products
- [ ] Look for your "Professional" and "Enterprise" products
- [ ] Click each product
- [ ] Find "Price" section with ID starting with `price_`
- [ ] Copy exact ID (long string with dashes)

---

## QUICK COMMANDS REFERENCE

```bash
# Create config
cp .env.local.example .env.local

# Start dev
npm run dev

# Build
npm run build

# View logs
npm run dev

# Push to GitHub
git add .
git commit -m "Stripe integration"
git push origin main
```

---

## FILES TO REFERENCE

| File                             | When You Need It          |
| -------------------------------- | ------------------------- |
| `.env.local`                     | Storing configuration     |
| `.env.local.example`             | See all available options |
| `STRIPE_INTEGRATION_COMPLETE.md` | Full setup guide          |
| `STRIPE_QUICK_REFERENCE.md`      | Quick lookup              |
| `src/lib/stripe-config.ts`       | How initialization works  |

---

## KEY DEADLINES / TIME ESTIMATES

| Task            | Time            |
| --------------- | --------------- |
| Setup .env      | 2 min           |
| Get Stripe keys | 5 min           |
| Create products | 10 min          |
| Verify config   | 5 min           |
| Local testing   | 10 min          |
| Verification    | 5 min           |
| **TOTAL**       | **~37 minutes** |

---

## ⚡ Power Users

If you're experienced with Stripe, here's the fast path:

```bash
# 1. Copy template
cp .env.local.example .env.local

# 2. Run setup script (Windows PowerShell)
.\setup-stripe.ps1

# 3. Verify build
npm run build

# 4. Done!
```

---

## 🎯 You're All Set!

Everything is configured and ready. Start with Task 1 (copy .env.local.example) and work through the list.

**Questions?** All documentation is in the project root.

**Ready to deploy?** After testing locally, see `STRIPE_ACTIVATION_CHECKLIST.md`

---

**Last Updated**: December 3, 2025  
**Status**: ✅ Integration Complete - Ready for Configuration
