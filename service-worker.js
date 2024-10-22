const CACHE_NAME = 'v1.4'; // Cambia manualmente el nombre de la caché para forzar la actualización
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/escudos/barcelona.png', // Incluye tus recursos aquí
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
    // Agrega aquí más recursos que desees almacenar en caché
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    self.skipWaiting(); // Forzar la activación inmediata del nuevo Service Worker
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
    return self.clients.claim(); // Tomar control inmediatamente de las pestañas abiertas
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Interceptando la solicitud a', event.request.url);
    // Solo manejar el almacenamiento en caché para las solicitudes que no son de video
    if (event.request.destination !== 'video') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                // Devuelve el recurso desde la caché si está disponible, si no, realiza la solicitud de red
                return response || fetch(event.request);
            })
        );
    } else {
        // Si la solicitud es de video, simplemente realiza la solicitud de red
        event.respondWith(fetch(event.request));
    }
});

// Detección de nueva versión del Service Worker
self.addEventListener('controllerchange', () => {
    console.log('Nueva versión del Service Worker activada, recargando la página...');
    window.location.reload(); // Recargar la página para cargar la nueva versión
});
