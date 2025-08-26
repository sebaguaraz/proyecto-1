// Este es el "cerebro" de la página de inicio de sesión (Login).
// Le dice a la página cómo reaccionar cuando alguien intenta entrar a su cuenta.

// Primero, esperamos a que toda la página HTML esté lista (como abrir un libro y esperar que se muestren todas las páginas).
document.addEventListener('DOMContentLoaded', () => {

    // --- Parte 1: Encontrar las "piezas" importantes en la página ---
    // Buscamos el formulario donde la gente escribe su usuario y contraseña.
    const loginForm = document.getElementById('loginForm');
    // Buscamos el lugar donde mostraremos mensajes (ej. "¡Bienvenido!" o "Contraseña incorrecta").
    const loginMessage = document.getElementById('loginMessage');

    // --- Parte 2: Una función para mostrar mensajes bonitos ---
    // Esta función nos ayuda a que los mensajes se vean ordenados y con el color correcto.
    // 'mensaje' es el texto que queremos mostrar.
    // 'tipo' nos dice si es un mensaje de 'success' (verde, salió bien) o 'danger' (rojo, algo falló).
    function mostrarMensaje(mensaje, tipo = 'danger') {
        loginMessage.textContent = mensaje; // Ponemos el texto dentro del lugar para mensajes.
        loginMessage.className = `alert alert-${tipo} mt-3`; // Le damos el estilo de color (verde o rojo) y un poco de espacio.
    }

    // --- Parte 3: ¿Qué pasa cuando alguien intenta enviar el formulario de login? ---
    // Verificamos que realmente tengamos un formulario de login en esta página.
    if (loginForm) {
        // Le decimos al formulario que, cuando alguien haga clic en "Login" (o presione Enter),
        // no haga lo que haría normalmente (que es recargar la página), sino que espere nuestras instrucciones.
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Detenemos la recarga de la página.

            // Limpiamos cualquier mensaje viejo para que no moleste.
            loginMessage.textContent = '';
            loginMessage.className = 'mt-3'; // Volvemos a ponerle el espacio inicial.

            // Agarramos lo que la persona escribió en el campo de "Usuario".
            const username = document.getElementById('username').value.trim(); // .trim() quita espacios de sobra al inicio y final.
            // Agarramos lo que la persona escribió en el campo de "Contraseña".
            const password = document.getElementById('password').value;

            // --- Parte 4: Una pequeña "prueba" antes de enviar los datos ---
            // Si la persona no escribió nada en usuario o contraseña...
            if (!username || !password) {
                mostrarMensaje('Por favor, ingresa usuario y contraseña.', 'danger'); // Le pedimos que los llene.
                return; // Y no seguimos con el login.
            }

            // --- Parte 5: Hablar con el "cerebro" principal (el servidor/backend) ---
            try {
                // Intentamos enviar el usuario y la contraseña al servidor, a su "puerta de login".
                const response = await fetch('/api/auth/login', {
                    method: 'POST', // Le decimos al servidor que le estamos ENVIANDO datos.
                    headers: {
                        'Content-Type': 'application/json', // Le avisamos al servidor que los datos van en un formato especial (JSON).
                    },
                    body: JSON.stringify({ username: username, password: password }), // Convertimos nuestros datos a ese formato especial (JSON).
                });

                // Recogemos la respuesta del servidor (ej. si el login fue exitoso o no).
                const data = await response.json(); // Convertimos la respuesta del servidor de JSON a algo que JavaScript entienda.

                // --- Parte 6: ¿Qué nos respondió el servidor? ---
                // Si el servidor nos dice que todo salió bien (código 200 OK)...
                if (response.ok) {
                    mostrarMensaje(data.message || '¡Login exitoso! Redirigiendo...', 'success'); // Mostramos un mensaje verde de éxito.

                    // ¡Guardamos las "llaves" y la "identificación" del usuario en el navegador!
                    // Guardamos el 'token' (es como un pasaporte que nos permite acceder a otras partes).
                    sessionStorage.setItem('token', data.token);
                    // Guardamos el 'rol' (si es artista, fan, etc.).
                    sessionStorage.setItem('userRole', data.role);
                    // Guardamos el 'nombre de usuario' para mostrarlo luego (ej. "Hola, Pepe").
                    sessionStorage.setItem('username', data.username);
                    // Guardamos el 'ID del usuario' (su número de identificación único). ¡Esto es clave para el dashboard del artista!
                    sessionStorage.setItem('userId', data.userId);

                    // Esperamos un poquito (1.5 segundos) para que la persona vea el mensaje de éxito.
                    setTimeout(() => {
                        // Después de esperar, decidimos a dónde enviarlo según su 'rol'.
                        if (data.role === 'artist') {
                            window.location.href = 'artistDashboard.html'; // Si es artista, lo mandamos a su dashboard especial.
                        } else if(data.role === 'admin'){
                            window.location.href = 'adminDashboard.html'; // Si no es artista (quizás un fan), lo mandamos a un dashboard general.
                        }
                    }, 1500); // El tiempo que esperamos.

                } else { // Si el servidor nos dice que hubo un error (ej. contraseña incorrecta)...
                    mostrarMensaje(data.error || 'Error en el login. Verifica tus credenciales.', 'danger'); // Mostramos un mensaje rojo de error.
                }
            } catch (error) { // Si algo sale mal al intentar hablar con el servidor (ej. internet se cayó)...
                console.error('Error al intentar iniciar sesión:', error); // Le decimos al programador qué pasó.
                mostrarMensaje('Ocurrió un error de conexión. Intenta más tarde.', 'danger'); // Le decimos al usuario que hubo un problema de conexión.
            }
        });
    }
});

