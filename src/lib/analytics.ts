/**
 * MaycoleTechnologies™ - Analytics Service
 * Google Analytics 4 implementation
 */

import { config } from './config';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Check if analytics is enabled
const isAnalyticsEnabled = () => {
  return config.analytics.enabled && config.analytics.trackingId;
};

/**
 * Initialize Google Analytics
 */
export const initializeAnalytics = (): void => {
  if (!isAnalyticsEnabled()) {
    console.log('📊 Analytics: Disabled or not configured');
    return;
  }

  const trackingId = config.analytics.trackingId;
  if (!trackingId) return;

  // Create script tag for gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', trackingId, {
    send_page_view: false, // We'll track manually
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('📊 Analytics: Initialized with ID:', trackingId);
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });

  console.log('📊 Analytics: Page view tracked:', path);
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', eventName, eventParams);

  console.log('📊 Analytics: Event tracked:', eventName, eventParams);
};

// ==================== PREDEFINED EVENTS ====================

/**
 * Track button click
 */
export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || window.location.pathname,
  });
};

/**
 * Track CTA click
 */
export const trackCTAClick = (ctaName: string, ctaLocation?: string): void => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formName: string,
  success: boolean,
  errorMessage?: string
): void => {
  trackEvent('form_submission', {
    form_name: formName,
    success,
    error_message: errorMessage,
  });
};

/**
 * Track newsletter signup
 */
export const trackNewsletterSignup = (email: string): void => {
  trackEvent('newsletter_signup', {
    method: 'website',
  });
};

/**
 * Track product interest
 */
export const trackProductInterest = (productName: string): void => {
  trackEvent('product_interest', {
    product_name: productName,
  });
};

/**
 * Track free trial start
 */
export const trackFreeTrialStart = (): void => {
  trackEvent('begin_checkout', {
    items: [{
      item_name: 'MaycoleTracker Free Trial',
      item_category: 'Software',
      price: 0,
    }],
  });
};

/**
 * Track conversion (lead generation)
 */
export const trackConversion = (conversionType: string, value?: number): void => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value || 0,
    currency: 'USD',
  });
};

/**
 * Track outbound link click
 */
export const trackOutboundLink = (url: string, linkText?: string): void => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number): void => {
  trackEvent('scroll', {
    event_category: 'engagement',
    scroll_depth: percentage,
  });
};

/**
 * Track video play
 */
export const trackVideoPlay = (videoName: string): void => {
  trackEvent('video_start', {
    video_name: videoName,
  });
};

/**
 * Track live chat open
 */
export const trackChatOpen = (): void => {
  trackEvent('chat_widget_open', {
    event_category: 'engagement',
  });
};

/**
 * Track ROI calculator usage
 */
export const trackROICalculator = (
  employees: number,
  hoursPerWeek: number,
  savings: number
): void => {
  trackEvent('roi_calculator_usage', {
    employees,
    hours_per_week: hoursPerWeek,
    estimated_savings: savings,
  });
};

/**
 * Track pricing plan view
 */
export const trackPricingView = (planName: string): void => {
  trackEvent('view_item', {
    items: [{
      item_name: planName,
      item_category: 'Subscription',
    }],
  });
};

/**
 * Track section view (scroll into view)
 */
export const trackSectionView = (sectionName: string): void => {
  trackEvent('section_view', {
    section_name: sectionName,
  });
};

/**
 * Track download
 */
export const trackDownload = (fileName: string, fileType?: string): void => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string): void => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

/**
 * Track error
 */
export const trackError = (errorMessage: string, errorLocation?: string): void => {
  trackEvent('exception', {
    description: errorMessage,
    location: errorLocation,
    fatal: false,
  });
};

// ==================== USER PROPERTIES ====================

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Set user ID (for authenticated users)
 */
export const setUserId = (userId: string): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  const trackingId = config.analytics.trackingId;
  if (trackingId) {
    window.gtag('config', trackingId, {
      user_id: userId,
    });
  }
};

// ==================== SCROLL DEPTH TRACKER ====================

let scrollTracked = {
  25: false,
  50: false,
  75: false,
  100: false,
};

export const initScrollTracking = (): void => {
  if (!isAnalyticsEnabled()) return;

  window.addEventListener('scroll', () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    Object.keys(scrollTracked).forEach((threshold) => {
      const thresholdNum = parseInt(threshold);
      if (scrollPercentage >= thresholdNum && !scrollTracked[thresholdNum as keyof typeof scrollTracked]) {
        trackScrollDepth(thresholdNum);
        scrollTracked[thresholdNum as keyof typeof scrollTracked] = true;
      }
    });
  });
};

// ==================== EXPORT ALL ====================

export default {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackCTAClick,
  trackFormSubmission,
  trackNewsletterSignup,
  trackProductInterest,
  trackFreeTrialStart,
  trackConversion,
  trackOutboundLink,
  trackScrollDepth,
  trackVideoPlay,
  trackChatOpen,
  trackROICalculator,
  trackPricingView,
  trackSectionView,
  trackDownload,
  trackSearch,
  trackError,
  setUserProperties,
  setUserId,
  initScrollTracking,
};
