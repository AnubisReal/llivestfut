const CACHE_NAME = 'v1.3'; // Nombre de la caché
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

// ==========================
// Notificaciones Push
// ==========================

// Función para obtener el contenido del archivo de mensaje
async function getMessage() {
    try {
        const response = await fetch('/message.txt'); // Obtiene el contenido del archivo message.txt
        return await response.text(); // Retorna el contenido como texto
    } catch (error) {
        console.error('Error al obtener el mensaje:', error);
        return 'No se pudo cargar el mensaje de notificación.';
    }
}

// Registrar evento push para mostrar notificaciones
self.addEventListener('push', async (event) => {
    const message = await getMessage();  // Leer el contenido del archivo

    const options = {
        body: message, // Mostrar el mensaje obtenido de message.txt
        icon: '/icon.png',  // Asegúrate de tener un icono para la notificación
        badge: '/badge.png' // Puedes tener una insignia opcional
    };

    event.waitUntil(
        self.registration.showNotification('Notificación Automática', options)
    );
});
