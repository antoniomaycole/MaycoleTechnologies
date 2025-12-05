/**
 * Security Headers Configuration
 * Applies helmet.js security headers to Express server
 *
 * Usage (in your backend/server.ts):
 * import { setupSecurityHeaders } from './lib/security-headers'
 * setupSecurityHeaders(app) // Call before other middleware
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import helmet from 'helmet';

// Type definitions for Express (server-side module)
type Express = {
  use: (middleware: any) => void;
};

export interface SecurityConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXSSFilter?: boolean;
  enableFrameGuard?: boolean;
  enableContentTypeSniff?: boolean;
  enableReferrerPolicy?: boolean;
  corsOrigins?: string[];
}

/**
 * Setup comprehensive security headers using helmet.js
 * Provides defense against:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME type sniffing
 * - Insecure mixed content
 * - Weak referrer policies
 */
export function setupSecurityHeaders(app: Express, config: SecurityConfig = {}) {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableXSSFilter = true,
    enableFrameGuard = true,
    enableContentTypeSniff = true,
    enableReferrerPolicy = true,
  } = config;

  // Apply helmet.js with default protections
  app.use(helmet());

  // 1. Content Security Policy (CSP)
  // Mitigates XSS by restricting resource loading
  if (enableCSP) {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // For inline event handlers (consider removing in strict mode)
            "'unsafe-eval'", // For dynamic script loading (Vite requires this in dev)
            'cdn.jsdelivr.net',
            'cdn.stripe.com',
            'cdn.segment.com',
            'www.googletagmanager.com',
            'www.google-analytics.com',
            '*.sentry.io',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'", // Tailwind CSS requires inline styles
            'fonts.googleapis.com',
          ],
          fontSrc: [
            "'self'",
            'fonts.gstatic.com',
            'data:', // For data URLs in CSS
          ],
          imgSrc: ["'self'", 'data:', 'https:', 'https://api.maycoletechnologies.com'],
          connectSrc: [
            "'self'",
            'https://api.maycoletechnologies.com',
            'https://*.stripe.com',
            '*.sentry.io',
            'www.google-analytics.com',
            'https://cdn.segment.com',
          ],
          frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
          objectSrc: ["'none'"], // Prevent plugins
          upgradeInsecureRequests: [], // Enforce HTTPS
        },
        reportOnly: false, // Set to true for testing CSP violations
      })
    );
  }

  // 2. HTTP Strict Transport Security (HSTS)
  // Forces HTTPS connections for 1 year + subdomains
  if (enableHSTS) {
    app.use(
      helmet.hsts({
        maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
        includeSubDomains: true,
        preload: true, // Include in HSTS preload list
      })
    );
  }

  // 3. X-XSS-Protection Header
  // Legacy IE/Edge XSS protection (modern browsers ignore)
  if (enableXSSFilter) {
    app.use(helmet.xssFilter());
  }

  // 4. X-Frame-Options
  // Prevents clickjacking attacks
  if (enableFrameGuard) {
    app.use(
      helmet.frameguard({
        action: 'deny', // Prevent embedding in iframes
      })
    );
  }

  // 5. X-Content-Type-Options
  // Prevents MIME type sniffing
  if (enableContentTypeSniff) {
    app.use(helmet.noSniff());
  }

  // 6. Referrer-Policy
  // Controls how much referrer information is shared
  if (enableReferrerPolicy) {
    app.use(
      helmet.referrerPolicy({
        policy: 'strict-origin-when-cross-origin',
      })
    );
  }

  // 7. Permissions-Policy (formerly Feature-Policy)
  // Disable potentially dangerous browser features
  // Note: permissionsPolicy may not be available in all helmet versions
  if (typeof (helmet as any).permissionsPolicy === 'function') {
    app.use(
      (helmet as any).permissionsPolicy({
        features: {
          geolocation: ["'self'"],
          microphone: [],
          camera: [],
          payment: ["'self'"], // Allow Stripe payments on same origin
        },
      })
    );
  }

  // Custom security headers
  app.use((_req: any, res: any, next: any) => {
    // Prevent other origins from embedding our API response
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Disable browser caching for sensitive pages
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Remove server signature
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    // Security headers summary
    res.setHeader('X-Security-Headers', 'enabled');

    next();
  });
}

