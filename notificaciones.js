
// solicitarPermisoNotificaciones.js

// Solicitar permiso para las notificaciones
function solicitarPermisoNotificaciones() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso de notificaciones concedido.');
            } else {
                console.log('Permiso de notificaciones denegado.');
            }
        });
    }
}

// Leer el archivo notificaciones.txt y mostrar notificaciones
function leerNotificaciones() {
    fetch('notificaciones.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo: ' + response.statusText);
            }
            return response.text(); // Obtener el texto del archivo
        })
        .then(data => {
            const notificaciones = JSON.parse(data);
            const ahora = new Date();
            const horaActual = `${ahora.getHours()}:${ahora.getMinutes() < 10 ? '0' + ahora.getMinutes() : ahora.getMinutes()}`;

            // Comprobar si la hora actual coincide con la hora de la notificación
            if (notificaciones.time === horaActual) {
                mostrarNotificacion(notificaciones.message);
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = new Notification('Notificación', {
        body: mensaje,
        icon: 'escudos/barcelona.png' // Cambia la ruta del icono si es necesario
    });

    notificacion.onclick = function() {
        window.focus(); // Opcional: traer la ventana al frente
    };
}

// Función principal para inicializar
function inicializarNotificaciones() {
    solicitarPermisoNotificaciones(); // Solicitar permiso al cargar
    setInterval(leerNotificaciones, 60000); // Verificar cada minuto
}

// Llamar a inicializarNotificaciones desde index.html
