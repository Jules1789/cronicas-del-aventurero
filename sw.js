// Service worker: permite instalar la app y usarla sin conexión.
const CACHE = 'cronicas-v3';
const FONT_CACHE = 'cronicas-fonts';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/avatar.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Responde desde la caché y la actualiza en segundo plano.
function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req, { ignoreSearch: req.mode === 'navigate' }).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached || (req.mode === 'navigate' ? cache.match('./index.html') : undefined));
      return cached || network;
    })
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(staleWhileRevalidate(req, CACHE));
  } else if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(staleWhileRevalidate(req, FONT_CACHE));
  }
});
