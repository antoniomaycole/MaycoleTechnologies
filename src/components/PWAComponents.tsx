import { useEffect, useState } from 'react';
import { Download, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { isInstallPromptAvailable, showInstallPrompt, isStandaloneMode, isOnline, onOnlineStatusChange } from '../lib/pwa';

/**
 * PWA Install Prompt Component
 * Shows install button when app is installable (not already installed)
 */
export function PWAInstallPrompt() {
  const [installable, setInstallable] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (isStandaloneMode()) {
      console.log('[PWA] App is already installed');
      return;
    }

    // Check if install prompt is available
    const checkInstallable = () => {
      setInstallable(isInstallPromptAvailable());
    };

    window.addEventListener('beforeinstallprompt', checkInstallable);
    window.addEventListener('appinstalled', () => setInstallable(false));

    // Initial check
    checkInstallable();

    return () => {
      window.removeEventListener('beforeinstallprompt', checkInstallable);
    };
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      const success = await showInstallPrompt();
      if (success) {
        console.log('[PWA] App installation completed');
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    } finally {
      setInstalling(false);
    }
  };

  if (!installable || isStandaloneMode()) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      disabled={installing}
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors z-50"
      title="Install MaycoleTechnologies as an app"
    >
      <Download size={18} />
      {installing ? 'Installing...' : 'Install App'}
    </button>
  );
}

/**
 * Online/Offline Status Indicator
 * Shows network status with visual feedback
 */
export function PWAStatusIndicator() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = onOnlineStatusChange(setOnline);
    return unsubscribe;
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-amber-900 px-4 py-2 flex items-center gap-2 shadow-md z-50">
      <WifiOff size={18} />
      <span>You are offline - using cached data</span>
    </div>
  );
}

/**
 * PWA Features Showcase Component
 * Display available PWA features and status
 */
export function PWAFeaturesStatus() {
  const [features, setFeatures] = useState({
    serviceWorker: false,
    notification: false,
    installable: false,
    standalone: false,
    online: true,
  });

  useEffect(() => {
    // Check service worker
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    // Check notifications
    const canNotify = 'Notification' in window;
    
    // Check installable
    const isInstallable = isInstallPromptAvailable();
    
    // Check standalone
    const isStandalone = isStandaloneMode();
    
    // Check online
    const isOnlineNow = navigator.onLine;

    setFeatures({
      serviceWorker: hasServiceWorker,
      notification: canNotify,
      installable: isInstallable,
      standalone: isStandalone,
      online: isOnlineNow,
    });

    const unsubscribe = onOnlineStatusChange((online) => {
      setFeatures(prev => ({ ...prev, online }));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <AlertCircle size={18} />
        PWA Features Status
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${features.serviceWorker ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-700">
            Service Worker: {features.serviceWorker ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${features.notification ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-700">
            Notifications: {features.notification ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${features.installable ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-gray-700">
            Installable: {features.installable ? '✓ Yes' : (features.standalone ? '✓ Already Installed' : '✗ No')}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${features.online ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-700">
            Network: {features.online ? (
              <>
              <Wifi className="inline ml-1" size={14} /> Online
              </>
            ) : (
              <>
              <WifiOff className="inline ml-1" size={14} /> Offline
              </>
            )}
          </span>
        </li>
      </ul>
    </div>
  );
}

/**
 * PWA Update Prompt Component
 * Shows when a new version of the app is available
 */
export function PWAUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  if (!updateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex gap-3 items-center z-50 max-w-sm">
      <div className="flex-1">
        <p className="font-semibold">Update Available</p>
        <p className="text-sm text-blue-100">A new version of the app is ready</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded font-semibold text-sm transition-colors"
        >
          Update Now
        </button>
        <button
          onClick={handleDismiss}
          className="text-blue-100 hover:text-white px-3 py-1 text-sm transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
}
