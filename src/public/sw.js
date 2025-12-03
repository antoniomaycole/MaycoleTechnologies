// MaycoleTracker™ Service Worker
// Enterprise-grade offline support for AI-Native Inventory Intelligence

const CACHE_NAME = 'maycole-tracker-v1.0.0';
const STATIC_CACHE_NAME = 'maycole-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'maycole-dynamic-v1.0.0';

// Resources to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/atomic-favicon.svg',
  // Core app files will be added dynamically by Vite
];

// Resources that should always be fetched from network when online
const NETWORK_FIRST = [
  '/api/',
  '.json'
];

// Resources that can be served from cache first
const CACHE_FIRST = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.webp',
  '.woff',
  '.woff2'
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing MaycoleTracker™ Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] MaycoleTracker™ Service Worker installed successfully!');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating MaycoleTracker™ Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] MaycoleTracker™ Service Worker activated!');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch Event - Handle network requests with caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip POST requests and other non-GET methods for caching
  if (request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request, url)
  );
});

// Handle fetch requests with appropriate caching strategy
async function handleFetchRequest(request, url) {
  try {
    // Network First Strategy - For API calls and dynamic content
    if (NETWORK_FIRST.some(pattern => url.pathname.includes(pattern))) {
      return await networkFirstStrategy(request);
    }
    
    // Cache First Strategy - For static assets
    if (CACHE_FIRST.some(pattern => url.pathname.includes(pattern))) {
      return await cacheFirstStrategy(request);
    }
    
    // Stale While Revalidate - For HTML pages and app shell
    return await staleWhileRevalidateStrategy(request);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    
    // Return offline fallback for navigation requests
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const offlineResponse = await cache.match('/');
      return offlineResponse || new Response('Offline - MaycoleTracker™ unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Return basic error response for other failed requests
    return new Response('Network error', {
      status: 408,
      statusText: 'Request Timeout'
    });
  }
}

// Network First Strategy - Try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy - Try cache, fallback to network
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the new resource
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    throw error;
  }
}

// Stale While Revalidate Strategy - Serve from cache, update in background
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background to update cache
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  try {
    return await networkPromise;
  } catch (error) {
    console.error('[SW] Stale while revalidate failed:', error);
    throw error;
  }
}

// Background Sync - Handle offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'inventory-sync') {
    event.waitUntil(
      syncInventoryData()
    );
  }
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(
      syncAnalyticsData()
    );
  }
});

// Sync inventory data when back online
async function syncInventoryData() {
  try {
    console.log('[SW] Syncing inventory data...');
    
    // Get pending inventory updates from IndexedDB
    const pendingUpdates = await getPendingInventoryUpdates();
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/inventory/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(update)
        });
        
        if (response.ok) {
          await removePendingUpdate(update.id);
          console.log('[SW] Synced inventory update:', update.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync inventory update:', error);
      }
    }
    
    console.log('[SW] Inventory sync completed');
  } catch (error) {
    console.error('[SW] Inventory sync failed:', error);
  }
}

// Sync analytics data when back online  
async function syncAnalyticsData() {
  try {
    console.log('[SW] Syncing analytics data...');
    
    // Get pending analytics events from IndexedDB
    const pendingEvents = await getPendingAnalyticsEvents();
    
    for (const event of pendingEvents) {
      try {
        const response = await fetch('/api/analytics/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        });
        
        if (response.ok) {
          await removePendingEvent(event.id);
          console.log('[SW] Synced analytics event:', event.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync analytics event:', error);
      }
    }
    
    console.log('[SW] Analytics sync completed');
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

// IndexedDB helpers for offline data storage
async function getPendingInventoryUpdates() {
  // In a real implementation, this would query IndexedDB
  // For now, return empty array as placeholder
  return [];
}

async function getPendingAnalyticsEvents() {
  // In a real implementation, this would query IndexedDB
  // For now, return empty array as placeholder  
  return [];
}

async function removePendingUpdate(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('[SW] Would remove pending update:', id);
}

async function removePendingEvent(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('[SW] Would remove pending event:', id);
}

// Push Notifications - Handle incoming push messages
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: 'MaycoleTracker™ notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'maycole-notification',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.title = payload.title || 'MaycoleTracker™';
      options.data = { ...options.data, ...payload.data };
    } catch (error) {
      console.error('[SW] Failed to parse push payload:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('MaycoleTracker™', options)
  );
});

// Notification Click - Handle notification interactions
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Default action or 'open' action
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handling - Communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      timestamp: Date.now()
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Periodic Background Sync - For premium features
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);
  
  if (event.tag === 'inventory-refresh') {
    event.waitUntil(
      refreshInventoryData()
    );
  }
});

async function refreshInventoryData() {
  try {
    console.log('[SW] Refreshing inventory data in background...');
    
    const response = await fetch('/api/inventory/refresh', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Update cache with fresh data
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put('/api/inventory/refresh', new Response(JSON.stringify(data)));
      
      console.log('[SW] Inventory data refreshed successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to refresh inventory data:', error);
  }
}

console.log('[SW] MaycoleTracker™ Service Worker loaded successfully! 🚀');