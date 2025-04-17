const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware"); // Importamos correctamente protect y authorize
const authController = require("../controllers/authController");

// Ruta para registrar un usuario (no necesita autenticación)
router.post("/register", authController.register);

// Ruta para hacer login de un usuario (no necesita autenticación)
router.post("/login", authController.login);

// Ruta protegida que solo puede ser accedida por un administrador
router.get("/admin", protect, authorize(["admin"]), (req, res) => {
  res.status(200).json({ message: "Bienvenido, admin!" });
});

module.exports = router;
