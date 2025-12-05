/**
 * Compression & Optimization Strategy
 * Implements best practices for image compression, asset optimization, and caching
 */

// ============================================================================
// Image Compression Strategy
// ============================================================================

export interface CompressionConfig {
  quality: number; // 0-100, recommended: 75-85 for JPEG, 80 for WebP
  format: 'webp' | 'jpeg' | 'png' | 'avif';
  maxWidth?: number;
  maxHeight?: number;
  stripMetadata?: boolean;
}

export interface ImageCompressionGuide {
  format: string;
  extension: string;
  bestFor: string;
  quality: string;
  maxSize: string;
  tool: string;
  example: string;
}

/**
 * Recommended compression settings for different image types
 */
export const COMPRESSION_GUIDELINES: Record<string, CompressionConfig> = {
  // Hero images: large, high quality
  hero: {
    quality: 80,
    format: 'webp',
    stripMetadata: true,
  },
  // Product images: medium size, good quality
  product: {
    quality: 75,
    format: 'webp',
    maxWidth: 800,
    stripMetadata: true,
  },
  // Thumbnails: small, optimized
  thumbnail: {
    quality: 70,
    format: 'webp',
    maxWidth: 400,
    stripMetadata: true,
  },
  // Icons: lossless, SVG preferred
  icon: {
    quality: 100,
    format: 'png',
    maxWidth: 128,
  },
  // Background images: high quality due to visibility
  background: {
    quality: 80,
    format: 'webp',
    stripMetadata: true,
  },
};

/**
 * Compression guide for different formats
 */
export const COMPRESSION_GUIDE: ImageCompressionGuide[] = [
  {
    format: 'WebP',
    extension: '.webp',
    bestFor: 'Photos, hero images, product images (all formats)',
    quality: '75-85 (or -q 75)',
    maxSize: '<100KB for hero, <50KB for product',
    tool: 'cwebp, imagemin-webp, Squoosh',
    example: 'cwebp -q 75 input.jpg -o output.webp && cwebp -q 80 input.png -o output.webp',
  },
  {
    format: 'JPEG',
    extension: '.jpg',
    bestFor: 'Photographs, complex images (fallback for WebP)',
    quality: '75-85 (or quality: 75)',
    maxSize: '<100KB for hero, <50KB for product',
    tool: 'mozjpeg, imagemin-mozjpeg, TinyJPG',
    example: 'imagemin input.jpg --plugin=mozjpeg --plugin=pngquant > output.jpg',
  },
  {
    format: 'PNG',
    extension: '.png',
    bestFor: 'Logos, icons, images needing transparency',
    quality: '80 (pngquant)',
    maxSize: '<50KB for most uses',
    tool: 'pngquant, optipng, TinyPNG',
    example: 'pngquant 256 --ext .png --force input.png',
  },
  {
    format: 'SVG',
    extension: '.svg',
    bestFor: 'Icons, logos, vector graphics',
    quality: 'N/A (lossless)',
    maxSize: '<10KB',
    tool: 'svgo, SVGOMG',
    example: 'svgo input.svg -o output.svg',
  },
  {
    format: 'AVIF',
    extension: '.avif',
    bestFor: 'Next-gen format, best compression (limited browser support)',
    quality: '55-65',
    maxSize: '<50KB',
    tool: 'cavif, imagemin-avif',
    example: 'cavif input.jpg output.avif',
  },
];

/**
 * Get recommended compression command for a file
 */
export function getCompressionCommand(
  filename: string,
  type: 'hero' | 'product' | 'thumbnail' | 'icon' | 'background' = 'product'
): string {
  const config = COMPRESSION_GUIDELINES[type];
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';

  let command = '';

  if (config.format === 'webp') {
    command = `cwebp -q ${config.quality} ${filename} -o ${filename.replace(`.${ext}`, '.webp')}`;
  } else if (config.format === 'jpeg') {
    command = `imagemin ${filename} --plugin=mozjpeg --plugin=pngquant > ${filename.replace(`.${ext}`, '.jpg')}`;
  } else if (config.format === 'png') {
    command = `pngquant 256 --ext .png --force ${filename}`;
  } else if (config.format === 'avif') {
    command = `cavif ${filename} ${filename.replace(`.${ext}`, '.avif')}`;
  }

  return command;
}

