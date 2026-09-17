const CACHE_NAME = 'pf-cache-v60';

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

// When the user taps a notification (e.g. the end-of-month summary),
// focus an open tab or open the app at the deep-linked screen.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './?action=monthSummary';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          if ('navigate' in client) { try { client.navigate(target); } catch (e) {} }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

// Match on the path, so versioned URLs like app.js?v=59 count as app files too.
function isAppFile(url) {
  const p = new URL(url).pathname;
  return p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('/app.js') || p.endsWith('/manifest.json');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  if (isAppFile(url)) {
    // Network-first, and past the browser's HTTP cache too (GitHub Pages lets browsers keep
    // files for 10 minutes, which kept serving the old app after an update).
    // Fall back to the offline cache only when there's no network.
    event.respondWith(
      fetch(url, { cache: 'no-store', credentials: 'same-origin' })
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
