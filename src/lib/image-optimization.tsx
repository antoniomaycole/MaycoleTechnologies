/**
 * Image Optimization Utilities
 * Provides lazy loading, responsive images, and performance optimization
 * 
 * Features:
 * - Lazy loading for below-the-fold images
 * - Responsive image sizes (srcset)
 * - WebP format fallback
 * - Image compression
 * - Blur-up placeholder effect
 */

import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/black-and-white.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import React from 'react'

/**
 * Image size breakpoints for responsive images
 */
export const IMAGE_BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  ultrawide: 1920
} as const

/**
 * Generate responsive image srcset string
 * Example: "image-480.jpg 480w, image-768.jpg 768w, image-1024.jpg 1024w"
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [480, 768, 1024, 1440, 1920],
  format: 'jpg' | 'webp' = 'jpg'
): string {
  return sizes
    .map(size => {
      const filename = baseUrl.replace(/(\.\w+)$/, `-${size}.$1`)
      return `${filename} ${size}w`
    })
    .join(', ')
}

/**
 * Get image size hints for srcset sizes attribute
 * Used by browser to select appropriate image size
 */
export function getImageSizes(
  isHero?: boolean,
  containerWidth: string = '100vw'
): string {
  if (isHero) {
    // Hero images: full viewport width on mobile, 90% on desktop
    return '(max-width: 768px) 100vw, 90vw'
  }

  // Default: 100% on mobile, 50% on tablet, 33% on desktop
  return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ' +
    containerWidth
}

/**
 * Optimized image component with lazy loading
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  placeholder?: string
  effect?: 'blur' | 'black-and-white' | 'opacity' | 'none'
  wrapperClassName?: string
  containerWidth?: string
  isHero?: boolean
  responsive?: boolean
  webp?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholder,
  effect = 'blur',
  wrapperClassName = '',
  containerWidth = '100vw',
  isHero = false,
  responsive = true,
  webp = true,
  className = '',
  style = {},
  ...props
}: OptimizedImageProps) {
  // Generate responsive srcset
  const srcSet = responsive ? generateSrcSet(src) : undefined
  const sizes = responsive ? getImageSizes(isHero, containerWidth) : undefined

  // Aspect ratio for maintaining layout stability
  const aspectRatio = width && height ? (height / width) * 100 : undefined
  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio ? `${width} / ${height}` : 'auto',
    overflow: 'hidden'
  }

  return (
    <LazyLoadImage
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      placeholder={placeholder}
      effect={effect === 'none' ? undefined : effect}
      wrapperClassName={`image-wrapper ${wrapperClassName}`}
      wrapperProps={{
        style: containerStyle
      }}
      className={className}
      style={style}
      // Enable native lazy loading as fallback
      loading="lazy"
      // Scroll listeners for better performance
      threshold={100}
      // Skip loading for LCP (Largest Contentful Paint) images
      visibleByDefault={isHero}
      {...props}
    />
  )
}

/**
 * Hero image component - optimized for above-the-fold content
 * Loads immediately without lazy loading
 */
export function HeroImage({
  src,
  alt,
  width = 1920,
  height = 1080,
  ...props
}: Omit<OptimizedImageProps, 'isHero' | 'effect'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      isHero={true}
      effect="none"
      placeholder={`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`}
      {...props}
    />
  )
}

/**
 * Background image component with lazy loading
 */
interface BackgroundImageProps {
  src: string
  alt: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  effect?: 'blur' | 'opacity' | 'none'
  placeholder?: string
}