/**
 * Batch compression script generator
 */
export function generateBatchCompressionScript(
  imageDirectory: string = './src/assets/images'
): string {
  return `#!/bin/bash

# Performance Compression Script
# Automatically compresses all images using recommended settings
# Install: brew install imagemagick webp cwebp

echo "🖼️  Starting image compression..."
echo "Directory: ${imageDirectory}"

# WebP compression (hero images)
echo "📦 Compressing hero images to WebP..."
find ${imageDirectory}/hero -type f \\( -name "*.jpg" -o -name "*.png" \\) 2>/dev/null | while read img; do
  output="\${img%.*}.webp"
  cwebp -q 80 "\$img" -o "\$output"
  echo "✅ \$img → \$output"
done

# WebP compression (product images)
echo "📦 Compressing product images to WebP..."
find ${imageDirectory}/products -type f \\( -name "*.jpg" -o -name "*.png" \\) 2>/dev/null | while read img; do
  output="\${img%.*}.webp"
  cwebp -q 75 "\$img" -o "\$output"
  echo "✅ \$img → \$output"
done

# JPEG compression (fallback)
echo "📦 Compressing images to JPEG (fallback)..."
find ${imageDirectory} -type f -name "*.jpg" 2>/dev/null | while read img; do
  convert "\$img" -quality 75 -strip "\$img"
  echo "✅ Optimized \$img"
done

# PNG optimization
echo "📦 Optimizing PNG files..."
find ${imageDirectory} -type f -name "*.png" 2>/dev/null | while read img; do
  pngquant 256 --ext .png --force "\$img" 2>/dev/null || true
  echo "✅ Optimized \$img"
done

# SVG optimization
echo "📦 Optimizing SVG files..."
find ${imageDirectory} -type f -name "*.svg" 2>/dev/null | while read img; do
  svgo "\$img" -o "\$img"
  echo "✅ Optimized \$img"
done

echo ""
echo "✅ Compression complete!"
echo "📊 Results:"
du -sh ${imageDirectory}
echo ""
echo "💡 Next steps:"
echo "1. Review compressed images for quality"
echo "2. Update <img> tags to use WebP with JPEG fallback"
echo "3. Add loading='lazy' to above-fold images"
echo "4. Test with Google PageSpeed Insights"
`;
}

// ============================================================================
// Asset Optimization Checklist
// ============================================================================

export interface AssetOptimizationItem {
  category: string;
  item: string;
  status: 'completed' | 'pending' | 'failed';
  impact: 'critical' | 'major' | 'minor';
  tool: string;
}

