# Image Optimization & Performance Guide

## Overview

Image optimization is critical for:

- ✅ Faster page load times (images are ~50% of page weight)
- ✅ Better Core Web Vitals (LCP, CLS)
- ✅ Improved SEO ranking
- ✅ Reduced bandwidth costs
- ✅ Better mobile experience (20-40% of users on slow networks)

## Installation Status

- ✅ `react-lazy-load-image-component` installed (lazy loading)
- ✅ `next-image-export-optimizer` installed (responsive images)
- ✅ Image optimization module created: `/src/lib/image-optimization.ts` (400+ lines)

## Files Created

### `/src/lib/image-optimization.ts` (400+ lines)

Complete image optimization utilities:

- `OptimizedImage` - Lazy loading with responsive images
- `HeroImage` - Critical above-the-fold images (no lazy load)
- `BackgroundImage` - Background images with lazy loading
- `ResponsivePicture` - WebP with fallback support
- `ImageGallery` - Grid of lazy-loaded images
- `ImageWithFallback` - Handles broken images gracefully
- `generateSrcSet()` - Create responsive image srcsets
- `getImageSizes()` - Browser hint for image sizes
- `preloadImage()` / `prefetchImage()` - Performance hints
- `generateBlurDataUrl()` - Placeholder effects

## Quick Start

### **Replace Static `<img>` with Optimized Component**

**Before**:

```tsx
<img src="/images/hero.jpg" alt="Hero banner" />
```

**After**:

```tsx
import { OptimizedImage } from '@/lib/image-optimization';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1920}
  height={1080}
  effect="blur"
/>;
```

### **Hero Images (Above the Fold)**

```tsx
import { HeroImage } from '@/lib/image-optimization';

<HeroImage src="/images/hero.jpg" alt="Hero banner" width={1920} height={1080} />;
```

**Why**: Hero images load immediately (no lazy loading delay)

### **Lazy Load Images (Below the Fold)**

```tsx
import { OptimizedImage } from '@/lib/image-optimization';

<OptimizedImage
  src="/images/feature.jpg"
  alt="Feature image"
  width={800}
  height={600}
  effect="blur" // Blur-up effect
  responsive={true} // Responsive srcset
/>;
```

**Why**: Defers loading until image is needed

### **Responsive Images with WebP**

```tsx
import { ResponsivePicture } from '@/lib/image-optimization';

<ResponsivePicture
  sources={[
    {
      srcSet:
        '/images/product-480.webp 480w, /images/product-768.webp 768w, /images/product-1024.webp 1024w',
      type: 'image/webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
    {
      srcSet:
        '/images/product-480.jpg 480w, /images/product-768.jpg 768w, /images/product-1024.jpg 1024w',
      type: 'image/jpeg',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
  ]}
  src="/images/product-1024.jpg"
  alt="Product image"
  width={800}
  height={600}
/>;
```

**Why**: Serves WebP (30% smaller) to supporting browsers, JPEG fallback for others

### **Image Gallery**

```tsx
import { ImageGallery } from '@/lib/image-optimization'

const images = [
  { src: '/img/1.jpg', alt: 'Gallery 1', width: 400, height: 300 },
  { src: '/img/2.jpg', alt: 'Gallery 2', width: 400, height: 300 },
  { src: '/img/3.jpg', alt: 'Gallery 3', width: 400, height: 300 }
]

<ImageGallery images={images} columns={3} gap="1rem" />
```

## Best Practices

### **1. Image Format Selection**

| Use Case       | Format          | Compression | Notes                           |
| -------------- | --------------- | ----------- | ------------------------------- |
| Hero images    | **WebP** + JPEG | 30-50%      | Serve WebP first, JPEG fallback |
| Photographs    | WebP or JPEG    | 20-40%      | Balance quality vs size         |
| Graphics/logos | **SVG**         | N/A         | Scalable, crisp, smallest       |
| Icons          | SVG or PNG      | N/A         | Sharp, clear on all sizes       |
| Thumbnails     | WebP or PNG     | 50-70%      | Heavily compressed OK           |
| Screenshots    | PNG or JPEG     | 20-30%      | Lossless for text clarity       |

