import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/globals.css'
import { initializeAnalytics, initScrollTracking } from './lib/analytics'
import { initializeAnalytics as initializeClickTracking } from './lib/analytics-tracker'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initPWA, isOnline, onOnlineStatusChange } from './lib/pwa'

// Initialize Google Analytics
initializeAnalytics();
initScrollTracking();

// Initialize Click & Event Tracking
initializeClickTracking({
  enableRemoteTracking: true,
  remoteEndpoint: '/api/analytics',
  samplingRate: 1, // Track all events
});

// Initialize PWA features
initPWA();

// Monitor online/offline status
const unsubscribe = onOnlineStatusChange((online) => {
  if (online) {
    console.log('[PWA] App is now online');
  } else {
    console.log('[PWA] App is now offline - using cached content');
  }
});

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('[PWA] Service Worker registered successfully:', registration.scope);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available! Please refresh.');
              
              // Optionally show update notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('MaycoleTechnologies™ Update Available', {
                  body: 'A new version is available. Refresh to update.',
                  icon: '/icons/icon-192x192.png',
                  tag: 'app-update'
                });
              }
            }
          });
        }
      });
      
      // Request notification permission for PWA features
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('[PWA] Notification permission:', permission);
      }
      
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

// PWA Install prompt handling
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');
  
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Update UI to notify the user they can install the PWA
  console.log('[PWA] App can be installed');
});

// Handle PWA installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App was installed successfully');
  deferredPrompt = null;
});

// Export install function for use in components
(window as any).installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);
    deferredPrompt = null;
  }
};

// Check initial online status
console.log('[PWA] Initial online status:', isOnline());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  unsubscribe();
});