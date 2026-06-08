const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { bookEvent, getmyBookings, sendBookingOtp, cancelBooking, confirmBooking } = require('../controllers/bookingController');

router.post("/", protect, bookEvent)
router.post("/send-otp", protect, sendBookingOtp)
router.get("/my-bookings", protect, getmyBookings)
router.delete("/:bookingId", protect, cancelBooking)
router.post("/:bookingId/confirm", protect, confirmBooking)
module.exports = router