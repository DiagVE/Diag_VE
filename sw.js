// Force la suppression immédiate de tous les fichiers en cache de la PWA
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key))); // Supprime TOUS les caches
    }).then(() => self.clients.claim())
  );
});

// Redirige ou bloque les requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});