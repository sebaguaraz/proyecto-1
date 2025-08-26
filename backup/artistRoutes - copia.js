// c:\Users\Usuario\Documents\ISFT 151\4to ANIO cursada\Practicas Profesionalizantes 2\proyecto-1\MUSICAA\backend\routes\artistRoutes.js

const express = require("express");
const router = express.Router();
// Asegúrate que la ruta al controlador sea correcta
const artistController = require("../controllers/artistController");
// Traemos nuestros guardianes: 'protect' (verifica si estás logueado) y 'authorize' (verifica el rol)
const { protect, authorize } = require("../middlewares/authMiddleware");

// --- Ruta para ver TODOS los artistas ---
// Cualquiera que esté logueado ('protect') puede ver la lista.
router.get("/", protect, artistController.getAllArtists);

// --- Ruta para ver UN artista por su ID ---
// Cualquiera que esté logueado ('protect') puede ver un artista específico.
router.get("/:id", protect, artistController.getArtistById);

// --- Ruta para CREAR un nuevo artista ---
// Solo los 'admin' pueden crear artistas nuevos.
// Primero 'protect' (logueado?), luego 'authorize' (rol 'admin'?).
// Permitir que tanto admin como artist intenten crear
router.post("/", protect, authorize(["admin", "artist"]), artistController.createArtist);


// --- Ruta para ACTUALIZAR un artista ---
// Se añade authorize para permitir que solo 'admin' o 'artist' intenten la operación.
// ¿Por qué? Porque la lógica de QUIÉN PUEDE (si es admin o si es el dueño)
// la pusimos DENTRO del controlador 'updateArtist'.
router.put("/:id", protect, authorize(["admin", "artist"]), artistController.updateArtist);

// --- Ruta para ELIMINAR un artista ---
// Se añade authorize para permitir que solo 'admin' o 'artist' intenten la operación.
// La lógica de QUIÉN PUEDE (admin o dueño) está DENTRO del controlador 'deleteArtist'.
router.delete("/:id", protect, authorize(["admin", "artist"]), artistController.deleteArtist);

module.exports = router;
