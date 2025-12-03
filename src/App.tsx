import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

// Main MaycoleTechnologies Website Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MainSections } from './components/MainSections';
import { Footer } from './components/Footer';
import { TickerTape } from './components/TickerTape';
import { FloatingTrialButton } from './components/FloatingTrialButton';
import { LiveChatWidget } from './components/LiveChatWidget';
import { CookieConsent } from './components/CookieConsent';
import { DemoDisclaimer } from './components/DemoDisclaimer';
import { DevButton } from './components/DevButton';

// Legal Pages
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CookiePolicy } from './components/CookiePolicy';
import { NotFound } from './components/NotFound';

// MaycoleTracker Application Components
import { AuthenticatedTracker } from './components/AuthenticatedTracker';
import { Toaster } from './components/ui/sonner';

// Authentication
import { AuthProvider } from './contexts/AuthContext';

type AppView = 'website' | 'tracker' | 'privacy' | 'terms' | 'cookies' | '404';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('website');

  // Handle URL-based routing
  useEffect(() => {
    const handleRouting = () => {
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
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  // Navigation functions
  const goToTracker = () => {
    setCurrentView('tracker');
    window.history.pushState({}, '', '/tracker');
  };

  const goToWebsite = () => {
    setCurrentView('website');
    window.history.pushState({}, '', '/');
  };

  // Render 404 page
  if (currentView === '404') {
    return <NotFound />;
  }

  // Render legal pages
  if (currentView === 'privacy') {
    return <PrivacyPolicy />;
  }

  if (currentView === 'terms') {
    return <TermsOfService />;
  }

  if (currentView === 'cookies') {
    return <CookiePolicy />;
  }

  if (currentView === 'tracker') {
    return (
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
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <DemoDisclaimer />
      <Header onLaunchTracker={goToTracker} />
      <HeroSection onLaunchTracker={goToTracker} />
      <TickerTape />
      <MainSections />
      <FloatingTrialButton />
      <LiveChatWidget />
      <CookieConsent />
      <DevButton />
      <Footer />
      <Toaster />
    </div>
  );
}