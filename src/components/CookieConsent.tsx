import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Settings, Shield, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    functional: true,
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('maycole-cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('maycole-cookie-consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('maycole-cookie-consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('maycole-cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const cookieTypes = [
    {
      id: 'necessary' as const,
      name: 'Necessary Cookies',
      description: 'Essential for the website to function properly. Cannot be disabled.',
      required: true
    },
    {
      id: 'functional' as const,
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as remembering your preferences.',
      required: false
    },
    {
      id: 'analytics' as const,
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting and reporting information.',
      required: false
    },
    {
      id: 'marketing' as const,
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      required: false
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={() => !showSettings && setIsVisible(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[101]"
          >
            <Card className="shadow-2xl border-2 border-maycole-green/20">
              <CardContent className="p-6">
                {!showSettings ? (
                  // Main Banner
                  <>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-maycole-green to-maycole-gold rounded-xl flex items-center justify-center flex-shrink-0">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          We Value Your Privacy
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                          By clicking "Accept All", you consent to our use of cookies.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close cookie consent"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="maycole-btn-primary flex-1 py-2.5"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 py-2.5"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        className="bg-white border-2 border-maycole-green text-maycole-green hover:bg-maycole-green/5 flex items-center gap-2 py-2.5"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Customize</span>
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href="/privacy-policy"
                        className="text-xs text-maycole-green hover:underline flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        Read our Privacy Policy & Cookie Policy
                      </a>
                    </div>
                  </>
                ) : (
                  // Settings Panel
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">Cookie Preferences</h3>
                        <p className="text-sm text-gray-600">Manage your cookie settings</p>
                      </div>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close cookie settings"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {cookieTypes.map((type) => (
                        <div
                          key={type.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                {type.name}
                              </h4>
                              <p className="text-xs text-gray-600">{type.description}</p>
                            </div>
                            <div className="ml-4">
                              {type.required ? (
                                <div className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                                  Always Active
                                </div>
                              ) : (
                                <button
                                  onClick={() => setPreferences(prev => ({
                                    ...prev,
                                    [type.id]: !prev[type.id]
                                  }))}
                                  aria-label={`Toggle ${type.name}`}
                                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                                    preferences[type.id]
                                      ? 'bg-gradient-to-r from-maycole-green to-maycole-gold'
                                      : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                      preferences[type.id] ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleSavePreferences}
                        className="maycole-btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Save Preferences
                      </Button>
                      <Button
                        onClick={() => setShowSettings(false)}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
