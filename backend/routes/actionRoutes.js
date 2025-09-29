const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

const actionController = require("../controllers/actionController");

router.get("/allRegisters", protect, authorize(["admin"]), actionController.findAll);



module.exports = router;