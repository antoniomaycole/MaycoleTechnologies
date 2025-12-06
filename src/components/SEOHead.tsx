/**
 * SEO Head Component
 * Manages all meta tags, Open Graph, and structured data using react-helmet-async
 *
 * Usage:
 * import { SEOHead } from '@/components/SEOHead'
 *
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   image="https://..."
 *   schemaMarkup={organizationSchema}
 * />
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateSEOMetadata, DEFAULT_SEO, type SEOPageConfig } from '../lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  twitterHandle?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  schemaMarkup?: Record<string, any>;
  children?: React.ReactNode;
}

/**
 * SEO Head Component
 * Renders all necessary meta tags for SEO
 */
export function SEOHead({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type = 'website',
  twitterHandle = DEFAULT_SEO.twitterHandle,
  canonicalUrl,
  noindex = false,
  schemaMarkup,
  children,
}: SEOHeadProps) {
  const finalTitle = title || DEFAULT_SEO.title;
  const finalDescription = description || DEFAULT_SEO.description;
  const finalKeywords = keywords || DEFAULT_SEO.keywords;
  const finalAuthor = author || DEFAULT_SEO.author;
  const finalImage = image || DEFAULT_SEO.image;
  const finalUrl = url || DEFAULT_SEO.url;
  const finalCanonical = canonicalUrl || finalUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={finalAuthor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Robots */}
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Canonical URL */}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Open Graph (Social Media) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content={DEFAULT_SEO.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Additional Meta Tags */}
      {/* Note: theme-color is supported by most browsers despite linter warning */}
      <meta name="theme-color" content="#1a472a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      {/* Note: apple-touch-icon is placed here as it's the standard location */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://cdn.stripe.com" />
      <link rel="dns-prefetch" href="https://api.maycoletechnologies.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* JSON-LD Structured Data */}
      {schemaMarkup && <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>}

      {/* Google Analytics (if you have tracking ID) */}
      {process.env.VITE_GA_TRACKING_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_GA_TRACKING_ID}`}
          />
          <script>{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.VITE_GA_TRACKING_ID}');
          `}</script>
        </>
      )}

      {/* Additional children (slot for more meta tags) */}
      {children}
    </Helmet>
  );
}

/**
 * Page Meta Component
 * Simplified version for pages with predefined metadata
 */
export function PageMeta({ page }: { page: SEOPageConfig }) {
  const metadata = generateSEOMetadata(page);

  return (
    <SEOHead
      title={metadata.title}
      description={metadata.description}
      keywords={metadata.keywords}
      author={metadata.author}
      canonicalUrl={metadata.canonicalUrl}
      url={metadata.ogUrl}
      image={metadata.ogImage}
      type={metadata.ogType as 'website' | 'article' | 'product'}
      noindex={metadata.robots.includes('noindex')}
    />
  );
}

/**
 * Product Meta Component
 * For product pages with pricing and ratings
 */
export function ProductMeta({
  name,
  description,
  image,
  price,
  currency = 'USD',
  rating,
  ratingCount,
  url,
  inStock = true,
}: {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  rating?: number;
  ratingCount?: number;
  url: string;
  inStock?: boolean;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: DEFAULT_SEO.siteName,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price?.toString() || '0',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: ratingCount || 0,
      },
    }),
  };

  return (
    <SEOHead
      title={name}
      description={description}
      image={image}
      type="product"
      url={url}
      schemaMarkup={schema}
    />
  );
}

/**
 * Article Meta Component
 * For blog posts and articles
 */
export function ArticleMeta({
  headline,
  description,
  image,
  publishedDate,
  modifiedDate,
  author,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    image,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SEO.siteName,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_SEO.logoUrl,
      },
    },
  };

  return (
    <SEOHead
      title={headline}
      description={description}
      image={image}
      type="article"
      url={url}
      schemaMarkup={schema}
    />
  );
}

export default SEOHead;
