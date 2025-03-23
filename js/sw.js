// Service Worker for "Python শিখি বাংলায়" website
// This file provides offline functionality

const CACHE_NAME = 'python-bangla-v1.5';

// Function to get base URL for better path resolution
function getBaseUrl() {
  return self.location.pathname.replace(/\/js\/sw\.js$/, '/');
}

const BASE_URL = getBaseUrl();

const CACHED_URLS = [
  BASE_URL,
  BASE_URL + 'index.html',
  BASE_URL + 'pages/lesson1.html',
  BASE_URL + 'pages/lesson2.html',
  BASE_URL + 'pages/lesson3.html',
  BASE_URL + 'pages/offline.html',
  BASE_URL + 'css/style.css',
  BASE_URL + 'js/script.js',
  BASE_URL + 'js/font-loading.js',
  BASE_URL + 'css/font-loading.css',
  BASE_URL + 'favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache all required resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache all URLs needed for offline functionality
        return cache.addAll(CACHED_URLS);
      })
      .then(() => {
        // Force activation of the service worker immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        // Try to fetch from network
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to put in cache
            const responseToCache = response.clone();
            
            // Add the new response to cache for next time
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch((error) => {
            console.log('Fetch failed; returning offline page instead.', error);
            
            // For navigation requests, show the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(BASE_URL + 'pages/offline.html');
            }
            
            // For image requests, you could return a default offline image
            // For other resources, just return the error
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
}); 