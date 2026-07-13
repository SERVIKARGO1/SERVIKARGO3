// ServiKargo Service Worker v2.0
const CACHE = 'servikargo-v2';
const STATIC = [
  '/SERVIKARGO2/',
  '/SERVIKARGO2/index.html',
  '/SERVIKARGO2/manifest.json',
  '/SERVIKARGO2/icon-192.png',
  '/SERVIKARGO2/icon-512.png',
  '/SERVIKARGO2/icon-192-maskable.png',
  '/SERVIKARGO2/icon-512-maskable.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
