// Este es el "cerebro" de la página del artista.
// Aquí le decimos a la página qué hacer.

// Primero, esperamos a que la página se cargue por completo (como cuando abres un libro).
document.addEventListener('DOMContentLoaded', async () => {

    // --- Parte 1: Encontrar las "piezas" importantes en la página ---
    // Buscamos el lugar donde mostraremos el nombre del artista (ej. "Hola, Pepe").
    const usernameDisplay = document.getElementById('usernameDisplay');

    // Buscamos el formulario donde el artista cambiará sus datos (foto, biografía, etc.).
    const artistProfileForm = document.getElementById('artistProfileForm');

    // Buscamos el lugar donde mostraremos mensajes (ej. "Guardado exitoso" o "Error").
    const profileMessage = document.getElementById('profileMessage');

    // Buscamos el botón para "Cerrar Sesión".
    const logoutButton = document.getElementById('logoutButton');


    // --- Parte 2: Una función para mostrar mensajes bonitos ---
    // Esta función nos ayuda a que los mensajes de la página se vean bien.
    // 'message' es el texto que queremos mostrar (ej. "¡Guardado!").
    // 'type' nos dice si es un mensaje de 'success' (verde, salió bien) o 'error' (rojo, algo falló).
    const showMessage = (message, type) => {
        profileMessage.textContent = message;          // Ponemos el texto en el lugar del mensaje.
        profileMessage.className = `message ${type}`;  // Le damos un color (verde o rojo).
        profileMessage.style.display = 'block';        // Hacemos que el mensaje sea visible.

        // Después de 5 segundos, el mensaje se esconde solito.
        setTimeout(() => {
            profileMessage.style.display = 'none';
        }, 5000);
    };


    // --- Parte 3: Traer los datos del artista desde el servidor ---
    // Esta es una "receta" para ir a buscar la información del artista a nuestro "cerebro" principal (el backend).
    const loadArtistProfile = async () => {
        // Conseguimos la "tarjeta de identificación" (el token) del artista que inició sesión.
        const token = sessionStorage.getItem('token');
        // Conseguimos el ID del artista (su número de identificación único).
        const userId = sessionStorage.getItem('userId');
        // Conseguimos el rol del usuario (para asegurarnos que es un artista).
        const userRole = sessionStorage.getItem('userRole');
        // Conseguimos el nombre de usuario.
        const username = sessionStorage.getItem('username');

        // Si no tenemos la tarjeta de identificación o no es un artista, no podemos entrar.
        // Lo mandamos de vuelta a la página de inicio para que inicie sesión.
        if (!token || !userId || userRole !== 'artist') {
            showMessage('Necesitas iniciar sesión como artista.', 'error'); // Mensaje de error para el usuario.
            setTimeout(() => {
                window.location.href = 'index.html'; // Volvemos a la página de inicio.
            }, 2000);
            return; // Paramos aquí, no seguimos.
        }

        // Mostramos el nombre del artista en la parte de arriba de la página (ej. "Hola, Pepe").
        usernameDisplay.textContent = username;


        try {
            // Le pedimos al "cerebro" principal (servidor) los datos de este artista usando su ID.
            const response = await fetch(`/api/artists/profile/${userId}`, {
                method: 'GET', // Le decimos que queremos OBTENER datos.
                headers: {
                    'Authorization': `Bearer ${token}`, // Le mostramos nuestra "tarjeta de identificación".
                    'Content-Type': 'application/json' // Decimos que esperamos datos en un formato especial.
                }
            });

            // Recogemos la información que nos envía el servidor.
            const data = await response.json();

            // Si el servidor nos dice que todo salió bien (código 200 OK)...
            if (response.ok) {
                // Llenamos cada cajita del formulario con la información que nos llegó.
                // Por ejemplo, si nos llega 'bio', buscamos la cajita con id 'bio' y ponemos el texto.
                for (const key in data) { // 'key' es como 'photo_url', 'bio', etc.
                    const input = document.getElementById(key); // Buscamos la cajita con ese nombre.
                    if (input) { // Si la cajita existe...
                        input.value = data[key] || ''; // Ponemos el valor. Si no hay valor, ponemos nada.
                    }
                }
                showMessage('Tu perfil fue cargado.', 'success'); // Mensaje de éxito.
            } else {
                // Si el servidor nos dice que hubo un problema...
                showMessage(`Error al cargar tu perfil: ${data.error || 'Desconocido'}`, 'error'); // Mensaje de error.
            }

        } catch (error) {
            // Si no pudimos ni siquiera hablar con el servidor (ej. se cayó internet)...
            console.error('Error de conexión:', error); // Lo mostramos en la consola del programador.
            showMessage('No pudimos conectar para cargar tu perfil.', 'error'); // Mensaje de error para el usuario.
        }

    };


    // --- Parte 4: Cuando el artista guarda sus cambios en el formulario ---
    // Cuando el artista hace clic en "Actualizar Perfil"...
    artistProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se reinicie (como un reset).

        // Volvemos a conseguir la "tarjeta de identificación" y el ID del artista.
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('userRole');

        // Si no tenemos la tarjeta de identificación o no es un artista, no podemos guardar.
        if (!token || !userId || userRole !== 'artist') {
            showMessage('Necesitas iniciar sesión para guardar.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        // Recopilamos toda la información que el artista escribió en el formulario.
        const formData = new FormData(artistProfileForm);
        const profileData = {}; // Creamos una cajita vacía para guardar los datos.
        for (const [key, value] of formData.entries()) {
            // Para cada cosa que escribió (ej. 'bio', 'photo_url'), la ponemos en nuestra cajita.
            if (value === '') { // Si el valor que escribió está vacío...
                profileData[key] = null; // ...guardamos "nada" (null) en nuestra cajita.
            } else { // Si no está vacío...
                profileData[key] = value; // ...guardamos el valor que escribió.
            }
        }

        try {
            // Le pedimos al "cerebro" principal que GUARDE (actualice) los datos de este artista.
            const response = await fetch(`/api/artists/profile/${userId}`, {
                method: 'PUT', // Le decimos que queremos ACTUALIZAR datos.
                headers: {
                    'Authorization': `Bearer ${token}`, // Le mostramos nuestra "tarjeta de identificación".
                    'Content-Type': 'application/json' // Decimos que le enviamos datos en un formato especial.
                },
                body: JSON.stringify(profileData) // Enviamos los datos que el artista escribió.
            });

            // Recogemos la respuesta del servidor.
            const data = await response.json(); // ¡Aquí también corregí el nombre de 'dta' a 'data' para consistencia!
            
            // Si el servidor nos dice que todo salió bien...
            if (response.ok) {
                showMessage('¡Perfil actualizado con éxito!', 'success'); // Mensaje de éxito.
                loadArtistProfile(); // Volvemos a cargar el perfil para ver los cambios al instante.
            } else {
                showMessage(`Error al actualizar: ${data.error || 'Desconocido'}`, 'error'); // Mensaje de error.
                
                sessionStorage.clear(); //elimina todo el almacenamiento del sessionstorage
                // Si hubo un error al guardar...
                
                setTimeout(() => window.location.href = "index.html", 6000);
        
            }
        } catch (error) {
            // Si no pudimos hablar con el servidor para guardar...
            console.error('Error de conexión al actualizar:', error);
            showMessage('No pudimos conectar para guardar tu perfil.', 'error');
        }

    });


    // --- Parte 5: Cuando el artista hace clic en "Cerrar Sesión" ---
    // Cuando el artista hace clic en este botón...
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evitamos que el navegador haga algo por defecto.

        // Borramos la "tarjeta de identificación" y los datos del artista del navegador.
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');

        // Lo mandamos de vuelta a la página de inicio (login).
        window.location.href = 'index.html';
    });


    // --- Parte 6: ¡Empezar! ---
    // Cuando la página está lista, lo primero que hacemos es cargar el perfil del artista.
    loadArtistProfile();


})

