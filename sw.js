// Nom du cache de l'application
const CACHE_NAME = 'diagve-cache-v1';

// Fichiers à mettre en cache pour un accès rapide (hors ligne)
const urlsToCache = [
  'index.html',
  'tarifs.html',
  'contact.html',
  'manifest.json',
  'icon.png'
];

// Installation du Service Worker et mise en cache initiale
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force l'installation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation et nettoyage des anciens caches obsolètes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Supprime l'ancien cache pour forcer la fraîcheur
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Prend le contrôle immédiat de la page
    })
  );
});

// Interception des requêtes réseau pour charger les pages rapidement
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne le fichier du cache s'il existe, sinon va le chercher sur le réseau
        return response || fetch(event.request);
      })
  );
});