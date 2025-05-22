// Espera a que todo el contenido HTML de la página se haya cargado completamente.
document.addEventListener('DOMContentLoaded', () => {
    // Busca el formulario de login en el HTML usando su 'id'.
    const loginForm = document.getElementById('loginForm');
    // Busca el div en el HTML donde mostraremos mensajes al usuario, usando su 'id'.
    const loginMessage = document.getElementById('loginMessage');

    // Pequeña función para mostrar mensajes de forma consistente
    function mostrarMensaje(mensaje, tipo = 'danger') { // tipo puede ser 'success' o 'danger'
        loginMessage.innerHTML = mensaje;
        loginMessage.className = `alert alert-${tipo} mt-3`;
    }

    // Verifica si el formulario de login realmente existe en la página.
    if (loginForm) {
        // Agrega un "oyente" al formulario para que, cuando se intente enviar (evento 'submit')...
        loginForm.addEventListener('submit', async (event) => {
            // ...primero, evita que el formulario se envíe de la manera tradicional (que recargaría la página).
            event.preventDefault();
            // Limpia cualquier mensaje anterior y quita clases de alerta.
            loginMessage.innerHTML = '';
            loginMessage.className = 'mt-3'; // Clase base de Bootstrap para margen

            // Obtiene el valor escrito por el usuario en el campo de "username".
            const username = document.getElementById('username').value.trim(); // .trim() quita espacios al inicio y final
            // Obtiene el valor escrito por el usuario en el campo de "password".
            const password = document.getElementById('password').value;

            // Validación simple: Verifica que ambos campos tengan algo escrito.
            if (!username || !password) {
                mostrarMensaje('Por favor, ingresa usuario y contraseña.', 'danger');
                return; // Detiene la ejecución si hay campos vacíos.
            }

            try {
                // Intenta enviar los datos al endpoint '/api/auth/login' de tu backend.
                const response = await fetch('/api/auth/login', { // ¡Asegúrate que esta ruta coincida con tu backend!
                    method: 'POST', // Método HTTP para enviar datos.
                    headers: {
                        'Content-Type': 'application/json', // Avisa al servidor que enviaremos datos en formato JSON.
                    },
                    body: JSON.stringify({ username: username, password: password }), // Convierte los datos a texto JSON.
                });

                const data = await response.json(); // Convierte la respuesta del servidor (JSON) a un objeto JavaScript.

                if (response.ok) { // Si el servidor respondió que todo salió bien (ej: código 200).
                    mostrarMensaje(data.message || '¡Login exitoso! Redirigiendo...', 'success');

                    localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local del navegador.
                    localStorage.setItem('userRole', data.role); // Guarda el rol del usuario.

                    // Espera un poquito y redirige a una página principal (ej. 'home.html').
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500); // Redirige a la misma página de login
                } else { // Si el servidor respondió con un error.
                    mostrarMensaje(data.message || data.error || 'Error en el login. Verifica tus credenciales.', 'danger');
                }
            } catch (error) { // Si ocurre un error durante la comunicación (ej: servidor caído).
                console.error('Error al intentar iniciar sesión:', error);
                mostrarMensaje('Ocurrió un error de conexión. Intenta más tarde.', 'danger');
            }
        });
    }
});