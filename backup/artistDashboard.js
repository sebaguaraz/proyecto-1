document.addEventListener('DOMContentLoaded', async () => {
    const usernameDisplay = document.getElementById('artistName');
    const artistProfileForm = document.getElementById('artistProfileForm');
    const profileMessage = document.getElementById('profileMessage');
    const logoutButton = document.getElementById('logoutButton');

    const showMessage = (message, type) => {
        profileMessage.textContent = message;
        profileMessage.className = `message ${type}`;
        profileMessage.style.display = 'block';
        setTimeout(() => {
            profileMessage.style.display = 'none';
        }, 5000);
    };

    const loadArtistProfile = async () => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('userRole');
        const username = sessionStorage.getItem('username');

        if (!token || !userId || userRole !== 'artist') {
            showMessage('Necesitas iniciar sesión como artista.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        usernameDisplay.textContent = username;

        try {
            const response = await fetch(`/api/artists/profile/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                for (const key in data) {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = data[key] || '';
                    }
                }
                showMessage('Tu perfil fue cargado.', 'success');
            } else {
                showMessage(`Error al cargar tu perfil: ${data.error || 'Desconocido'}`, 'error');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            showMessage('No pudimos conectar para cargar tu perfil.', 'error');
        }
    };

    artistProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('userRole');

        if (!token || !userId || userRole !== 'artist') {
            showMessage('Necesitas iniciar sesión para guardar.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        const formData = new FormData(artistProfileForm);
        const profileData = {};
        for (const [key, value] of formData.entries()) {
            profileData[key] = value === '' ? null : value;
        }

        try {
            const response = await fetch(`/api/artists/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('¡Perfil actualizado con éxito!', 'success');
                loadArtistProfile();
            } else {
                showMessage(`Error al actualizar: ${data.error || 'Desconocido'}`, 'error');
                sessionStorage.clear();
                setTimeout(() => window.location.href = "index.html", 6000);
            }
        } catch (error) {
            console.error('Error de conexión al actualizar:', error);
            showMessage('No pudimos conectar para guardar tu perfil.', 'error');
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        window.location.href = 'index.html';
    });

    loadArtistProfile();
});


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