export function BackgroundImage({
  src,
  alt,
  children,
  className = '',
  style = {},
  effect = 'blur',
  placeholder
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)

  return (
    <div
      className={`bg-image ${className} ${isLoaded ? 'loaded' : ''}`}
      style={{
        backgroundImage: `url('${isLoaded ? src : placeholder || ''}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
      }}
    >
      <LazyLoadComponent
        threshold={100}
        onVisible={() => setIsLoaded(true)}
      >
        {children}
      </LazyLoadComponent>
    </div>
  )
}

/**
 * Picture element for WebP support with fallback
 */
interface ResponsivePictureProps {
  sources: Array<{
    srcSet: string
    type: 'image/webp' | 'image/jpeg' | 'image/png'
    sizes?: string
  }>
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  isHero?: boolean
}

export function ResponsivePicture({
  sources,
  src,
  alt,
  width,
  height,
  className = '',
  isHero = false
}: ResponsivePictureProps) {
  return (
    <picture>
      {sources.map((source, idx) => (
        <source
          key={idx}
          srcSet={source.srcSet}
          type={source.type}
          sizes={source.sizes}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={isHero ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

/**
 * Image gallery with lazy loading
 */
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    thumb?: string
    width?: number
    height?: number
  }>
  columns?: number
  gap?: string
  className?: string
}

export function ImageGallery({
  images,
  columns = 3,
  gap = '1rem',
  className = ''
}: ImageGalleryProps) {
  return (
    <div
      className={`image-gallery ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${100 / columns}%, 1fr))`,
        gap
      }}
    >
      {images.map((image, idx) => (
        <OptimizedImage
          key={idx}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          placeholder={image.thumb}
          effect="blur"
          responsive={true}
        />
      ))}
    </div>
  )
}

/**
 * Image with fallback for broken/missing images
 */
interface ImageWithFallbackProps extends OptimizedImageProps {
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="24"%3EImage not found%3C/text%3E%3C/svg%3E',
  ...props
}: ImageWithFallbackProps) {
  const [, setHasError] = React.useState(false)
  const [currentSrc, setCurrentSrc] = React.useState(src)

  return (
    <OptimizedImage
      {...props}
      src={currentSrc}
      onError={() => {
        setHasError(true)
        setCurrentSrc(fallbackSrc || '')
      }}
    />
  )
}

/**
 * Utility to get optimized image URL
 * Can integrate with image optimization service (e.g., Cloudinary, Imgix)
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    fit?: 'cover' | 'contain' | 'fill'
  }
): string {
  // If using Cloudinary:
  // return `https://res.cloudinary.com/[account]/image/fetch/w_${options?.width},h_${options?.height},q_${options?.quality || 80},f_${options?.format || 'auto'}/` + imageUrl

  // If using Imgix:
  // return `https://[domain].imgix.net/${imageUrl}?w=${options?.width}&q=${options?.quality || 80}&fmt=${options?.format || 'auto'}`

  // For now, return original URL (can be enhanced with service)
  return imageUrl
}

/**
 * Preload critical images for better LCP (Largest Contentful Paint)
 */
export function preloadImage(
  href: string,
  as: 'image' = 'image',
  type?: string
): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = href
    if (type) link.type = type
    document.head.appendChild(link)
  }
}

/**
 * Prefetch images for next page (for next/prev navigation)
 */
export function prefetchImage(href: string): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Generate blur-up placeholder (tiny base64 image)
 */
export function generateBlurDataUrl(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e7eb'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect fill="${color}" width="${width}" height="${height}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Image compression recommendations
 */
export const IMAGE_OPTIMIZATION_TIPS = {
  formats: {
    hero: 'WebP with JPEG fallback',
    thumbnail: 'WebP with PNG fallback',
    icon: 'SVG or PNG',
    logo: 'SVG or PNG'
  },
  maxSizes: {
    hero: '500 KB', // 50-100 KB after optimization
    thumbnail: '50 KB', // 10-20 KB after optimization
    icon: '20 KB', // 2-5 KB after optimization
    logo: '30 KB' // 5-10 KB after optimization
  },
  tools: {
    batch: 'ImageMagick, ImageOptim, TinyPNG',
    online: 'TinyPNG, Squoosh, CloudConvert',
    ci: 'Imagemin (npm), sharp (npm)'
  },
  recommendations: [
    'Always use WebP format with JPEG/PNG fallback',
    'Use srcset for responsive images',
    'Lazy load below-the-fold images',
    'Compress images before uploading',
    'Use SVG for logos and icons',
    'Implement blur-up placeholder effect',
    'Preload critical (LCP) images',
    'Use native <picture> element for art direction'
  ]
}

export default {
  OptimizedImage,
  HeroImage,
  BackgroundImage,
  ResponsivePicture,
  ImageGallery,
  ImageWithFallback,
  generateSrcSet,
  getImageSizes,
  getOptimizedImageUrl,
  preloadImage,
  prefetchImage,
  generateBlurDataUrl,
  IMAGE_BREAKPOINTS,
  IMAGE_OPTIMIZATION_TIPS
}
