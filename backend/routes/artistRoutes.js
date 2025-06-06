// backend/routes/artistRoutes.js

// Importamos el módulo 'express' para crear y manejar las rutas.
const express = require("express");
// Creamos una nueva instancia de 'Router' de Express.
// Este objeto nos permite definir rutas de manera modular que luego se pueden usar en 'server.js'.
const router = express.Router();

// Importamos el controlador de artistas.
// Este controlador contiene las funciones de lógica de negocio (qué hacer cuando se accede a una ruta).
const artistController = require("../controllers/artistController");

// Importamos los middlewares de autenticación y autorización.
// 'protect' se encarga de verificar que un usuario esté logueado y su token JWT sea válido.
// 'authorize' se encarga de verificar que el usuario logueado tenga un rol específico (ej. 'admin').
const { protect, authorize } = require("../middlewares/authMiddleware");

// --- DEFINICIÓN DE RUTAS PARA EL DASHBOARD DEL ARTISTA ---

// 1. Ruta para OBTENER (leer) el perfil de un artista específico.
// Tipo de Petición: GET (se usa para solicitar datos)
// URL: /api/artists/profile/:id
// - ':id' es un parámetro dinámico. Representa el user_id del artista cuyo perfil se quiere obtener.
//   Cuando recibimos una petición a esta URL, Express extrae ese ':id' y lo pone en 'req.params.id'.
//
// Flujo:
// - Primero, 'protect' se ejecuta: Verifica si el usuario está autenticado. Si no, deniega el acceso.
// - Si 'protect' pasa, entonces 'artistController.getArtistProfile' se ejecuta:
//   Contiene la lógica para buscar el perfil en la DB y enviarlo, incluyendo las comprobaciones de seguridad
//   (si el usuario logueado tiene permiso para ver ese perfil específico).
router.get("/profile/:id", protect, artistController.getArtistProfile);


// 2. Ruta para ACTUALIZAR (modificar) el perfil de un artista específico.
// Tipo de Petición: PUT (se usa para actualizar completamente un recurso, o PATCH para actualización parcial)
// URL: /api/artists/profile/:id
// - ':id' es el user_id del artista cuyo perfil se va a actualizar.
//   Los datos a actualizar se envían en el cuerpo de la petición (req.body).
//
// Flujo:
// - Primero, 'protect' se ejecuta: Asegura que el usuario esté autenticado.
// - Si 'protect' pasa, entonces 'artistController.updateArtistProfile' se ejecuta:
//   Contiene la lógica para actualizar los datos del perfil en la DB, y las comprobaciones de seguridad
//   (si el usuario logueado tiene permiso para modificar ese perfil).
router.put("/profile/:id", protect, artistController.updateArtistProfile);


// 3. Ruta para OBTENER TODOS los perfiles de artistas.
// Tipo de Petición: GET
// URL: /api/artists/all
// Esta ruta es útil para un panel de administración donde se quiera listar todos los artistas.
//
// Flujo:
// - Primero, 'protect' se ejecuta: Asegura que el usuario esté autenticado.
// - Luego, 'authorize(["admin"])' se ejecuta: Verifica que el usuario autenticado tenga el rol de 'admin'.
//   Si no es 'admin', deniega el acceso. Solo si es 'admin' la petición continúa.
// - Si 'authorize' pasa, entonces 'artistController.findAll' se ejecuta:
//   Contiene la lógica para obtener todos los perfiles de artistas de la base de datos y enviarlos.
router.get("/all", protect, authorize(["admin"]), artistController.findAll);


// Exportamos este objeto 'router' para que pueda ser importado en 'server.js'.
// Esto permite que el servidor principal conozca y utilice estas rutas.
module.exports = router;