/**
 * Setup CORS (Cross-Origin Resource Sharing)
 * Allow specific origins to make requests to your API
 */
export function setupCORS(
  app: Express,
  allowedOrigins: string[] = [
    'https://maycoletechnologies.com',
    'https://www.maycoletechnologies.com',
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
  ]
) {
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin || '';

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '3600');

    // Preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

/**
 * Setup input sanitization
 * Prevent common injection attacks (SQL injection, NoSQL injection, etc.)
 */
export function setupInputSanitization(app: Express) {
  // Remove JSON payloads containing suspicious patterns
  app.use((req: any, res: any, next: any) => {
    if (req.body && typeof req.body === 'object') {
      const jsonString = JSON.stringify(req.body);

      // Check for SQL injection patterns (basic)
      const sqlPatterns =
        /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi;
      if (sqlPatterns.test(jsonString)) {
        return res.status(400).json({ error: 'Invalid input detected' });
      }

      // Check for NoSQL injection patterns
      const noSqlPatterns = /(\$where|\$ne|\$gt|\$lt|\$eq|\$or|\$and|\$exists)/g;
      if (noSqlPatterns.test(jsonString)) {
        return res.status(400).json({ error: 'Invalid input detected' });
      }

      // Check for XSS patterns in strings
      const xssPatterns = /<script|<iframe|javascript:|onerror=|onload=/gi;
      if (xssPatterns.test(jsonString)) {
        return res.status(400).json({ error: 'Invalid input detected' });
      }
    }

    next();
  });
}

/**
 * Setup rate limiting
 * Prevent brute force attacks and DDoS
 */
export function setupRateLimiting(app: Express) {
  // Simple in-memory rate limiter
  // For production, use: npm install express-rate-limit redis
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  const RATE_LIMIT = 100; // requests per window
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  app.use((req: any, res: any, next: any) => {
    const clientIP = req.ip || 'unknown';
    const now = Date.now();

    let clientData = requestCounts.get(clientIP);

    // Reset if window expired
    if (!clientData || now > clientData.resetTime) {
      clientData = { count: 0, resetTime: now + WINDOW_MS };
      requestCounts.set(clientIP, clientData);
    }

    clientData.count++;

    // Return 429 Too Many Requests if exceeded
    if (clientData.count > RATE_LIMIT) {
      return res.status(429).json({ error: 'Too many requests, please try again later' });
    }

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT.toString());
    res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT - clientData.count).toString());
    res.setHeader('X-RateLimit-Reset', clientData.resetTime.toString());

    next();
  });
}

/**
 * Comprehensive security setup
 * Call this once in your server initialization
 */
export function initializeSecurity(
  app: Express,
  options: {
    enableCSP?: boolean;
    enableHSTS?: boolean;
    enableCORS?: boolean;
    enableRateLimit?: boolean;
    corsOrigins?: string[];
  } = {}
) {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableCORS = true,
    enableRateLimit = true,
    corsOrigins = [
      'https://maycoletechnologies.com',
      'https://www.maycoletechnologies.com',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
  } = options;

  console.log('🔒 Initializing security headers...');

  if (enableCORS) {
    setupCORS(app, corsOrigins);
    console.log('✅ CORS configured');
  }

  setupSecurityHeaders(app, { enableCSP, enableHSTS });
  console.log('✅ Security headers configured');

  setupInputSanitization(app);
  console.log('✅ Input sanitization enabled');

  if (enableRateLimit) {
    setupRateLimiting(app);
    console.log('✅ Rate limiting enabled');
  }

  console.log('🔒 Security initialization complete');
}

export default initializeSecurity;
