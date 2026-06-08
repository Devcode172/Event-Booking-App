const pool = require('../db/db')
const { sendOtpEmail, sendBookingConfirmationEmail } = require('../utils/email');

function sendBookingOtp(req, res) {
    const userEmail = req.user.email
    const otp = Math.floor(100000 + Math.random() * 900000)
    const deleteQuery = "DELETE FROM otp WHERE user_email = $1 AND otp_type = $2"
    pool.query(deleteQuery, [userEmail, "event_booking"], (err) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while deleting existing OTPs"
            })
        }

        const otpInsertQuery = "INSERT INTO otp(user_email, otp_code, otp_type) VALUES($1, $2, $3)"
        pool.query(otpInsertQuery, [userEmail, otp, "event_booking"], async (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while saving OTP"
                })
            }
            await sendOtpEmail(userEmail, otp, "event_booking")
            return res.json({
                message: "OTP sent to email for booking verification"
            })
        })
    })
}

function bookEvent(req, res) {
    const { event_id, number_of_seats } = req.body
    if (!event_id || !number_of_seats || Number(number_of_seats) <= 0) {
        return res.status(400).json({
            message: "Event ID and number of seats are required"
        })
    }

    const userEmail = req.user.email
    const eventQuery = "SELECT * FROM events WHERE id = $1"
    pool.query(eventQuery, [event_id], (err, eventResult) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while checking event availability"
            })
        }
        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        const event = eventResult.rows[0]
        if (event.available_seats < number_of_seats) {
            return res.status(400).json({
                message: "Not enough available seats for this event"
            })
        }

        const bookingCheckQuery = "SELECT * FROM bookings WHERE user_id = $1 AND event_id = $2 AND booking_status != 'cancelled'"
        pool.query(bookingCheckQuery, [req.user.id, event_id], (err, bookingCheckResult) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while checking booking status"
                })
            }
            if (bookingCheckResult.rows.length > 0) {
                return res.status(400).json({
                    message: "You have already booked this event"
                })
            }

            const totalAmount = Number(number_of_seats) * Number(event.ticket_price)
            // Return booking details without saving to DB
            return res.status(200).json({
                message: "Booking validated successfully. Please verify with OTP.",
                booking: {
                    event_id,
                    number_of_seats,
                    total_amount: totalAmount,
                    user_id: req.user.id,
                    event_title: event.title
                }
            })
        })
    })
}

function confirmBooking(req, res) {
    const { bookingId } = req.params
    const { event_id, number_of_seats, otp } = req.body
    const userEmail = req.user.email

    if (!otp) {
        return res.status(400).json({
            message: "OTP is required"
        })
    }

    // Require either bookingId (old flow) or event_id + number_of_seats (new flow)
    if (!event_id || !number_of_seats) {
        return res.status(400).json({
            message: "Event ID and number of seats are required"
        })
    }

    const otpQuery = "SELECT * FROM otp WHERE user_email = $1 AND otp_code = $2 AND otp_type = $3"
    pool.query(otpQuery, [userEmail, otp, "event_booking"], async (err, otpResult) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while verifying OTP"
            })
        }
        if (otpResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        // OTP verified, now INSERT booking into database
        const eventQuery = "SELECT * FROM events WHERE id = $1"
        pool.query(eventQuery, [event_id], (err, eventResult) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while fetching event details"
                })
            }
            if (eventResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Event not found"
                })
            }

            const event = eventResult.rows[0]
            const totalAmount = Number(number_of_seats) * Number(event.ticket_price)

            const bookingQuery = "INSERT INTO bookings(user_id, event_id, quantity, total_amount, booking_status) VALUES($1, $2, $3, $4, 'confirmed') RETURNING *"
            pool.query(bookingQuery, [req.user.id, event_id, number_of_seats, totalAmount], (err, bookingResult) => {
                if (err) {
                    console.error('Booking insert error:', err.message || err)
                    return res.status(500).json({
                        message: "Error occurred while confirming booking"
                    })
                }

                const confirmedBooking = bookingResult.rows[0]

                // Update available seats
                const updateSeatsQuery = "UPDATE events SET available_seats = available_seats - $1 WHERE id = $2"
                pool.query(updateSeatsQuery, [number_of_seats, event_id], (err) => {
                    if (err) {
                        console.error("Error updating available seats:", err)
                    }
                })

                // Delete OTP after successful confirmation
                const deleteOtpQuery = "DELETE FROM otp WHERE user_email = $1 AND otp_type = $2"
                pool.query(deleteOtpQuery, [userEmail, "event_booking"], async (deleteErr) => {
                    if (deleteErr) {
                        console.error("Error deleting OTP after confirmation:", deleteErr)
                    }
                    await sendBookingConfirmationEmail(req.user.name || userEmail, userEmail, event.title)
                    return res.json({
                        message: "Booking confirmed successfully",
                        booking: {
                            ...confirmedBooking,
                            status: confirmedBooking.booking_status,
                            number_of_seats: confirmedBooking.quantity
                        }
                    })
                })
            })
        })
    })
}

function getmyBookings(req, res) {
    const userEmail = req.user.email
    const query = "SELECT b.*, e.title, e.event_date AS event_date, b.quantity AS number_of_seats, b.booking_status AS status FROM bookings b JOIN events e ON b.event_id = e.id JOIN users u ON b.user_id = u.id WHERE u.email = $1"
    pool.query(query, [userEmail], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while fetching bookings"
            })
        }
        return res.json({
            bookings: result.rows
        })
    })
}

function cancelBooking(req, res) {
    const { bookingId } = req.params
    const userEmail = req.user.email
    //just to get number of seats to be released 
    const query = "SELECT b.*, e.title, b.quantity AS number_of_seats, b.booking_status AS status FROM bookings b JOIN events e ON b.event_id = e.id JOIN users u ON b.user_id = u.id WHERE b.id = $1 AND u.email = $2"
    pool.query(query, [bookingId, userEmail], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while fetching booking details"
            })
        }
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        const booking = result.rows[0]
        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            })
        }

        const previousStatus = booking.status
        const seatsToRelease = booking.quantity
        const cancelQuery = "UPDATE bookings SET booking_status = 'cancelled' WHERE id = $1 RETURNING *"
        pool.query(cancelQuery, [bookingId], (err, cancelResult) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while cancelling booking"
                })
            }
            const updatedBooking = cancelResult.rows[0]
            if (previousStatus === "confirmed") {

                const updateSeatsQuery = "UPDATE events SET available_seats = available_seats + $1 WHERE id = $2"
                pool.query(updateSeatsQuery, [seatsToRelease, booking.event_id], (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Error occurred while updating available seats"
                        })
                    }
                    return res.json({
                        message: "Booking cancelled successfully",
                        booking: updatedBooking
                    })
                })
            } else {
                return res.json({
                    message: "Booking cancelled successfully",
                    booking: updatedBooking
                })
            }
        })
    })
}

module.exports = {
    sendBookingOtp,
    bookEvent,
    confirmBooking,
    getmyBookings,
    cancelBooking
}
