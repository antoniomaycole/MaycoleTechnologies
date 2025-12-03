/**
 * PWA (Progressive Web App) utilities
 * Handles app installation, offline mode, and native features
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Initialize PWA features
 */
export function initPWA() {
  // Prevent default install prompt and save for later
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('[PWA] Install prompt ready');
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
  });

  // Handle app display changes
  window.addEventListener('beforeinstallprompt', () => {
    const displayMode = window.matchMedia('(display-mode: standalone)').matches
      ? 'standalone'
      : 'browser';
    console.log('[PWA] Display mode:', displayMode);
  });
}

/**
 * Show app install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt');
      deferredPrompt = null;
      return true;
    } else {
      console.log('[PWA] User dismissed install prompt');
      return false;
    }
  } catch (error) {
    console.error('[PWA] Install prompt error:', error);
    return false;
  }
}

/**
 * Check if PWA is installable
 */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check if app is running in standalone mode (installed)
 */
export function isStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return 'denied';
  }

  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[PWA] Notification permission error:', error);
    return 'denied';
  }
}

/**
 * Show local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('[PWA] Notification permission not granted');
    return;
  }

  try {
    if (navigator.serviceWorker?.controller) {
      // Use service worker to show notification
      await navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options,
      });
    } else {
      // Fallback to direct notification
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options,
      });
    }
  } catch (error) {
    console.error('[PWA] Show notification error:', error);
  }
}

/**
 * Request geolocation with PWA optimization
 */
export async function getGeolocation(): Promise<GeolocationCoordinates | null> {
  if (!navigator.geolocation) {
    console.warn('[PWA] Geolocation not supported');
    return null;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[PWA] Geolocation obtained');
        resolve(position.coords);
      },
      (error) => {
        console.error('[PWA] Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Request camera access
 */
export async function getCamera(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.warn('[PWA] Camera not supported');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Prefer rear camera
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    console.log('[PWA] Camera stream obtained');
    return stream;
  } catch (error) {
    console.error('[PWA] Camera access error:', error);
    return null;
  }
}

/**
 * Request microphone access
 */
export async function getMicrophone(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.warn('[PWA] Microphone not supported');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    console.log('[PWA] Microphone stream obtained');
    return stream;
  } catch (error) {
    console.error('[PWA] Microphone access error:', error);
    return null;
  }
}

/**
 * Request storage quota
 */
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if (!navigator.storage?.estimate) {
    console.warn('[PWA] Storage quota API not supported');
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    
    return {
      usage,
      quota,
      percentage: (usage / quota) * 100,
    };
  } catch (error) {
    console.error('[PWA] Storage quota error:', error);
    return null;
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) {
    console.warn('[PWA] Persistent storage not supported');
    return false;
  }

  try {
    const persisted = await navigator.storage.persist();
    console.log('[PWA] Persistent storage:', persisted ? 'granted' : 'denied');
    return persisted;
  } catch (error) {
    console.error('[PWA] Persistent storage error:', error);
    return false;
  }
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen to online/offline events
 */
export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return unsubscribe function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Request permission for background sync
 */
export async function registerBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('[PWA] Background Sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log('[PWA] Background sync registered:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Background sync error:', error);
    return false;
  }
}

/**
 * Get battery status
 */
export async function getBatteryStatus(): Promise<{
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
} | null> {
  if (!navigator.getBattery) {
    console.warn('[PWA] Battery API not supported');
    return null;
  }

  try {
    const battery = await (navigator as any).getBattery();
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    };
  } catch (error) {
    console.error('[PWA] Battery status error:', error);
    return null;
  }
}

/**
 * Get network connection information
 */
export function getNetworkInfo(): {
  type: string;
  downlink: number;
  effectiveType: string;
  rtt: number;
  saveData: boolean;
} | null {
  const connection = (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) {
    console.warn('[PWA] Network Information API not supported');
    return null;
  }

  return {
    type: connection.type || 'unknown',
    downlink: connection.downlink || 0,
    effectiveType: connection.effectiveType || 'unknown',
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false,
  };
}

/**
 * Share content using Web Share API
 */
export async function shareContent(data: {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}): Promise<boolean> {
  if (!navigator.share) {
    console.warn('[PWA] Web Share API not supported');
    return false;
  }

  try {
    await navigator.share(data);
    console.log('[PWA] Content shared successfully');
    return true;
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('[PWA] Share error:', error);
    }
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    console.warn('[PWA] Clipboard API not supported');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    console.log('[PWA] Text copied to clipboard');
    return true;
  } catch (error) {
    console.error('[PWA] Clipboard error:', error);
    return false;
  }
}

/**
 * Get clipboard content
 */
export async function getClipboardContent(): Promise<string | null> {
  if (!navigator.clipboard?.readText) {
    console.warn('[PWA] Clipboard read not supported');
    return null;
  }

  try {
    const text = await navigator.clipboard.readText();
    console.log('[PWA] Clipboard content read');
    return text;
  } catch (error) {
    console.error('[PWA] Clipboard read error:', error);
    return null;
  }
}

/**
 * Vibrate device
 */
export function vibrate(pattern: number | number[]): boolean {
  if (!navigator.vibrate) {
    console.warn('[PWA] Vibration API not supported');
    return false;
  }

  try {
    navigator.vibrate(pattern);
    return true;
  } catch (error) {
    console.error('[PWA] Vibration error:', error);
    return false;
  }
}

/**
 * Lock screen orientation
 */
export async function lockOrientation(
  orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'landscape-primary'
): Promise<boolean> {
  if (!screen.orientation?.lock) {
    console.warn('[PWA] Screen orientation API not supported');
    return false;
  }

  try {
    await screen.orientation.lock(orientation);
    console.log('[PWA] Screen locked to:', orientation);
    return true;
  } catch (error) {
    console.error('[PWA] Screen lock error:', error);
    return false;
  }
}

/**
 * Unlock screen orientation
 */
export function unlockOrientation(): boolean {
  if (!screen.orientation?.unlock) {
    console.warn('[PWA] Screen orientation unlock not supported');
    return false;
  }

  try {
    screen.orientation.unlock();
    console.log('[PWA] Screen orientation unlocked');
    return true;
  } catch (error) {
    console.error('[PWA] Screen unlock error:', error);
    return false;
  }
}
