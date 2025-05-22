const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// POST /api/auth/register (como en Gaby)
router.post("/register", authController.register);

// POST /api/auth/login (como en Gaby)
router.post("/login", authController.login);

// GET /api/auth/admin → Ruta protegida solo para admin
router.get("/admin", protect, authorize(["admin"]), (req, res) => {
  res.json({ message: "Bienvenido, administrador" });
});

module.exports = router;