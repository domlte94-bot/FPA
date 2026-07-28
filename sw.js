const CACHE_NAME = 'pf-cache-v2';

// Files that change when you update the app — always try the network first,
// so you get the latest version automatically. Cache is only a fallback for offline use.
const APP_FILES = ['./', './index.html', './app.js', './manifest.json'];

// Files that rarely/never change — safe to serve from cache first for speed.
const STATIC_FILES = [
  './icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES.concat(STATIC_FILES)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isAppFile(url) {
  return url.endsWith('/') || url.endsWith('/index.html') || url.endsWith('/app.js') || url.endsWith('/manifest.json');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  if (isAppFile(url)) {
    // Network-first: always try to get the newest version. Fall back to cache only if offline.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (icons, pinned CDN libraries)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
