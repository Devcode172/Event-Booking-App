const express = require('express')
const pool = require('./db/db')
require("dotenv").config()
const authRoutes = require("./routes/auth.route")
const cors = require("cors")
const eventRoutes = require("./routes/event.route")
const bookingRoutes = require("./routes/booking.route")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// routes

app.use("/api/auth",authRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/bookings",bookingRoutes)

module.exports = app