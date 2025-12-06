import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

// Immediate critical components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CookieConsent } from './components/CookieConsent';
import { DevButton } from './components/DevButton';
import { Toaster } from './components/ui/sonner';
import { NotFound } from './components/NotFound';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load heavy components (only when needed)
const MainSections = lazy(() => import('./components/MainSections').then(m => ({ default: m.MainSections })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const FloatingTrialButton = lazy(() => import('./components/FloatingTrialButton').then(m => ({ default: m.FloatingTrialButton })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('./components/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const AuthenticatedTracker = lazy(() => import('./components/AuthenticatedTracker').then(m => ({ default: m.AuthenticatedTracker })));
const VisitorAnalyticsDashboard = lazy(() => import('./components/VisitorAnalyticsDashboard').then(m => ({ default: m.VisitorAnalyticsDashboard })));

// Timeout wrapper for lazy components - prevents infinite loading
const createSafeAsyncComponent = (importFn: () => Promise<any>, componentName: string, timeoutMs = 10000) => {
  return lazy(() => 
    Promise.race([
      importFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Component ${componentName} failed to load within ${timeoutMs}ms`)), timeoutMs)
      )
    ]).catch(error => {
      console.error(`[App] Failed to load ${componentName}:`, error);
      return {
        default: () => (
          <div className="w-full p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded">
            <p className="font-semibold">⚠️ Failed to load {componentName}</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        )
      };
    })
  );
};

// Analytics initialization (deferred)
let trackerInitialized = false;
const initializeTracker = () => {
  if (!trackerInitialized) {
    import('./services/VisitorTracking').then(m => {
      trackerInitialized = true;
      return m.getVisitorTrackingService();
    });
  }
};

type AppView = 'website' | 'tracker' | 'privacy' | 'terms' | 'cookies' | '404';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('website');
  const [appError, setAppError] = useState<Error | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safety: Mark app as hydrated to catch missing suspense boundaries
  useEffect(() => {
    setIsHydrated(true);
    
    // Set up global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Global error caught:', event.error);
      setAppError(event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Initialize tracker once after first render
  useEffect(() => {
    try {
      initializeTracker();
    } catch (error) {
      console.error('[App] Failed to initialize tracker:', error);
      // Silently fail - analytics shouldn't break the app
    }
  }, []);

  // Deferred tracking - only after page is interactive
  useEffect(() => {
    // Use requestIdleCallback if available for non-blocking tracking
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        try {
          import('./services/VisitorTracking').then(m => {
            const tracker = m.getVisitorTrackingService();
            const pageMap: Record<AppView, string> = {
              'website': 'Home',
              'tracker': 'MaycoleTracker',
              'privacy': 'Privacy Policy',
              'terms': 'Terms of Service',
              'cookies': 'Cookie Policy',
              '404': 'Not Found',
            };
            tracker.trackPageView(pageMap[currentView]);
          }).catch(error => {
            console.error('[App] Failed to track page view:', error);
            // Continue even if tracking fails
          });
        } catch (error) {
          console.error('[App] Error in tracking initialization:', error);
        }
      });
    } else {
      // Fallback: use setTimeout
      setTimeout(() => {
        try {
          import('./services/VisitorTracking').then(m => {
            const tracker = m.getVisitorTrackingService();
            const pageMap: Record<AppView, string> = {
              'website': 'Home',
              'tracker': 'MaycoleTracker',
              'privacy': 'Privacy Policy',
              'terms': 'Terms of Service',
              'cookies': 'Cookie Policy',
              '404': 'Not Found',
            };
            tracker.trackPageView(pageMap[currentView]);
          }).catch(error => {
            console.error('[App] Failed to track page view:', error);
            // Continue even if tracking fails
          });
        } catch (error) {
          console.error('[App] Error in tracking initialization:', error);
        }
      }, 2000);
    }
  }, [currentView]);

  // Handle URL-based routing with error handling
  useEffect(() => {
    try {
      const handleRouting = () => {
        try {
          const path = window.location.pathname;
          if (path === '/privacy-policy' || path === '/privacy') {
            setCurrentView('privacy');
          } else if (path === '/terms-of-service' || path === '/terms') {
            setCurrentView('terms');
          } else if (path === '/cookie-policy' || path === '/cookies') {
            setCurrentView('cookies');
          } else if (path === '/tracker') {
            setCurrentView('tracker');
          } else if (path === '/' || path === '/index.html') {
            setCurrentView('website');
          } else {
            // 404 for any other path
            setCurrentView('404');
          }
        } catch (error) {
          console.error('[App] Error in routing handler:', error);
          setCurrentView('website'); // Safe default
        }
      };

      handleRouting();
      window.addEventListener('popstate', handleRouting);
      return () => window.removeEventListener('popstate', handleRouting);
    } catch (error) {
      console.error('[App] Error setting up routing:', error);
      // Continue even if routing setup fails
    }
  }, []);

  // Navigation functions with error handling
  const goToTracker = () => {
    try {
      setCurrentView('tracker');
      window.history.pushState({}, '', '/tracker');
    } catch (error) {
      console.error('[App] Error navigating to tracker:', error);
    }
  };

  const goToWebsite = () => {
    try {
      setCurrentView('website');
      window.history.pushState({}, '', '/');
    } catch (error) {
      console.error('[App] Error navigating to website:', error);
    }
  };

  // If critical error occurred, show safe fallback
  if (appError) {
    return <SafeFallback error={appError} />;
  }

  // Render 404 page
  if (currentView === '404') {
    return <NotFound />;
  }

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-maycole-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-maycole-green">Loading...</p>
      </div>
    </div>
  );

  // Safe fallback render - if anything goes wrong, show this
  const SafeFallback = ({ error }: { error?: Error }) => (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-maycole-green mb-4">⚠️ Something went wrong</h1>
        <p className="text-gray-300 mb-6">
          {error?.message || 'The app encountered an unexpected error. Please try refreshing the page.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-maycole-green text-black rounded-lg font-semibold hover:bg-maycole-green/90 transition"
        >
          🔄 Refresh Page
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 mt-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          🏠 Go Home
        </button>
        {error && (
          <details className="mt-6 text-left text-xs text-gray-400 border border-gray-700 p-3 rounded">
            <summary className="cursor-pointer font-semibold text-maycole-green">Error Details</summary>
            <pre className="mt-3 overflow-auto bg-black p-3 rounded border border-gray-800">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
    </div>
  );

  // Render legal pages
  if (currentView === 'privacy') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <PrivacyPolicy />
      </Suspense>
    );
  }

  if (currentView === 'terms') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <TermsOfService />
      </Suspense>
    );
  }

  if (currentView === 'cookies') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CookiePolicy />
      </Suspense>
    );
  }

  if (currentView === 'tracker') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          {/* Authenticated MaycoleTracker™ Application with Real-time Features */}
          <AuthenticatedTracker onBack={goToWebsite} />

          {/* Toast Notifications */}
          <Toaster />

          {/* Back Button - Positioned over the professional app */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 z-[60]"
          >
            <Button
              onClick={goToWebsite}
              className="maycole-btn-secondary flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-lg border-maycole-green/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to MaycoleTechnologies™</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </motion.div>
        </AuthProvider>
      </Suspense>
    );
  }

  // Render website (optimized for fast initial paint)
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Critical above-the-fold content */}
      <Header onLaunchTracker={goToTracker} />
      <HeroSection onLaunchTracker={goToTracker} />
      
      {/* Deferred below-the-fold content */}
      <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse"></div>}>
        <MainSections onLaunchTracker={goToTracker} />
      </Suspense>
      
      <Suspense fallback={null}>
        <FloatingTrialButton onLaunchTracker={goToTracker} />
      </Suspense>
      
      <CookieConsent />
      <DevButton />
      
      {/* Footer - lazy load */}
      <Suspense fallback={<div className="w-full h-32 bg-gray-100"></div>}>
        <Footer />
      </Suspense>
      
      <Toaster />
    </div>
  );
}