export const ASSET_OPTIMIZATION_CHECKLIST: AssetOptimizationItem[] = [
  // Images
  {
    category: 'Images',
    item: 'Convert all images to WebP format',
    status: 'pending',
    impact: 'critical',
    tool: 'cwebp, imagemin-webp',
  },
  {
    category: 'Images',
    item: 'Compress JPEG fallbacks (quality 75-85)',
    status: 'pending',
    impact: 'critical',
    tool: 'mozjpeg, TinyJPG',
  },
  {
    category: 'Images',
    item: 'Optimize PNG files (reduce colors)',
    status: 'pending',
    impact: 'major',
    tool: 'pngquant, optipng',
  },
  {
    category: 'Images',
    item: 'Optimize SVG files (remove metadata)',
    status: 'pending',
    impact: 'minor',
    tool: 'svgo, SVGOMG',
  },
  {
    category: 'Images',
    item: 'Add loading="lazy" to below-fold images',
    status: 'pending',
    impact: 'major',
    tool: 'React component update',
  },
  {
    category: 'Images',
    item: 'Generate responsive srcsets (3-5 sizes)',
    status: 'pending',
    impact: 'major',
    tool: 'image-optimization.ts',
  },
  {
    category: 'Images',
    item: 'Add width/height attributes to all images',
    status: 'pending',
    impact: 'major',
    tool: 'React component update',
  },
  {
    category: 'Images',
    item: 'Preload hero images',
    status: 'pending',
    impact: 'critical',
    tool: 'Link rel="preload"',
  },

  // Fonts
  {
    category: 'Fonts',
    item: 'Convert to WOFF2 format',
    status: 'pending',
    impact: 'major',
    tool: 'fonttools, fontsquirrel',
  },
  {
    category: 'Fonts',
    item: 'Subset fonts (only used characters)',
    status: 'pending',
    impact: 'major',
    tool: 'fonttools, glyphhanger',
  },
  {
    category: 'Fonts',
    item: 'Add font-display: swap',
    status: 'pending',
    impact: 'major',
    tool: '@font-face CSS update',
  },
  {
    category: 'Fonts',
    item: 'Preload critical fonts',
    status: 'pending',
    impact: 'major',
    tool: 'Link rel="preload"',
  },

  // CSS
  {
    category: 'CSS',
    item: 'Remove unused CSS (PurgeCSS/Tailwind)',
    status: 'pending',
    impact: 'major',
    tool: 'Tailwind CSS (built-in)',
  },
  {
    category: 'CSS',
    item: 'Minify CSS in production',
    status: 'pending',
    impact: 'minor',
    tool: 'Vite (built-in)',
  },
  {
    category: 'CSS',
    item: 'Inline critical CSS',
    status: 'pending',
    impact: 'critical',
    tool: 'critical-css, penthouse',
  },
  {
    category: 'CSS',
    item: 'Defer non-critical CSS',
    status: 'pending',
    impact: 'major',
    tool: 'loadCSS',
  },

  // JavaScript
  {
    category: 'JavaScript',
    item: 'Enable code splitting',
    status: 'completed',
    impact: 'critical',
    tool: 'Vite config',
  },
  {
    category: 'JavaScript',
    item: 'Tree-shake unused code',
    status: 'completed',
    impact: 'major',
    tool: 'Vite + Rollup',
  },
  {
    category: 'JavaScript',
    item: 'Minify JavaScript',
    status: 'completed',
    impact: 'major',
    tool: 'Vite (terser)',
  },
  {
    category: 'JavaScript',
    item: 'Remove console.log in production',
    status: 'completed',
    impact: 'minor',
    tool: 'Vite terser config',
  },
  {
    category: 'JavaScript',
    item: 'Lazy load route components',
    status: 'pending',
    impact: 'major',
    tool: 'React.lazy + Suspense',
  },
  {
    category: 'JavaScript',
    item: 'Defer non-critical JavaScript',
    status: 'pending',
    impact: 'major',
    tool: 'defer/async script tags',
  },

  // Caching
  {
    category: 'Caching',
    item: 'Enable Service Worker caching',
    status: 'pending',
    impact: 'critical',
    tool: 'Service Worker',
  },
  {
    category: 'Caching',
    item: 'Set long expiration for static assets',
    status: 'pending',
    impact: 'major',
    tool: 'Cache-Control headers',
  },
  {
    category: 'Caching',
    item: 'Enable gzip/brotli compression',
    status: 'pending',
    impact: 'major',
    tool: 'Server configuration',
  },

  // Monitoring
  {
    category: 'Monitoring',
    item: 'Monitor Core Web Vitals',
    status: 'completed',
    impact: 'critical',
    tool: 'performance-optimizer.ts',
  },
  {
    category: 'Monitoring',
    item: 'Setup Sentry performance monitoring',
    status: 'completed',
    impact: 'major',
    tool: 'sentry.ts',
  },
  {
    category: 'Monitoring',
    item: 'Monitor bundle size with CI/CD',
    status: 'pending',
    impact: 'major',
    tool: 'bundlesize, size-limit',
  },
];