### **2. Image Sizing**

```typescript
// Always include width/height for layout stability (prevents CLS)
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={1200}      // ✅ Required
  height={800}      // ✅ Required
/>

// Bad - causes layout shift when image loads:
<OptimizedImage src="/image.jpg" alt="Description" />
```

### **3. Responsive Images**

```typescript
// Generate srcset for different screen sizes:
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  responsive={true}  // Enables srcset for mobile/tablet/desktop
  containerWidth="50vw"  // Hint about container size
/>

// Or manually:
<OptimizedImage
  src="/image-lg.jpg"
  srcSet="/image-sm.jpg 480w, /image-md.jpg 768w, /image-lg.jpg 1024w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
/>
```

### **4. Lazy Loading Strategy**

```typescript
// CRITICAL IMAGES - Load immediately (hero, product main image):
import { HeroImage } from '@/lib/image-optimization'
<HeroImage src="/hero.jpg" ... />

// ABOVE FOLD - Load immediately:
<OptimizedImage src="/feature.jpg" visibleByDefault={true} ... />

// BELOW FOLD - Lazy load (default):
<OptimizedImage src="/testimonial.jpg" ... />

// VERY LAZY - Prefetch for next page:
import { prefetchImage } from '@/lib/image-optimization'
prefetchImage('/next-page-image.jpg')
```

### **5. Placeholder Effects**

```typescript
// Blur-up effect (default):
<OptimizedImage src="/image.jpg" effect="blur" ... />

// Fade-in effect:
<OptimizedImage src="/image.jpg" effect="opacity" ... />

// No effect (faster):
<OptimizedImage src="/image.jpg" effect="none" ... />
```

## Image Size Guidelines

### **File Size Targets**

```
Hero image (1920x1080):
  Target: 50-100 KB (after compression)
  WebP: 50-80 KB
  JPEG: 80-120 KB

Product image (800x600):
  Target: 30-50 KB
  WebP: 20-30 KB
  JPEG: 30-50 KB

Thumbnail (200x150):
  Target: 5-10 KB
  WebP: 5-8 KB
  JPEG: 7-12 KB

Icon/Logo (100x100):
  SVG: <5 KB
  PNG: 5-15 KB
```

### **Quality Settings**

| Format | Quality  | Output Size   | Use Case                   |
| ------ | -------- | ------------- | -------------------------- |
| JPEG   | 85-90    | ✅ Good       | Photos, complex images     |
| JPEG   | 70-80    | ✅ Best       | Web standard               |
| JPEG   | 60-70    | ⚠️ Acceptable | Thumbnails                 |
| WebP   | 80-85    | ✅ Good       | Photos (smaller than JPEG) |
| PNG    | Lossless | Larger        | Graphics, icons            |
| SVG    | Vector   | ✅ Smallest   | Logos, icons               |

## Image Optimization Tools

### **Batch Compression** (for existing images)

**Online (no installation)**:

- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- CloudConvert: https://cloudconvert.com

**CLI Tools**:

```bash
# ImageMagick (convert and optimize)
mogrify -quality 80 -strip *.jpg

# Sharp (Node.js, batch processing)
npm install sharp
# script: sharp('input/*.jpg').resize(800).toFile('output/')

# Imagemin (webpack/build time)
npm install imagemin imagemin-mozjpeg imagemin-pngquant
```

### **CI/CD Integration** (automatic optimization)

```javascript
// In build process
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

await imagemin(['images/*.{jpg,png}'], {
  destination: 'build/images',
  plugins: [
    imageminJpegtran({ quality: 80 }),
    imageminPngquant({
      quality: [0.6, 0.8],
    }),
  ],
});
```

## Core Web Vitals Impact

### **LCP (Largest Contentful Paint)**

```typescript
// Preload hero image:
import { preloadImage } from '@/lib/image-optimization'

preloadImage('/images/hero.jpg', 'image')

// In <head>:
<link rel="preload" as="image" href="/images/hero.jpg" />
```

