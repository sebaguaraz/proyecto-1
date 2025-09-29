const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// POST /api/auth/register (como en Gaby)
router.post("/register", authController.register);

// POST /api/auth/login (como en Gaby)
router.post("/login", authController.login);


module.exports = router;