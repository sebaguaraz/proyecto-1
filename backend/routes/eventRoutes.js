const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const eventController = require("../controllers/eventController");

const router = express.Router();

router.get("/allEvents", protect, eventController.getAllEvents)

router.get("/:id", protect, eventController.getEventById)

router.get("/eventByArtist/:artistId", protect, eventController.getEventsByArtistId)

router.post("/", protect, authorize(["artist"]), eventController.createEvent)

router.delete("/:id", protect, authorize(["admin","artist"]), eventController.deleteEvent)

router.put("/:id", protect, authorize(["admin", "artist"]), eventController.updateEvent)


module.exports = router