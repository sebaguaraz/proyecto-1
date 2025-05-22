// Espera a que todo el contenido HTML de la página se haya cargado completamente.
document.addEventListener('DOMContentLoaded', () => {
    // Busca el formulario de registro en el HTML usando su 'id'.
    const registerForm = document.getElementById('registerForm');
    // Busca el div en el HTML donde mostraremos mensajes al usuario, usando su 'id'.
    const registerMessage = document.getElementById('registerMessage');

    // Pequeña función para mostrar mensajes de forma consistente
    function mostrarMensaje(mensaje, tipo = 'danger') { // tipo puede ser 'success' o 'danger'
        registerMessage.innerHTML = mensaje;
        registerMessage.className = `alert alert-${tipo} mt-3`;
    }

    // Verifica si el formulario de registro realmente existe en la página.
    if (registerForm) {
        // Agrega un "oyente" al formulario para que, cuando se intente enviar (evento 'submit')...
        registerForm.addEventListener('submit', async (event) => {
            // ...primero, evita que el formulario se envíe de la manera tradicional (que recargaría la página).
            event.preventDefault();
            // Limpia cualquier mensaje anterior y quita clases de alerta.
            registerMessage.innerHTML = '';
            registerMessage.className = 'mt-3'; // Clase base de Bootstrap para margen

            // Obtiene el valor escrito por el usuario en el campo de "username".
            const username = document.getElementById('username').value.trim();
            // Obtiene el valor escrito por el usuario en el campo de "password".
            const password = document.getElementById('password').value;
            // Obtiene el valor escrito por el usuario en el campo de "confirmPassword".
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validación: Verifica que todos los campos tengan algo escrito.
            if (!username || !password || !confirmPassword) {
                mostrarMensaje('Todos los campos son obligatorios.', 'danger');
                return; // Detiene la ejecución.
            }

            // Validación: Verifica que las dos contraseñas ingresadas sean idénticas.
            if (password !== confirmPassword) {
                mostrarMensaje('Las contraseñas no coinciden.', 'danger');
                return; // Detiene la ejecución.
            }

            try {
                // Intenta enviar los datos al endpoint '/api/auth/register' de tu backend.
                // Tu backend asignará el rol 'artist' automáticamente.
                const response = await fetch('/api/auth/register', { // ¡Asegúrate que esta ruta coincida con tu backend!
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username, password: password }), // Solo enviamos username y password
                });

                const data = await response.json();

                if (response.ok) {
                    mostrarMensaje(data.message || '¡Registro exitoso! Redirigiendo a login...', 'success');
                    setTimeout(() => { window.location.href = 'index.html'; }, 2000); // Redirige a la página de login.
                } else {
                    mostrarMensaje(data.message || data.error || 'Error en el registro. Inténtalo de nuevo.', 'danger');
                }
            } catch (error) {
                console.error('Error al intentar registrar:', error);
                mostrarMensaje('Ocurrió un error de conexión. Intenta más tarde.', 'danger');
            }
        });
    }
});