const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const eventController = require("../controllers/eventController");

const router = express.Router();

router.get("/allEvents", eventController.getAllEvents)
// aca debe obtener evento por modo de entrada(id)
router.get("/:entrada", eventController.getEventById)
// modoficar para obtener evento por nombre de artista
router.get("/eventByArtist/:artistName", protect, authorize(["artist"]), eventController.getEventsByArtistName)

router.post("/", protect, authorize(["artist"]), eventController.createEvent)

router.delete("/:id", protect, authorize(["admin","artist"]), eventController.deleteEvent)

router.put("/:id", protect, authorize(["admin", "artist"]), eventController.updateEvent)


module.exports = router