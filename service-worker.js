self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activado...');
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Interceptando la solicitud a', event.request.url);
});
