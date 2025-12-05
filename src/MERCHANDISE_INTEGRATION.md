# MT Merchandise Store - Integration Guide

This guide shows you how to integrate the official MT (Maycole Technologies) merchandise store with caps and t-shirts into your existing website.

## 📦 What You Just Got

✅ **4 New Components:**

- `MerchandiseSection.tsx` - Product display
- `MerchandiseCart.tsx` - Shopping cart
- `MerchandiseCheckout.tsx` - Checkout flow
- `StorePage.tsx` - Main store page

✅ **1 New API Module:**

- `stripe-merchandise.ts` - Stripe checkout integration

✅ **6 Pre-configured Products:**

- 3 premium caps ($24.99 - $34.99)
- 3 premium t-shirts ($22.99 - $39.99)

✅ **Full Feature Set:**

- Product browsing
- Shopping cart
- Two-stage checkout
- Stripe payment integration
- Order confirmation
- Responsive design
- Dark mode support

---

## 🔧 Integration Steps (10 minutes)

### Step 1: Update `src/App.tsx`

Add the store view to your app routing:

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

// ... existing imports ...
import { StorePage } from './components/StorePage';

type AppView = 'website' | 'tracker' | 'store' | 'privacy' | 'terms' | 'cookies' | '404';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('website');

  // Handle URL-based routing
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      if (path === '/store') {
        setCurrentView('store');
      } else if (path === '/privacy-policy' || path === '/privacy') {
        setCurrentView('privacy');
      } else if (path === '/terms-of-service' || path === '/terms') {
        setCurrentView('terms');
      } else if (path === '/cookie-policy' || path === '/cookies') {
        setCurrentView('cookies');
      } else if (path === '/tracker') {
        setCurrentView('tracker');
      } else if (path === '/' || path === '/index.html') {
        setCurrentView('website');
      } else {
        setCurrentView('404');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {currentView === 'website' && (
        <motion.div key="website">
          <Header />
          <HeroSection />
          <MainSections />
          <Footer />
          <FloatingTrialButton />
          <CookieConsent />
          <DemoDisclaimer />
          <DevButton />
        </motion.div>
      )}

      {currentView === 'store' && (
        <motion.div key="store">
          <StorePage />
        </motion.div>
      )}

      {currentView === 'tracker' && (
        <motion.div key="tracker">
          <AuthenticatedTracker />
        </motion.div>
      )}

      {currentView === 'privacy' && (
        <motion.div key="privacy">
          <button onClick={() => setCurrentView('website')} className="p-4">
            <ArrowLeft /> Back
          </button>
          <PrivacyPolicy />
        </motion.div>
      )}

      {currentView === 'terms' && (
        <motion.div key="terms">
          <button onClick={() => setCurrentView('website')} className="p-4">
            <ArrowLeft /> Back
          </button>
          <TermsOfService />
        </motion.div>
      )}

      {currentView === 'cookies' && (
        <motion.div key="cookies">
          <button onClick={() => setCurrentView('website')} className="p-4">
            <ArrowLeft /> Back
          </button>
          <CookiePolicy />
        </motion.div>
      )}

      {currentView === '404' && (
        <motion.div key="404">
          <NotFound />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Step 2: Update `src/components/Header.tsx`

Add a "Store" link to your navigation:

```tsx
<nav className="flex items-center gap-8">
  <a href="/" className="text-slate-300 hover:text-white transition">
    Home
  </a>
  <a href="/store" className="text-slate-300 hover:text-white transition">
    Store
  </a>
  <a href="/tracker" className="text-slate-300 hover:text-white transition">
    Tracker
  </a>
  <a href="/privacy-policy" className="text-slate-300 hover:text-white transition">
    Privacy
  </a>
</nav>
```

Or in your mobile menu:

```tsx
<SheetContent>
  <nav className="space-y-4">
    <a href="/" className="block hover:text-blue-500">
      Home
    </a>
    <a href="/store" className="block hover:text-blue-500">
      Store
    </a>
    <a href="/tracker" className="block hover:text-blue-500">
      Tracker
    </a>
    <a href="/privacy-policy" className="block hover:text-blue-500">
      Privacy
    </a>
  </nav>
</SheetContent>
```

### Step 3: Update Environment Variables

Add to `.env.local`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_SECRET_KEY=sk_test_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
VITE_APP_URL=http://localhost:5173
SENDGRID_API_KEY=SG.XXXXX
SENDGRID_FROM_EMAIL=orders@maycole.com
```

And `.env.production`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
VITE_APP_URL=https://yourdomain.com
SENDGRID_API_KEY=SG.XXXXX
SENDGRID_FROM_EMAIL=orders@maycole.com
```

### Step 4: Install Stripe (if not already installed)

```bash
npm install stripe @stripe/stripe-js
```

### Step 5: Test

```bash
npm run dev
```

Visit `http://localhost:5173/store` and test the store!

---

## 🛒 Quick Feature Tour

### Browse Products

- Visit `/store`
- See 6 merchandise items with images, descriptions, prices
- Available colors/sizes shown
- Stock status indicator

### Add to Cart

- Click "Add" on any product
- Item appears in cart with count badge
- Click "Cart" button to open cart

### View Cart

- See all items with quantities
- Adjust quantities with +/- buttons
- Remove items with X
- Real-time total calculation
- Shipping threshold messaging

### Checkout

- **Stage 1**: Enter shipping details
  - Email
  - Full name
  - Address, city, state, ZIP
  - Country
- **Stage 2**: Secure payment with Stripe
  - Order summary
  - Safe card processing
  - Success confirmation

---

## 🎨 Customization Examples

### Change Store Name

In `StorePage.tsx`:

```tsx
<h1 className="text-2xl font-bold ...">🛍️ Official MT Merchandise {/* Update this */}</h1>
```

### Change Product Prices

In `MerchandiseSection.tsx`:

```tsx
{
  id: 'cap-classic-black',
  name: 'MT Classic Cap - Black',
  price: 24.99,  // ← Change this
  // ...
}
```

### Change Shipping Cost

In `MerchandiseCart.tsx`:

```tsx
const shipping = subtotal > 50 ? 0 : 9.99;
// Change 50 to your threshold
// Change 9.99 to your shipping cost
```

### Change Colors

In `MerchandiseSection.tsx`, look for these strings and change the colors:

```tsx
className = 'bg-gradient-to-r from-blue-600 to-purple-600';
// Change to:
className = 'bg-gradient-to-r from-cyan-600 to-blue-600';
```

### Add New Products

In `MerchandiseSection.tsx`:

```tsx
const products: MerchandiseProduct[] = [
  // ... existing ...
  {
    id: 'hoodie-black',
    name: 'MT Premium Hoodie - Black',
    category: 'hoodies', // or 'caps' or 'tshirts'
    description: 'Premium fleece hoodie with embroidered MT logo',
    price: 54.99,
    image: 'https://...',
    colors: ['Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    badge: 'NEW',
  },
];
```

Then update the section rendering to include the new category:

```tsx
const hoodies = products.filter(p => p.category === 'hoodies');

// Add this section after t-shirts:
<div>
  <h3 className="text-3xl font-bold text-white mb-8">Premium Hoodies</h3>
  <motion.div className="grid ...">
    {hoodies.map(product => (...))}
  </motion.div>
</div>
```

---

## 💳 Stripe Setup (5 minutes)

### Get Test API Keys

1. Go to **[stripe.com](https://stripe.com)**
2. Click **Sign In** (or **Sign Up** if new)
3. Create account (email, password, basic info)
4. Go to **Dashboard** → **Developers** → **API Keys**
5. Copy your **Publishable Key** (pk*test*...)
6. Copy your **Secret Key** (sk*test*...)

### Add Keys to `.env.local`

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_51234567890
STRIPE_SECRET_KEY=sk_test_abcdefghijklmnop
```

### Test with Sample Card

On the checkout page, when you click "Pay", use:

| Field           | Value                   |
| --------------- | ----------------------- |
| Card Number     | 4242 4242 4242 4242     |
| Expiration      | Any future date (12/34) |
| CVC             | Any 3 digits (123)      |
| Cardholder Name | Any name                |

This will create a **successful test transaction** (no real charge).

---

## 📊 Monitoring & Analytics

### Stripe Dashboard

Monitor all transactions at https://dashboard.stripe.com:

- **Payments**: View all transactions
- **Customers**: See repeat customers
- **Products**: Manage product catalog
- **Payouts**: Track money transferred to bank

### Add Google Analytics

In `StorePage.tsx`:

```tsx
import { useEffect } from 'react';

export function StorePage() {
  useEffect(() => {
    // Track store view
    gtag.pageview({
      page_path: '/store',
      page_title: 'MT Merchandise Store',
    });
  }, []);

  // ... rest of component
}
```

### Track Conversions

Add conversion tracking in checkout success:

```tsx
// In MerchandiseCheckout.tsx, onSuccess callback:
onSuccess={() => {
  gtag.event('purchase', {
    value: total,
    currency: 'USD',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  });
}}
```

---

## 🚀 Launch Checklist

Before launching to production:

- [ ] Stripe account created and verified
- [ ] Live API keys obtained from Stripe
- [ ] Product images uploaded and URLs added
- [ ] Prices reviewed and confirmed
- [ ] Test transaction completed with test card
- [ ] `.env.production` configured with live keys
- [ ] Email confirmation working (SendGrid configured)
- [ ] Mobile layout tested (iOS + Android)
- [ ] Cart + checkout tested end-to-end
- [ ] Success page displays correctly
- [ ] HTTPS enabled on domain
- [ ] Store link added to header navigation
- [ ] Terms of Service includes merchandise info
- [ ] Refund policy documented
- [ ] Customer support email configured

---

## 📞 Troubleshooting

### Cart not opening?

Check that `StorePage.tsx` is rendering and styles are loading. Verify:

```bash
npm run dev
# Visit http://localhost:5173/store
# Check browser console for errors
```

### Stripe errors?

1. Verify API keys in `.env.local`
2. Check that `VITE_STRIPE_PUBLIC_KEY` is set correctly
3. Stripe dashboard shows test/live mode indicator (top-left)
4. Network tab shows requests to `api.stripe.com`

### Images not loading?

1. Check image URL is valid (test in browser)
2. Verify image hosting service is accessible
3. Check CORS settings if using external service
4. Add image to `src/public` if hosting locally

### Payment fails?

1. Verify Stripe API keys are correct
2. Check Stripe dashboard for error details
3. Verify request body format in console
4. Test with valid card: 4242 4242 4242 4242

---

## 📚 File Structure

```
src/
├── components/
│   ├── MerchandiseSection.tsx      (← Product display)
│   ├── MerchandiseCart.tsx         (← Shopping cart)
│   ├── MerchandiseCheckout.tsx     (← Checkout flow)
│   └── StorePage.tsx                (← Main store page)
│
├── lib/
│   └── stripe-merchandise.ts        (← Stripe API)
│
├── App.tsx                          (← Add store route)
├── components/Header.tsx            (← Add store link)
└── MERCHANDISE_SETUP.md             (← Full setup guide)
```

---

## 🎯 Next Steps

1. **Update Products**
   - Change names, prices, descriptions
   - Upload product images
   - Add/remove products as needed

2. **Get Stripe Keys**
   - Create Stripe account
   - Get test and live keys
   - Add to environment files

3. **Customize Appearance**
   - Match your brand colors
   - Update store name
   - Add your logo

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Add production env variables
   - Test with live Stripe keys

5. **Launch**
   - Promote to your audience
   - Monitor sales & feedback
   - Optimize product offerings

---

## 💡 Pro Tips

### Print-on-Demand Services

Instead of managing inventory, use print-on-demand:

- **Printful** (printful.com) - Integrates with Stripe
- **Teespring** (teespring.com) - Easy design tool
- **Redbubble** (redbubble.com) - Zero upfront cost

### Enhance Product Photos

- Use Canva (canva.com) for mockups
- Mock it up with real product images
- Consistent white/colored background
- High resolution (1200x1200px minimum)

### Email Confirmation

Set up SendGrid to auto-send order confirmations:

```tsx
// In webhook handler
await sendgrid.send({
  to: session.customer_email,
  from: 'orders@yourdomain.com',
  subject: 'Your MT Store Order Confirmation',
  html: orderConfirmationEmail(session),
});
```

### Inventory Management

Create a simple database table:

```sql
CREATE TABLE merchandise_items (
  id UUID PRIMARY KEY,
  product_id VARCHAR(255),
  size VARCHAR(20),
  color VARCHAR(50),
  quantity_available INT,
  quantity_sold INT,
  last_updated TIMESTAMP
);
```

---

**🎉 Your merchandise store is ready!**

Visit `http://localhost:5173/store` and start selling!

For questions, refer to `MERCHANDISE_SETUP.md` or Stripe docs at https://stripe.com/docs
