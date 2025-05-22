const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware"); // Importamos protect y authorize
const userController = require("../controllers/userController");

// Ruta para listar todos los usuarios (protegida)
router.get("/", protect, authorize(["admin"]), userController.getAllUsers);

// Ruta para obtener un usuario por ID (protegida)
router.get("/:id", protect, userController.getUserById); // La autorización compleja se queda en el controlador

// Ruta para crear un nuevo usuario (protegida)
router.post("/", protect, authorize(["admin"]), userController.createUser);

// Ruta para actualizar un usuario (protegida)
router.put("/:id", protect, userController.updateUser); // La autorización compleja se queda en el controlador

// Ruta para eliminar un usuario (protegida)
router.delete("/:id", protect, authorize(["admin"]), userController.deleteUser);

module.exports = router;

/*

SIN AUTHORIZE y con lógica en el controlador: Puedes permitir que los artistas actualicen solo su foto y bio, mientras que los administradores pueden actualizar todos los campos.

*/