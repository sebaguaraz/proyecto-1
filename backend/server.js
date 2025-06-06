const express = require('express');  // Importa la librería 'express' para crear el servidor web.
const dotenv = require('dotenv');   // Importa la librería 'dotenv' para cargar variables desde el archivo .env.
const authRoutes = require('./routes/authRoutes');  // Importa las rutas relacionadas con la autenticación (registro, login).
const userRoutes = require("./routes/userRoutes"); // Importa las rutas relacionadas con la gestión de usuarios.
const artistRoutes = require("./routes/artistRoutes");
const cors = require('cors');       // Importa 'cors' para permitir peticiones desde diferentes dominios (frontend).
const path = require('path');       // Importa 'path' para manejar rutas de archivos.

dotenv.config();  // Carga las variables de entorno desde el archivo .env.  ¡IMPORTANTE!

const port = process.env.PORT || 3000;  // Define el puerto del servidor. Usa el valor de .env o 3000 por defecto.

const app = express();  // Crea una instancia de la aplicación express.

app.use(cors());  // Usa el middleware 'cors' q permite que nuestro frontend (que podría estar en una dirección diferente) pueda enviarle peticiones a este servidor.

// Si la persona nos envía información en formato JSON (que es como hablamos con nuestro frontend),
// este traductor la convierte a un formato que JavaScript entienda fácilmente.
app.use(express.json());  

// Servir archivos estáticos del frontend al navegador
// Esto le dice a Express que sirva los archivos de tu carpeta 'frontend'
// cuando se acceda a ellos desde el navegador.
// Asume que 'backend' y 'frontend' son carpetas hermanas.
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);  // Asigna las rutas de autenticación bajo el prefijo '/api/auth'.
app.use("/api/users", userRoutes); // Asigna las rutas de usuarios bajo el prefijo "/api/users".
app.use("/api/artists", artistRoutes);

app.listen(port, () => {  // Inicia el servidor y lo pone a escuchar en el puerto especificado.
  console.log(`Servidor corriendo en http://localhost:${port}`);  // Mensaje en la consola cuando el servidor está listo.
  console.log(`Frontend debería estar accesible en http://localhost:${port}`);
});










/**
 * --- Notas Conceptuales para Entender Mejor ---
 *
 * 1.  **Backend (Servidor)**: Es como el "cerebro" o la "cocina" de tu aplicación.
 * Aquí es donde se guarda la información (bases de datos), se procesa la lógica
 * importante (ej. verificar contraseñas, guardar perfiles) y se envían respuestas
 * al frontend (la parte que el usuario ve). No tiene una interfaz visual.
 *
 * 2.  **Frontend (Cliente/Navegador)**: Es la "cara" de tu aplicación, lo que el usuario ve
 * y con lo que interactúa (páginas web, botones, formularios). Está hecho con HTML, CSS y JavaScript.
 * No tiene acceso directo a la base de datos; tiene que "pedirle" la información al backend.
 *
 * 3.  **`express`**: Es un "marco" o "esqueleto" muy popular para construir servidores web en Node.js.
 * Nos da herramientas para manejar las peticiones HTTP (GET, POST, PUT, DELETE),
 * organizar nuestras rutas (direcciones de la API) y servir archivos.
 *
 * 4.  **`dotenv`**: Imagina que tienes un archivo secreto (`.env`) donde guardas cosas que no quieres
 * que nadie vea (como claves secretas de seguridad, o el puerto de tu servidor).
 * `dotenv` es como un "lector de secretos" que lee ese archivo y pone esas cosas disponibles
 * para tu programa.
 *
 * 5.  **`CORS` (Cross-Origin Resource Sharing)**: Es un sistema de seguridad en los navegadores web.
 * Normalmente, una página web en `http://localhost:3000` no podría pedirle datos a un servidor
 * en `http://localhost:5000` (son "orígenes diferentes").
 * El middleware `cors` (que usamos en `app.use(cors())`) le dice al navegador: "¡Está bien!
 * Permite que este frontend hable con este backend, aunque estén en direcciones o puertos diferentes".
 * Esto es muy útil en desarrollo, pero en producción se configura de forma más estricta por seguridad.
 *
 * 6.  **`app.use(...)` (Middleware)**: Es como una serie de "filtros" o "guardias" por los que pasa
 * cada petición que llega a tu servidor. Cada `app.use()` añade un guardia.
 * - `app.use(express.json())`: Un guardia que dice: "Si la petición trae datos en formato JSON,
 * los decodifico para que sean fáciles de usar en JavaScript".
 * - `app.use(express.static(...))`: Un guardia que dice: "Si la petición es para un archivo
 * (como una imagen, un archivo HTML o un archivo CSS/JS), y ese archivo está en esta
 * carpeta, dáselo directamente al navegador".
 * - `app.use('/api/auth', authRoutes)`: Un guardia que dice: "Si la petición empieza con
 * `/api/auth` (ej. `/api/auth/login`), no te la doy a ti, se la paso a las 'rutas de autenticación'
 * para que la manejen".
 *
 * 7.  **Rutas (Routes)**: Son como las diferentes "direcciones" o "puertas" de tu API.
 * Cada ruta (`/api/auth/login`, `/api/artists/profile`) hace una cosa específica.
 * Tenemos archivos separados (`authRoutes.js`, `artistRoutes.js`) para mantener las recetas
 * organizadas y no tener un archivo `server.js` gigantesco.
 *
 * 8.  **`app.listen(port, () => { ... })`**: Este es el comando final que "enciende" el servidor.
 * Le dice a Express: "Empieza a escuchar en este 'puerto' (un número como 3000 o 8080)
 * y espera las peticiones. Cuando estés listo, ejecuta esta pequeña función (el `console.log`)".
 */