// ============================================================================
// Quick Start Compression Guide
// ============================================================================

export function getQuickStartGuide(): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║         QUICK START: IMAGE COMPRESSION GUIDE                   ║
╚════════════════════════════════════════════════════════════════╝

🎯 TARGET: Reduce bundle size to <400KB gzipped

📦 INSTALLATION:
   # macOS (Homebrew)
   brew install webp imagemagick optipng pngquant svgo

   # Ubuntu/Debian
   sudo apt-get install webp imagemagick optipng pngquant svgo

   # Windows (Chocolatey)
   choco install webp imagemagick optipng pngquant svgo

   # Or use Node tools:
   npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant imagemin-webp svgo

🖼️  COMPRESSION COMMANDS:

   1. Convert to WebP (Best compression):
      cwebp -q 75 input.jpg -o output.webp
      cwebp -q 80 input.png -o output.webp

   2. Optimize JPEG (Fallback):
      imagemin input.jpg --plugin=mozjpeg > output.jpg

   3. Optimize PNG:
      pngquant 256 --ext .png --force input.png

   4. Optimize SVG:
      svgo input.svg -o output.svg

   5. Batch compress (all JPEG to WebP):
      for img in *.jpg; do cwebp -q 75 "$img" -o "\${img%.*}.webp"; done

📊 SIZE TARGETS:
   Hero Image:     < 100 KB (WebP) / < 150 KB (JPEG)
   Product Image:  < 50 KB (WebP) / < 75 KB (JPEG)
   Thumbnail:      < 25 KB (WebP) / < 40 KB (JPEG)
   Icon:           < 5 KB (PNG/SVG)
   Background:     < 100 KB (WebP)

✅ CHECKLIST:
   ☐ Install compression tools
   ☐ Compress all images to WebP format
   ☐ Create JPEG/PNG fallbacks
   ☐ Update <img> tags to use responsive srcsets
   ☐ Add loading="lazy" attribute
   ☐ Add width/height attributes
   ☐ Preload hero images
   ☐ Test with PageSpeed Insights
   ☐ Deploy and monitor Sentry

🚀 EXPECTED RESULTS:
   • Bundle size: -40-50% reduction
   • LCP: -30-40% improvement
   • FID: -20-30% improvement
   • CLS: Stable (no impact)
   • SEO: Significant ranking boost

📈 MONITORING:
   Google PageSpeed Insights: https://pagespeed.web.dev
   Sentry Performance: https://sentry.io/performance/
   Search Console: https://search.google.com/search-console

💡 TOOLS:
   Online: Squoosh, TinyPNG, TinyJPG
   Desktop: ImageMagick, Photoshop, GIMP
   VS Code: WebP Converter extension
   CLI: cwebp, imagemin, pngquant, svgo
`;
}

// ============================================================================
// Performance Metrics for Compression
// ============================================================================

export interface CompressionMetrics {
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  format: string;
  quality: number;
  tool: string;
}

/**
 * Calculate compression metrics
 */
export function calculateCompressionMetrics(
  originalSize: number,
  compressedSize: number,
  format: string,
  quality: number,
  tool: string
): CompressionMetrics {
  const reductionPercent = ((originalSize - compressedSize) / originalSize) * 100;

  return {
    originalSize,
    compressedSize,
    reductionPercent,
    format,
    quality,
    tool,
  };
}

/**
 * Format compression metrics for display
 */
export function formatCompressionMetrics(metrics: CompressionMetrics): string {
  return `
📊 Compression Results:
   Original:    ${(metrics.originalSize / 1024).toFixed(2)} KB
   Compressed:  ${(metrics.compressedSize / 1024).toFixed(2)} KB
   Reduction:   ${metrics.reductionPercent.toFixed(1)}%
   Format:      ${metrics.format} (quality: ${metrics.quality})
   Tool:        ${metrics.tool}
`;
}
