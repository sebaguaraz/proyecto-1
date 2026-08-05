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
router.get("/profile/:id", protect, authorize(["admin", "artist"]), artistController.getArtistProfile);
// router.get("/profile/:id", artistController.getArtistProfile);


router.put("/profile/:id", protect, authorize(["artist", "admin"]), artistController.updateArtistProfile);


router.get("/all", protect, authorize(["admin"]), artistController.findAll);


// Exportamos este objeto 'router' para que pueda ser importado en 'server.js'.
// Esto permite que el servidor principal conozca y utilice estas rutas.
module.exports = router;