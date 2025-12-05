/**
 * SEO Meta Tags Configuration & Utilities
 * Manages all Open Graph, Twitter, and standard meta tags
 *
 * Usage:
 * import { SEO } from '@/lib/seo'
 *
 * In component:
 * <Helmet>
 *   <SEO.title title="Page Title" description="..." />
 * </Helmet>
 */

/**
 * Default SEO configuration for the site
 */
export const DEFAULT_SEO = {
  title: 'MaycoleTechnologies™ | Changing The Future One Product At A Time',
  description:
    'Innovative business solutions and products designed to transform your operations. Explore MaycoleCheckBook™ and MaycoleTracker vol XII.',
  keywords: 'business solutions, tracker software, checkbook management, enterprise tools',
  url: 'https://maycoletechnologies.com',
  image: 'https://maycoletechnologies.com/og-image.png',
  logoUrl: 'https://maycoletechnologies.com/logo.png',
  siteName: 'MaycoleTechnologies™',
  twitterHandle: '@MaycoleTech', // Update with actual Twitter handle
  author: 'MaycoleTechnologies™',
  type: 'website',
  locale: 'en_US',
} as const;

/**
 * Page-specific SEO metadata
 */
export const PAGE_METADATA: Record<string, SEOPageConfig> = {
  home: {
    title: 'MaycoleTechnologies™ | Enterprise Solutions & Products',
    description:
      'Discover innovative business solutions. Launch MaycoleCheckBook™ and MaycoleTracker vol XII - products designed to transform your business.',
    path: '/',
    image: 'https://maycoletechnologies.com/og-home.png',
  },
  about: {
    title: 'About MaycoleTechnologies™ | Innovation & Excellence',
    description:
      'Learn about our mission, team, and commitment to delivering world-class business solutions through innovative technology.',
    path: '/about',
    image: 'https://maycoletechnologies.com/og-about.png',
  },
  products: {
    title: 'Products | MaycoleCheckBook™ & MaycoleTracker vol XII',
    description:
      'Explore our flagship products designed to streamline your business operations and improve efficiency.',
    path: '/products',
    image: 'https://maycoletechnologies.com/og-products.png',
  },
  services: {
    title: 'Services | Professional Support & Implementation',
    description:
      'Comprehensive services including implementation, training, support, and optimization for all MaycoleTechnologies™ products.',
    path: '/services',
    image: 'https://maycoletechnologies.com/og-services.png',
  },
  contact: {
    title: 'Contact Us | MaycoleTechnologies™ Support',
    description:
      'Get in touch with our team. Email support@maycoletechnologies.com or fill out our contact form for assistance.',
    path: '/contact',
    image: 'https://maycoletechnologies.com/og-contact.png',
  },
  pricing: {
    title: 'Pricing | Flexible Plans for Every Business',
    description:
      'Transparent pricing for Professional and Enterprise tiers. Choose the plan that fits your needs.',
    path: '/pricing',
    image: 'https://maycoletechnologies.com/og-pricing.png',
  },
  privacy: {
    title: 'Privacy Policy | MaycoleTechnologies™',
    description: 'Learn how we collect, use, and protect your personal information.',
    path: '/privacy',
    noindex: true,
  },
  terms: {
    title: 'Terms of Service | MaycoleTechnologies™',
    description:
      'Review the terms and conditions for using MaycoleTechnologies™ products and services.',
    path: '/terms',
    noindex: true,
  },
};

/**
 * SEO Page Configuration Interface
 */
export interface SEOPageConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string;
  author?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
}

/**
 * Generate complete SEO metadata for a page
 */
export function generateSEOMetadata(
  page: SEOPageConfig,
  overrides: Partial<SEOPageConfig> = {}
): CompleteMetadata {
  const config = { ...page, ...overrides };
  const fullUrl = `${DEFAULT_SEO.url}${config.path}`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || DEFAULT_SEO.keywords,
    author: config.author || DEFAULT_SEO.author,
    canonicalUrl: config.canonical || fullUrl,
    ogType: config.type || 'website',
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage: config.image || DEFAULT_SEO.image,
    ogUrl: fullUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: config.title,
    twitterDescription: config.description,
    twitterImage: config.image || DEFAULT_SEO.image,
    twitterHandle: DEFAULT_SEO.twitterHandle,
    robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
    locale: DEFAULT_SEO.locale,
  };
}

/**
 * Complete metadata object
 */
export interface CompleteMetadata {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  ogType: 'website' | 'article' | 'product';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterHandle: string;
  robots: string;
  locale: string;
}

/**
 * Generate structured data (JSON-LD)
 * Used by search engines for rich snippets
 */
export function generateSchemaMarkup(
  type: 'Organization' | 'Product' | 'LocalBusiness',
  data: any
) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.url,
    logo: DEFAULT_SEO.logoUrl,
    image: DEFAULT_SEO.image,
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseSchema,
        description: DEFAULT_SEO.description,
        sameAs: [
          'https://twitter.com/MaycoleTech',
          'https://linkedin.com/company/maycoletechnologies',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'help@maycoletechnologies.com',
        },
      };

    case 'Product':
      return {
        ...baseSchema,
        '@type': 'Product',
        name: data.name || 'MaycoleTechnologies™ Product',
        description: data.description || DEFAULT_SEO.description,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: data.lowPrice || '0',
          highPrice: data.highPrice || '299',
          offerCount: data.offerCount || 3,
        },
        aggregateRating: data.rating && {
          '@type': 'AggregateRating',
          ratingValue: data.rating.value,
          reviewCount: data.rating.count,
        },
      };

    case 'LocalBusiness':
      return {
        ...baseSchema,
        '@type': 'LocalBusiness',
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.streetAddress || '',
          addressLocality: data.city || '',
          addressRegion: data.state || '',
          postalCode: data.postalCode || '',
          addressCountry: 'US',
        },
        telephone: data.phone || '',
        email: 'help@maycoletechnologies.com',
      };

    default:
      return baseSchema;
  }
}

/**
 * Breadcrumb schema markup
 * Improves site navigation in search results
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQ schema markup
 * Enables FAQ rich snippets in Google Search
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article schema markup
 * For blog posts and articles
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.description,
    image: article.image || DEFAULT_SEO.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author,
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
}

/**
 * Generate sitemap XML
 * Include all important pages for search engines
 */
export function generateSitemapXML(
  pages: Array<{ path: string; lastmod?: string; priority?: number }>
) {
  const entries = pages
    .map(
      (page) => `
  <url>
    <loc>${DEFAULT_SEO.url}${page.path}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <priority>${page.priority || 0.8}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(disallowPaths: string[] = ['/admin', '/api', '/internal']) {
  const disallow = disallowPaths.map((path) => `Disallow: ${path}`).join('\n');

  return `User-agent: *
Allow: /
${disallow}

Sitemap: ${DEFAULT_SEO.url}/sitemap.xml
`;
}

/**
 * Utility to inject JSON-LD schema into page
 */
export function injectSchema(schema: any) {
  // This is typically done in Helmet's <script> tag
  return JSON.stringify(schema);
}

export const SEO = {
  ...DEFAULT_SEO,
  generateMetadata: generateSEOMetadata,
  generateSchema: generateSchemaMarkup,
  generateBreadcrumbs: generateBreadcrumbSchema,
  generateFAQ: generateFAQSchema,
  generateArticle: generateArticleSchema,
  generateSitemap: generateSitemapXML,
  generateRobots: generateRobotsTxt,
  injectSchema,
};

export default SEO;
