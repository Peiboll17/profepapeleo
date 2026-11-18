/* Service worker de ProfePapeleo: app offline-first.
   Estrategia: precache del shell; network-first para navegaciones
   (con fallback a la caché) y cache-first para assets con hash. */
const CACHE = 'profepapeleo-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html', './manifest.webmanifest'])),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Assets con hash: cache-first (inmutables)
  if (request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            const copia = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copia));
            return res;
          }),
      ),
    );
    return;
  }

  // Navegación y demás: network-first con fallback a caché (offline)
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copia));
        return res;
      })
      .catch(() => caches.match(request).then((hit) => hit ?? caches.match('./index.html'))),
  );
});