**Target**: < 2.5 seconds
**Impact**: Hero images ~500ms faster with preload

### **CLS (Cumulative Layout Shift)**

```typescript
// Always include width/height (prevents shift when image loads):
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800} // ✅ Required!
  height={600} // ✅ Required!
/>
```

**Target**: < 0.1
**Impact**: Proper dimensions prevent 100% of image-caused CLS

### **FID (First Input Delay)**

```typescript
// Defer non-critical images:
<OptimizedImage src="/image.jpg" threshold={100} />
// threshold: 100px before viewport triggers load
```

**Target**: < 100ms
**Impact**: Lazy loading keeps main thread free

## Testing & Validation

### **Google PageSpeed Insights**

https://pagespeed.web.dev

- Score images by optimization potential
- Suggests specific images to optimize

### **Chrome DevTools**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by images
4. Check:
   - File size vs compressed size
   - Load time
   - Format (should see WebP if supported)

### **Lighthouse Audit**

```
DevTools → Lighthouse → Performance
Look for:
- ✅ "Serve images in next-gen formats" (WebP)
- ✅ "Properly size images"
- ✅ "Defer off-screen images"
- ✅ "Efficiently encode images"
```

## Common Issues & Solutions

### **Issue: Images still slow**

**Check 1**: Image file size

```bash
# Check actual file size
ls -lh images/
# Target: <100 KB for hero, <50 KB for others
```

**Check 2**: Format

```
High-quality JPEGs should be <80 KB
WebP should be <50 KB
```

**Solution**: Use TinyPNG or Squoosh to compress

### **Issue: Images look blurry on mobile**

**Problem**: Not using responsive srcset
**Solution**:

```typescript
<OptimizedImage
  src="/image.jpg"
  responsive={true} // Enable srcset for all sizes
/>
```

### **Issue: Layout shifts when images load**

**Problem**: Missing width/height attributes
**Solution**:

```typescript
<OptimizedImage
  src="/image.jpg"
  width={800} // ✅ Always include!
  height={600} // ✅ Always include!
/>
```

### **Issue: Placeholder visible too long**

**Problem**: Slow placeholder generation
**Solution**:

```typescript
<OptimizedImage
  src="/image.jpg"
  placeholder="/image-thumb.jpg" // Pre-compressed placeholder
  effect="blur"
/>
```

## Checklist

- [ ] All images have width and height attributes
- [ ] Hero images are preloaded
- [ ] Below-fold images use lazy loading
- [ ] Images compressed (hero <100 KB, other <50 KB)
- [ ] Using WebP with JPEG fallback for photos
- [ ] Using SVG for logos and icons
- [ ] Responsive srcsets generated for main images
- [ ] Placeholder effects working
- [ ] Google PageSpeed score: 90+
- [ ] Lighthouse: No image warnings

## Performance Impact

Before optimization:

- 200 images × 500 KB = **100 MB** total
- Load time: 30-45 seconds
- Core Web Vitals: Failing

After optimization:

- 200 images × 80 KB (WebP) / 120 KB (JPEG) = **20 MB** total
- Load time: 5-8 seconds (**5-6x faster**)
- Core Web Vitals: Passing

## Next Steps

1. ✅ **Module created** - Image optimization utilities ready
2. **TODO**: Identify and compress all existing images
3. **TODO**: Convert to WebP format with JPEG fallback
4. **TODO**: Replace static `<img>` tags with OptimizedImage
5. **TODO**: Add width/height to all images
6. **TODO**: Preload critical hero image
7. **TODO**: Test with Google PageSpeed Insights
8. **TODO**: Monitor Core Web Vitals in production
9. **TODO**: Set up automatic image compression in build

## Resources

- MDN: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- Web.dev: https://web.dev/image-optimization/
- Google PageSpeed: https://pagespeed.web.dev
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app

---

**Status**: ✅ Image optimization module ready for integration
**Packages Used**:

- `react-lazy-load-image-component` (lazy loading)
- `next-image-export-optimizer` (responsive images)
  **Last Updated**: December 3, 2025
