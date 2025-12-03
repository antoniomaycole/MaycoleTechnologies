// MaycoleTechnologies Service Worker v1.0
// Handles offline functionality, caching, and background sync

const CACHE_NAME = 'maycole-v1';
const RUNTIME_CACHE = 'maycole-runtime';
const IMAGE_CACHE = 'maycole-images';
const API_CACHE = 'maycole-api';

// Assets to pre-cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/',
  '/icons/',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching critical assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!['maycole-v1', RUNTIME_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy with fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip preflight requests
  if (request.method !== 'GET') {
    return;
  }

  // Separate caching strategies by resource type
  if (url.pathname.includes('/api/')) {
    // API calls - network first, fallback to cache
    event.respondWith(handleApiRequest(request));
  } else if (request.destination === 'image') {
    // Images - cache first, fallback to network
    event.respondWith(handleImageRequest(request));
  } else {
    // HTML/JS/CSS - network first, fallback to cache
    event.respondWith(handleDocumentRequest(request));
  }
});

/**
 * Handle API requests (network first strategy)
 */
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] API fetch failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        error: 'Offline - cached data unavailable',
        offline: true,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

/**
 * Handle image requests (cache first strategy)
 */
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Image fetch failed:', request.url);
    
    // Return placeholder image
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#f0f0f0" width="100" height="100"/></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      }
    );
  }
}

/**
 * Handle document requests (network first strategy)
 */
async function handleDocumentRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful document responses
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Document fetch failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(RUNTIME_CACHE);
      return cache.match('/index.html');
    }
    
    throw error;
  }
}

// Background Sync for offline data submission
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-inventory') {
    event.waitUntil(syncInventoryData());
  } else if (event.tag === 'sync-contacts') {
    event.waitUntil(syncContactData());
  }
});

async function syncInventoryData() {
  try {
    const db = await openIndexedDB('maycole-db');
    const pendingUpdates = await db.getAll('pending-inventory');
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });
        
        if (response.ok) {
          await db.delete('pending-inventory', update.id);
          console.log('[SW] Synced inventory:', update.id);
        }
      } catch (err) {
        console.error('[SW] Failed to sync inventory:', err);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error; // Retry sync
  }
}

async function syncContactData() {
  try {
    const db = await openIndexedDB('maycole-db');
    const pendingContacts = await db.getAll('pending-contacts');
    
    for (const contact of pendingContacts) {
      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact),
        });
        
        if (response.ok) {
          await db.delete('pending-contacts', contact.id);
          console.log('[SW] Synced contact:', contact.id);
        }
      } catch (err) {
        console.error('[SW] Failed to sync contact:', err);
      }
    }
  } catch (error) {
    console.error('[SW] Contact sync failed:', error);
    throw error; // Retry sync
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'notification',
    data: data.data || {},
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'MaycoleTechnologies', options)
  );
});

// Notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app window is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper function to open IndexedDB
function openIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-inventory')) {
        db.createObjectStore('pending-inventory', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-contacts')) {
        db.createObjectStore('pending-contacts', { keyPath: 'id' });
      }
    };
  });
}

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
