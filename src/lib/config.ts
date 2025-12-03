/**
 * MaycoleTechnologies™ - Configuration
 * Centralized and safe environment variable access
 */

/**
 * Safe environment variable access helper
 * Returns empty string if variable is undefined or inaccessible
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]);
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

/**
 * Check if we're in development mode
 */
export const isDev = (): boolean => {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV === true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if demo mode is enabled
 */
export const isDemoMode = (): boolean => {
  return getEnvVar('VITE_DEMO_MODE') === 'true';
};

/**
 * Application configuration
 */
export const config = {
  // Demo & Development
  demo: {
    enabled: isDemoMode(),
  },
  dev: {
    enabled: isDev(),
  },

  // Contact & Support
  contact: {
    email: getEnvVar('VITE_CONTACT_EMAIL', 'help@maycoletechnologies.com'),
  },

  // Analytics
  analytics: {
    enabled: getEnvVar('VITE_ENABLE_ANALYTICS') === 'true',
    trackingId: getEnvVar('VITE_GA_TRACKING_ID'),
  },

  // SendGrid Email
  sendgrid: {
    apiKey: getEnvVar('SENDGRID_API_KEY'),
    fromEmail: getEnvVar('SENDGRID_FROM_EMAIL', 'noreply@maycoletechnologies.com'),
  },

  // Mailchimp Newsletter
  mailchimp: {
    apiKey: getEnvVar('MAILCHIMP_API_KEY'),
    audienceId: getEnvVar('MAILCHIMP_AUDIENCE_ID'),
    serverPrefix: getEnvVar('MAILCHIMP_SERVER_PREFIX', 'us1'),
  },

  // Error Tracking
  sentry: {
    dsn: getEnvVar('VITE_SENTRY_DSN'),
  },

  // Feature Flags
  features: {
    liveChat: getEnvVar('VITE_ENABLE_LIVE_CHAT') === 'true',
    newsletter: getEnvVar('VITE_ENABLE_NEWSLETTER') === 'true',
    payments: getEnvVar('VITE_ENABLE_PAYMENTS') === 'true',
  },
};

export default config;