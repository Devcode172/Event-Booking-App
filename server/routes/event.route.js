const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get("/", protect, getAllEvents)
router.get("/:id", protect, getEventById)
router.post("/", protect, adminOnly, createEvent)
router.put("/:id", protect, adminOnly, updateEvent)
router.delete("/:id", protect, adminOnly, deleteEvent)

module.exports = router
