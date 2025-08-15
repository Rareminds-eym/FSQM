/**
 * Enhanced Service Worker for PWA functionality
 * Provides offline support, caching strategies, and background sync
 */

const CACHE_NAME = 'gmp-training-game-v1.1.0';
const RUNTIME_CACHE = 'gmp-runtime-cache-v1.1.0';
const IMAGE_CACHE = 'gmp-image-cache-v1.1.0';
const API_CACHE = 'gmp-api-cache-v1.1.0';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-16x16.png',
  '/icons/icon-32x32.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-192x192-maskable.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/icon-512x512-maskable.png',
  '/icons/apple-touch-icon.png',
  '/icons/apple-touch-icon-ipad.png'
];

// Runtime assets to cache dynamically
const RUNTIME_ASSETS = [
  // Add your JS/CSS bundles here - these will be cached as they're requested
  // Vite will generate these with hashes, so we cache them dynamically
];

// Helper function to check if request should be cached
const shouldCache = (request) => {
  const url = new URL(request.url);

  // Don't cache non-GET requests
  if (request.method !== 'GET') return false;

  // Don't cache chrome-extension or other non-http(s) requests
  if (!url.protocol.startsWith('http')) return false;

  // Don't cache requests with query parameters that indicate dynamic content
  if (url.search.includes('no-cache') || url.search.includes('timestamp')) return false;

  return true;
};





// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('Service Worker installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
        // Don't fail completely, just log the error
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker activation failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle requests that should be cached
  if (!shouldCache(event.request)) {
    return;
  }

  const url = new URL(event.request.url);

  // Handle different types of requests with appropriate caching strategies
  if (event.request.destination === 'document') {
    // For HTML documents, try network first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match('/index.html');
            });
        })
    );
  } else if (event.request.destination === 'image') {
    // For images, try cache first, then network
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return a fallback or empty response for failed image requests
            return new Response('', { status: 404, statusText: 'Image not found' });
          });
        });
      })
    );
  } else if (url.pathname.includes('/api/')) {
    // For API requests, try network first with short cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets (JS, CSS, fonts), try cache first
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                const cacheName = event.request.destination === 'script' ||
                  event.request.destination === 'style' ?
                  RUNTIME_CACHE : CACHE_NAME;

                caches.open(cacheName).then((cache) => {
                  cache.put(event.request, responseClone);
                }).catch((error) => {
                  console.warn('Failed to cache resource:', event.request.url, error);
                });
              }
              return response;
            })
            .catch((error) => {
              console.warn('Failed to fetch resource:', event.request.url, error);
              throw error;
            });
        })
    );
  }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    if (urls && urls.length > 0) {
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(urls);
      }).catch((error) => {
        console.error('Failed to cache URLs:', error);
      });
    }
  }
});

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(
        // Handle background sync tasks here
        console.log('Background sync triggered')
      );
    }
  });
}