/**
 * --- Notas Conceptuales para Entender Mejor ---
 *
 * 1.  `document.addEventListener('DOMContentLoaded', ...)`:
 * Imagina que tu página HTML es un dibujo. Este código dice: "Espera a que todo el dibujo esté completo
 * y listo para ser usado, y SOLO ENTONCES, empieza a buscar los botones y formularios".
 * Esto evita errores donde el JavaScript intenta encontrar algo que aún no se ha dibujado en la pantalla.
 *
 * 2.  `event.preventDefault()`:
 * Cuando envías un formulario en una página web normal, el navegador recarga la página.
 * `preventDefault()` es como decir: "¡Alto! No recargues la página. Yo (el JavaScript) me encargo de enviar los datos
 * y de decirte qué hacer después, sin recargarla". Esto hace que la aplicación se sienta más rápida y moderna.
 *
 * 3.  `fetch('/api/auth/login', { ... })`:
 * `fetch` es la forma moderna de JavaScript para "ir a buscar" o "enviar" datos a un servidor.
 * Es como un mensajero que lleva un paquete (tus datos) a una dirección (`/api/auth/login`)
 * y espera otro paquete de vuelta (la respuesta del servidor).
 * - `method: 'POST'`: Le dice al mensajero que va a "enviar" datos nuevos.
 * - `headers: { 'Content-Type': 'application/json' }`: Le dice al mensajero: "El paquete que llevo es de tipo JSON".
 * - `body: JSON.stringify(...)`: Convierte tus datos de usuario y contraseña en un formato de texto especial llamado JSON,
 * que el servidor entiende fácilmente.
 *
 * 4.  `response.json()` y `data.message`, `data.token`, etc.:
 * Cuando el servidor responde, a menudo lo hace en formato JSON (un lenguaje que tanto el servidor como JavaScript entienden).
 * `response.json()` es como decir: "Toma la respuesta del servidor y conviértela en un objeto de JavaScript
 * para que pueda leer fácilmente sus partes, como 'message', 'token', 'role', 'userId'".
 *
 * 5.  `sessionStorage.setItem('clave', 'valor')` y `sessionStorage.getItem('clave')`:
 * `sessionStorage` es un "cajón de guardar secretos" en tu navegador. Puedes guardar información
 * (como tu token, tu ID, tu rol) para que no se pierda si cierras y abres el navegador,
 * o si vas a otra página de la misma aplicación.
 * - `setItem` es para "poner algo en el cajón".
 * - `getItem` es para "sacar algo del cajón".
 * Es útil para mantener el estado de "sesión iniciada" del usuario.
 *
 * 6.  `window.location.href = 'otra_pagina.html'`:
 * Esto es simplemente la forma de decirle al navegador: "Ve a esta otra página ahora mismo".
 * Lo usamos para redirigir al usuario después de iniciar sesión.
 *
 * 7.  `try { ... } catch (error) { ... }`:
 * Es como una "red de seguridad".
 * - `try`: "Intenta hacer esto (hablar con el servidor)".
 * - `catch`: "Si algo sale mal (ej. no hay internet, el servidor no responde), ¡no dejes que la aplicación se caiga!
 * Atrapa el error y haz esto otro (muestra un mensaje de error al usuario y al programador)".
 * Esto hace que tu aplicación sea más robusta y no se rompa fácilmente.
 */