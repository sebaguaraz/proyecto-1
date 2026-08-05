const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const eventController = require("../controllers/eventController");

const router = express.Router();

router.get("/allEvents", eventController.getAllEvents)
// buscar eventos por nombre de artista antes de la ruta dinámica
router.get("/eventByArtist/:artistName", eventController.getEventsByArtistName)
// obtener evento por modo de entrada (id)
router.get("/:entrada", eventController.getEventById)

router.post("/", protect, authorize(["artist"]), eventController.createEvent)

router.delete("/:id", protect, authorize(["admin","artist"]), eventController.deleteEvent)

router.put("/:id", protect, authorize(["admin", "artist"]), eventController.updateEvent)


module.exports = router