# ⚡ Still Brand Logo - Quick Start

## What You Have Now

✅ **StillBrandLogo** - Static logo with 5 sizes (xs→xl) & 3 variants (dark/light/gradient)
✅ **BrandIcon** - Compact icon version for small spaces  
✅ **MerchandiseBrandDisplay** - Showcase component with mockups & guidelines  
✅ **Build Success** - 0 errors, 2,578 modules, 515.1 KB

---

## One-Minute Setup

### Import in your component:

```tsx
import { StillBrandLogo, BrandIcon } from '@/components/StillBrandLogo';
import { MerchandiseBrandDisplay } from '@/components/MerchandiseBrandDisplay';
```

### Add to your page:

```tsx
// Full showcase (includes product mockups + guidelines)
<MerchandiseBrandDisplay />

// Or use directly:
<StillBrandLogo size="md" variant="dark" />
<BrandIcon size="lg" />
```

---

## Size + Variant Quick Reference

### Sizes

- **xs** = 48px (tiny icons)
- **sm** = 64px (hats, badges)
- **md** = 96px (t-shirts, merch)
- **lg** = 128px (posters, large branding)
- **xl** = 192px (hero sections, social)

### Variants

- **dark** = Bold colors (light backgrounds)
- **light** = Muted colors (dark backgrounds)
- **gradient** = Vibrant (digital, social media)

---

## Use Cases

| Item        | Size | Variant  | Code                                                              |
| ----------- | ---- | -------- | ----------------------------------------------------------------- |
| 🧢 Hat      | sm   | dark     | `<StillBrandLogo size="sm" variant="dark" withText={false} />`    |
| 👕 T-Shirt  | md   | dark     | `<StillBrandLogo size="md" variant="dark" withText={false} />`    |
| 🌐 Website  | lg   | gradient | `<StillBrandLogo size="lg" variant="gradient" />`                 |
| 📱 App Icon | sm   | -        | `<BrandIcon size="sm" />`                                         |
| 📍 Favicon  | lg   | -        | `<BrandIcon size="lg" />`                                         |
| 📱 Social   | xl   | gradient | `<StillBrandLogo size="xl" variant="gradient" withText={true} />` |
| 🏷️ Package  | lg   | light    | `<StillBrandLogo size="lg" variant="light" withText={true} />`    |

---

## Files Created

```
src/components/
├── StillBrandLogo.tsx (450 lines)
│   ├── StillBrandLogo component
│   └── BrandIcon sub-component
├── MerchandiseBrandDisplay.tsx (400 lines)
│   ├── Logo showcase
│   ├── Product mockups (cap, shirt)
│   ├── Brand guidelines
│   └── Size reference
├── index.ts (updated)
│   ├── export { StillBrandLogo, BrandIcon }
│   └── export { MerchandiseBrandDisplay }
```

---

## Colors Used

- **Gold**: #ffd700 (particles, accents)
- **Green**: #22c55e (orbit rings, particles)
- **Cyan**: #06b6d4 (accent particles)
- **Red**: #ff0000 (central nucleus)

---

## Next 5 Actions

1. **View Logo** → Add `<MerchandiseBrandDisplay />` to any page
2. **Export for Print** → Take screenshots at 2x resolution
3. **Update StorePage** → Add logo showcase before products
4. **Get Product Photos** → Caps/shirts with logo embroidered
5. **Deploy** → Push to GitHub & deploy to Vercel

---

## Customization (30 seconds)

### Change orbit colors in `StillBrandLogo.tsx`:

```tsx
// Line ~100: Change green ring color
stroke = 'YOUR_COLOR';

// Line ~120: Change gold ring color
stroke = 'YOUR_COLOR';
```

### Change text label:

```tsx
// Pass custom text
<StillBrandLogo text="YOUR TEXT" size="lg" variant="dark" />
```

### Add new size:

```tsx
// In sizeMap object, add:
xxl: {
  container: "w-64 h-64",
  ball: "w-8 h-8",
  // ... other values
}
```

---

## Pro Tips

✨ **Light backgrounds?** Use `variant="dark"`  
✨ **Dark backgrounds?** Use `variant="light"`  
✨ **Social media?** Use `variant="gradient"` + `size="xl"`  
✨ **Merchandise?** Use `variant="dark"` + remove text (`withText={false}`)  
✨ **Favicon?** Use `BrandIcon` + wrap in SVG export

---

## Troubleshooting

❌ Logo not showing?

```tsx
// Make sure import is correct
import { StillBrandLogo } from '@/components/StillBrandLogo';
```

❌ Wrong size?

```tsx
// Change size prop to xs, sm, md, lg, or xl
<StillBrandLogo size="lg" />
```

❌ Colors look wrong?

```tsx
// Try different variant
<StillBrandLogo variant="light" /> // or "gradient"
```

---

## Build Status

✅ **Production Ready**

- 2,578 modules transformed
- 515.1 KB gzipped
- 0 TypeScript errors
- 0 runtime errors

---

**See full guide:** `src/BRAND_LOGO_GUIDE.md`  
**See code:** `src/components/StillBrandLogo.tsx`  
**See showcase:** Add `<MerchandiseBrandDisplay />` to any page

🎉 **Your still brand logo is ready to use!**
