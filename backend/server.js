const express = require('express');  // Importa la librería 'express' para crear el servidor web.
const dotenv = require('dotenv');   // Importa la librería 'dotenv' para cargar variables desde el archivo .env.
const authRoutes = require('./routes/authRoutes');  // Importa las rutas relacionadas con la autenticación (registro, login).
const userRoutes = require("./routes/userRoutes"); // Importa las rutas relacionadas con la gestión de usuarios.
const cors = require('cors');       // Importa 'cors' para permitir peticiones desde diferentes dominios (frontend).
const path = require('path');       // Importa 'path' para manejar rutas de archivos.

dotenv.config();  // Carga las variables de entorno desde el archivo .env.  ¡IMPORTANTE!

const port = process.env.PORT || 3000;  // Define el puerto del servidor. Usa el valor de .env o 3000 por defecto.

const app = express();  // Crea una instancia de la aplicación express.

app.use(cors());  // Usa el middleware 'cors' para permitir todas las peticiones (¡CUIDADO en producción!).
app.use(express.json());  // Usa middleware para analizar el cuerpo de las peticiones como JSON.

// Servir archivos estáticos del frontend
// Esto le dice a Express que sirva los archivos de tu carpeta 'frontend'
// cuando se acceda a ellos desde el navegador.
// Asume que 'backend' y 'frontend' son carpetas hermanas.
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);  // Asigna las rutas de autenticación bajo el prefijo '/api/auth'.
app.use("/api/users", userRoutes); // Asigna las rutas de usuarios bajo el prefijo "/api/users".

app.listen(port, () => {  // Inicia el servidor y lo pone a escuchar en el puerto especificado.
  console.log(`Servidor corriendo en http://localhost:${port}`);  // Mensaje en la consola cuando el servidor está listo.
  console.log(`Frontend debería estar accesible en http://localhost:${port}`);
});