/**
 * --- Notas Conceptuales para Entender Mejor ---
 *
 * 1.  `document.addEventListener('DOMContentLoaded', ...)`:
 * Imagina que tu página HTML es un dibujo. Este código dice: "Espera a que todo el dibujo esté completo
 * y listo para ser usado, y SOLO ENTONCES, empieza a buscar los botones y formularios".
 * Esto evita errores donde el JavaScript intenta encontrar algo que aún no se ha dibujado en la pantalla.
 *
 * 2.  `const algunElemento = document.getElementById('suId')`:
 * Esto es como decirle a JavaScript: "Ve y busca en la página HTML el elemento que tiene este 'ID'
 * (como si fuera su nombre único) y guárdamelo para que pueda trabajar con él".
 * Por ejemplo, `usernameDisplay` es el lugar donde mostraremos el nombre del artista.
 *
 * 3.  `sessionStorage.getItem("clave")`:
 * `sessionStorage` es un "cajón de guardar secretos" en tu navegador. Puedes guardar información
 * (como tu token, tu ID, tu rol) para que no se pierda si cierras y abres el navegador,
 * o si vas a otra página de la misma aplicación.
 * - `getItem` es para "sacar algo del cajón".
 * - `removeItem` es para "borrar algo del cajón".
 * Es útil para mantener el estado de "sesión iniciada" del usuario y sus datos clave.
 *
 * 4.  `if (!token || !userId || userRole !== 'artist')`:
 * Esta es una "puerta de seguridad". Dice: "Si no tengo la 'tarjeta de identificación' (token),
 * o no sé quién eres (userId), o no eres un 'artista', entonces no puedes entrar aquí. ¡Vuelve al inicio!"
 * El `!` significa "NO". `||` significa "O".
 *
 * 5.  `fetch('url', { ... })`:
 * `fetch` es la forma moderna de JavaScript para "ir a buscar" o "enviar" datos a un servidor.
 * Es como un mensajero que lleva un paquete (tus datos) a una dirección (`url`)
 * y espera otro paquete de vuelta (la respuesta del servidor).
 * - `method: 'GET'`: Le dice al mensajero que va a "OBTENER" datos del servidor.
 * - `method: 'PUT'`: Le dice al mensajero que va a "ACTUALIZAR" datos en el servidor.
 * - `headers: { 'x-auth-token': token }`: Es como mostrar tu "tarjeta de identificación" al servidor
 * para que sepa que eres un usuario válido y con permisos.
 * - `headers: { 'Content-Type': 'application/json' }`: Le dice al mensajero que el paquete que lleva o espera
 * es de tipo JSON (un formato de texto especial que el servidor y JavaScript entienden bien).
 * - `body: JSON.stringify(profileData)`: Convierte tus datos de perfil a ese formato JSON antes de enviarlos.
 *
 * 6.  `response.json()` y `data.propiedad`:
 * Cuando el servidor responde, a menudo lo hace en formato JSON.
 * `response.json()` es como decir: "Toma la respuesta del servidor y conviértela en un objeto de JavaScript
 * para que pueda leer fácilmente sus partes, como 'message', 'photo_url', 'bio'".
 * Luego, puedes acceder a esas partes como `data.message` o `data.photo_url`.
 *
 * 7.  `for (const key in data)` y `for (const [key, value] of formData.entries())`:
 * Estas son formas de "recorrer" colecciones de cosas.
 * - `for (const key in data)`: Útil para objetos JSON (como los datos de tu perfil). Dice: "Para cada 'nombre' (key)
 * que encuentres en mis 'datos' (data), haz algo".
 * - `for (const [key, value] of formData.entries())`: Útil para formularios. Dice: "Para cada 'par'
 * (nombre del campo y su valor) que encuentre en el formulario, haz algo".
 *
 * 8.  `input.value = data[key] || '';`:
 * Esta es una forma corta de decir: "Pon el valor de 'data[key]' (ej. la biografía) en la cajita del formulario.
 * Pero si 'data[key]' está vacío o no existe, entonces pon una cadena de texto vacía ('') en la cajita".
 *
 * 9.  `try { ... } catch (error) { ... }`:
 * Es como una "red de seguridad".
 * - `try`: "Intenta hacer esto (hablar con el servidor)".
 * - `catch`: "Si algo sale mal (ej. no hay internet, el servidor no responde), ¡no dejes que la aplicación se caiga!
 * Atrapa el error y haz esto otro (muestra un mensaje de error al usuario y al programador)".
 * Esto hace que tu aplicación sea más robusta y no se rompa fácilmente.
 *
 * 10. `window.location.href = 'index.html'`:
 * Esto es simplemente la forma de decirle al navegador: "Ve a esta otra página ahora mismo".
 * Lo usamos para redirigir al usuario (ej. después de cerrar sesión o si no está autorizado).
 */