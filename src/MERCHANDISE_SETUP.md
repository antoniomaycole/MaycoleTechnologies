# Official MT (Maycole Technologies) Merchandise Store Setup Guide

Welcome! This guide walks you through setting up your official Maycole Technologies merchandise store with caps and t-shirts, integrated with Stripe for seamless payment processing.

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Component Overview](#component-overview)
3. [Stripe Integration](#stripe-integration)
4. [Merchandise Product Setup](#merchandise-product-setup)
5. [Customization](#customization)
6. [Going Live](#going-live)
7. [FAQ](#faq)

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Required Packages

```bash
npm install stripe @stripe/react-stripe-js framer-motion lucide-react
```

### Step 2: Get Your Stripe API Keys

1. Go to **[stripe.com](https://stripe.com)**
2. Create a free account (2 minutes)
3. Get your **test keys** from Dashboard → Developers → API Keys
   - **Publishable key**: `pk_test_XXXXX`
   - **Secret key**: `sk_test_XXXXX`

### Step 3: Add Environment Variables

Create/update `.env.local`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_SECRET_KEY=sk_test_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
VITE_APP_URL=http://localhost:5173
```

For production `.env.production`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
VITE_APP_URL=https://yourdomain.com
```

### Step 4: Add Store Route to Your App

Update `src/App.tsx`:

```tsx
import { StorePage } from './components/StorePage';

type AppView = 'website' | 'tracker' | 'store' | 'privacy' | 'terms' | 'cookies' | '404';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('website');

  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      // ... existing routes ...
      if (path === '/store') {
        setCurrentView('store');
      }
    };
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  return (
    <>
      {currentView === 'store' && <StorePage />}
      {currentView === 'website' && <MainLayout />}
      {/* ... other views ... */}
    </>
  );
}
```

### Step 5: Add Store Link to Navigation

Update `src/components/Header.tsx`:

```tsx
<nav className="space-y-2">
  <a href="/" className="block hover:text-blue-500">
    Home
  </a>
  <a href="/store" className="block hover:text-blue-500">
    Store
  </a>
  <a href="/privacy-policy" className="block hover:text-blue-500">
    Privacy
  </a>
</nav>
```

### Step 6: Test

```bash
npm run dev
```

Visit `http://localhost:5173/store` and test with card: **4242 4242 4242 4242**

---

## 📦 Component Overview

### Core Components

#### 1. **MerchandiseSection** (`src/components/MerchandiseSection.tsx`)

Displays all merchandise products with images, descriptions, colors/sizes, and prices.

**Features:**

- 6 pre-configured products (3 caps, 3 t-shirts)
- Responsive grid layout
- Color/size selection UI
- Stock status badges
- "Add to Cart" functionality

**Usage:**

```tsx
<MerchandiseSection onAddToCart={(product) => handleAddToCart(product)} />
```

#### 2. **MerchandiseCart** (`src/components/MerchandiseCart.tsx`)

Slide-out shopping cart with quantity controls and order summary.

**Features:**

- Cart preview with item count
- Quantity controls (+/- buttons)
- Real-time price calculation
- Shipping threshold messaging ($50 free shipping)
- Tax calculation
- Checkout button

#### 3. **MerchandiseCheckout** (`src/components/MerchandiseCheckout.tsx`)

Two-stage checkout: shipping info → payment.

**Features:**

- **Stage 1**: Collect customer shipping details
- **Stage 2**: Secure Stripe payment
- Form validation
- Order summary
- Stripe integration
- Success confirmation

#### 4. **StorePage** (`src/components/StorePage.tsx`)

Main store page that orchestrates all components.

**Features:**

- Header with cart button
- Product listing
- Cart management
- Checkout flow
- Order confirmation

---

## 💳 Stripe Integration

### Understanding the Payment Flow

```
User Clicks "Buy"
    ↓
Adds item to cart
    ↓
Clicks "Cart" button
    ↓
Enters shipping info
    ↓
Clicks "Continue to Payment"
    ↓
Clicks "Pay with Stripe"
    ↓
Redirects to Stripe Checkout
    ↓
User enters card info
    ↓
Payment processed
    ↓
Success page + email confirmation
```

### Test Mode vs Live Mode

**Test Mode (Development)**

- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`
- Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (declined)
- No real charges
- Use for development & testing

**Live Mode (Production)**

- Publishable key: `pk_live_...`
- Secret key: `sk_live_...`
- Real card processing
- Real charges
- Requires Stripe account verification
- Requires HTTPS

### Test Cards

| Card Number         | Exp        | CVC          | Result            |
| ------------------- | ---------- | ------------ | ----------------- |
| 4242 4242 4242 4242 | Any future | Any 3 digits | ✅ Success        |
| 4000 0000 0000 0002 | Any future | Any 3 digits | ❌ Declined       |
| 3782 822463 10005   | Any future | Any 4 digits | ✅ Success (Amex) |
| 5105 1051 0510 5100 | Any future | Any 3 digits | ✅ Success (MC)   |

---

## 🛍️ Merchandise Product Setup

### Current Products

**Caps Collection:**

1. **MT Classic Cap - Black** ($24.99)
   - Colors: Black, Navy, White
   - Stock: Yes

2. **MT Tech Cap - Electric Blue** ($27.99)
   - Colors: Electric Blue, Charcoal, Red
   - Stock: Yes

3. **MT Limited Edition Cap** ($34.99)
   - Colors: Premium Black only
   - Stock: Yes (500 units)

**T-Shirts Collection:**

1. **MT Classic T-Shirt - White** ($22.99)
   - Colors: White, Black, Navy
   - Sizes: XS-3XL
   - Stock: Yes

2. **MT Tech T-Shirt - Black** ($26.99)
   - Colors: Black, Dark Gray, Charcoal
   - Sizes: XS-3XL
   - Stock: Yes

3. **AI-Powered T-Shirt** ($29.99)
   - Colors: Black, Navy, Gray
   - Sizes: XS-3XL
   - Stock: Yes

4. **MT Limited Edition T-Shirt** ($39.99)
   - Colors: Premium Black only
   - Sizes: XS-3XL
   - Stock: Yes (200 units)

### Adding New Products

Edit `src/components/MerchandiseSection.tsx`:

```tsx
const products: MerchandiseProduct[] = [
  // ... existing products ...
  {
    id: 'product-unique-id',
    name: 'Product Name',
    category: 'caps' | 'tshirts',
    description: 'Product description',
    price: 29.99,
    image: 'https://your-image-url.jpg',
    colors: ['Color1', 'Color2'],
    sizes: ['S', 'M', 'L'], // for tshirts, omit for caps
    inStock: true,
    badge: 'NEW', // optional: 'NEW', 'BESTSELLER', 'EXCLUSIVE'
  },
];
```

### Updating Prices

Simply change the `price` field in the products array. Prices automatically display in cart and checkout.

### Managing Stock

Update the `inStock` property:

```tsx
{
  id: 'cap-classic-black',
  // ...
  inStock: true, // Set to false to hide product
}
```

### Adding Product Images

1. Upload your product image to an image hosting service (Cloudinary, AWS S3, Vercel Blob, etc.)
2. Get the image URL
3. Update the `image` field:

```tsx
{
  id: 'cap-classic-black',
  image: 'https://cdn.example.com/cap-black.jpg',
  // ...
}
```

**Image Requirements:**

- Format: JPEG, PNG, WebP
- Size: 400×300px (landscape) recommended
- Quality: High resolution (72 DPI for web)
- Max file size: 1MB

---

## 🎨 Customization

### Change Store Colors

Update colors in `MerchandiseSection.tsx`:

```tsx
// Change from blue/purple to your brand colors
className = 'bg-gradient-to-r from-blue-600 to-purple-600';
// to
className = 'bg-gradient-to-r from-cyan-600 to-blue-600';
```

### Change Store Name

Update in `StorePage.tsx`:

```tsx
<h1 className="text-2xl font-bold ...">MT Store {/* Change this */}</h1>
```

### Customize Cart Behavior

**Free Shipping Threshold**: Edit `MerchandiseCart.tsx`:

```tsx
const shipping = subtotal > 50 ? 0 : 9.99; // Change 50 to your threshold
```

**Tax Rate**: Edit `MerchandiseCart.tsx`:

```tsx
const tax = subtotal * 0.08; // Change 0.08 to your tax rate
```

### Customize Checkout Flow

The checkout is in `MerchandiseCheckout.tsx`. You can:

- Add/remove form fields
- Change validation rules
- Modify the success message
- Add coupon code functionality

---

## 🚀 Going Live

### Checklist

- [ ] Create Stripe Live account and verify identity
- [ ] Get Live API keys from Stripe dashboard
- [ ] Update `.env.production` with live keys
- [ ] Add HTTPS certificate to your domain
- [ ] Test payment flow with live Stripe mode
- [ ] Set up email notifications (SendGrid)
- [ ] Create order tracking system (optional)
- [ ] Set up Stripe webhook for order fulfillment
- [ ] Create customer support email
- [ ] Test with real card on live site
- [ ] Monitor Stripe dashboard for transactions

### Production Environment Variables

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
VITE_APP_URL=https://yourdomain.com
SENDGRID_API_KEY=SG.XXXXX
SENDGRID_FROM_EMAIL=orders@yourdomain.com
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add production environment variables in Vercel dashboard
4. Deploy

```bash
git add .
git commit -m "Add merchandise store with Stripe integration"
git push origin main
```

---

## 💬 FAQ

### Q: How do I handle order fulfillment?

**A:** Set up a Stripe webhook to trigger order fulfillment:

```tsx
// In your backend
export async function handleStripeWebhook(event) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Send email confirmation
    // Update inventory
    // Create shipping order
    // Store order in database
  }
}
```

### Q: How do I collect customer addresses?

**A:** The checkout form already collects:

- Email
- Full name
- Street address
- City, state, ZIP
- Country

The data is stored in Stripe session metadata.

### Q: Can I accept other payment methods?

**A:** Yes! Update `MerchandiseCheckout.tsx`:

```tsx
payment_method_types: ['card', 'apple_pay', 'google_pay', 'alipay'],
```

### Q: How do I track inventory?

**A:** For simple tracking, add a database table:

```sql
CREATE TABLE merchandise_inventory (
  id UUID PRIMARY KEY,
  product_id VARCHAR(255),
  quantity_available INT,
  quantity_sold INT,
  last_updated TIMESTAMP
);
```

### Q: Can I send order confirmation emails?

**A:** Yes! Use SendGrid in your webhook:

```tsx
import { sendMerchandiseOrderEmail } from '@/lib/email';

const event = stripe.webhooks.constructEvent(...);
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  await sendMerchandiseOrderEmail(session.customer_email, session);
}
```

### Q: How do I handle refunds?

**A:** Refunds are processed through Stripe dashboard:

1. Go to **Payments** → **Charges**
2. Find the charge
3. Click **Refund**
4. Specify refund amount
5. Confirm

You can also create a refund endpoint in your API.

### Q: What about shipping rates?

**A:** Currently, shipping is fixed ($9.99) or free over $50. To implement variable shipping:

```tsx
const calculateShipping = (items, zipCode) => {
  // Call shipping API
  const rate = await getShippingRate(zipCode, weight);
  return rate;
};
```

### Q: How do I prevent fraud?

**A:** Stripe includes built-in fraud protection. Additionally:

- Enable 3D Secure authentication
- Monitor chargeback ratios
- Use Stripe Radar for fraud detection
- Require address verification

### Q: Can I add size/color selection?

**A:** Yes! The UI has placeholder elements:

```tsx
{
  product.colors && (
    <div className="mb-4">
      <p className="text-xs font-semibold">COLORS</p>
      {product.colors.map((color) => (
        <button onClick={() => setSelectedColor(color)}>{color}</button>
      ))}
    </div>
  );
}
```

Extend this to actually track selections in the cart.

### Q: How do I add discount codes?

**A:** Add a coupon field to checkout and apply in Stripe:

```tsx
const couponCode = 'SAVE10'; // 10% off
const discountCode = await stripe.coupons.retrieve(couponCode);
```

### Q: What's the Stripe fee?

**A:** Standard rates:

- **Online payments**: 2.9% + $0.30 per transaction
- **ACH transfers**: 0.8% (max $5)
- **International cards**: 3.9% + $0.30

_Fees are deducted automatically from your Stripe account._

---

## 📞 Support & Next Steps

### You Now Have:

✅ Complete merchandise store with 6 products
✅ Shopping cart with quantity controls
✅ Two-stage checkout (shipping + payment)
✅ Stripe integration (test & live modes)
✅ Order summary & confirmation
✅ Responsive design (mobile-friendly)
✅ Dark mode support

### Next Steps:

1. **Upload Product Images**
   - Create professional product photos
   - Upload to image hosting service
   - Update image URLs in `MerchandiseSection.tsx`

2. **Configure Stripe**
   - Get test API keys
   - Add to `.env.local`
   - Test with 4242 4242 4242 4242

3. **Customize Products**
   - Update product names, descriptions, prices
   - Add your brand colors
   - Update store name

4. **Set Up Fulfillment**
   - Decide on fulfillment method (print-on-demand, inventory, dropship)
   - Integrate with inventory/shipping system
   - Set up order notifications

5. **Go Live**
   - Get live Stripe keys
   - Deploy to production
   - Switch to live mode
   - Launch to audience

---

## 🔗 Useful Links

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [React Stripe Library](https://github.com/stripe/stripe-js)
- [Print-on-Demand Services](https://printful.com, https://teespring.com)
- [Image Hosting](https://cloudinary.com, https://vercel.com/storage/blob)

---

**Ready to launch your merchandise store?** 🚀

Start with Step 1 of "Quick Start" above. You'll have a working store in 5 minutes!

Questions? Check the FAQ or contact Maycole Technologies support.
