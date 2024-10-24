importScripts("https://js.pusher.com/beams/service-worker.js");

const CACHE_NAME = 'v1.1'; // Nombre de la caché
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/escudos/barcelona.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
    // Agrega aquí más recursos que desees almacenar en caché
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Cacheando archivos');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activado...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Borrando caché antigua', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Estrategia 'stale-while-revalidate' para solicitudes de red
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Interceptando la solicitud a', event.request.url);
    
    // Estrategia para solicitudes de 'video' (no se almacena en caché)
    if (event.request.destination === 'video') {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Estrategia 'stale-while-revalidate' para otras solicitudes
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Actualiza la caché con la nueva versión del recurso
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                // Devuelve la versión caché si está disponible, pero actualiza en segundo plano
                return cachedResponse || fetchPromise;
            });
        })
    );
});
