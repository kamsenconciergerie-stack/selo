const CACHE_NAME = 'kamsen-pwa-v1';
const urlsToCache = [
  '/',
  '/equipements',
  '/contact',
  '/services',
  '/about',
  '/favicon.svg',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  // API endpoints critiques pour fonctionnement hors ligne
  '/api/equipment',
  '/api/categories',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Kamsen PWA cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prend contrôle immédiatement
  self.clients.claim();
});

// Stratégie de cache : Cache First avec Network Fallback
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes Chrome extension
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Pas en cache, fetch depuis le réseau
        return fetch(event.request).then((response) => {
          // Vérifier si c'est une réponse valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner la réponse pour la mettre en cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Réseau indisponible, servir page hors ligne pour les pages HTML
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// Gestion des notifications push (pour future implémentation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-192x192.png',
      badge: '/favicon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1',
        url: data.url || '/'
      },
      actions: [
        {
          action: 'explore', 
          title: 'Voir détails',
          icon: '/favicon-192x192.png'
        },
        {
          action: 'close', 
          title: 'Fermer',
          icon: '/favicon-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Kamsen', options)
    );
  }
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});