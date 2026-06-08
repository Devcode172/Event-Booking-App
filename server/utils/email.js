const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// Verify transporter configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log("Email service not properly configured:", error.message)
    } else {
        console.log("Email service ready")
    }
})

const sendOtpEmail = (email, otp, type) => {
    return new Promise((resolve, reject) => {
        const title = type === "account_verification" ? "Account Verification" : "Event Booking verification"
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for " + title,
            text: `Your OTP for ${type} is ${otp}. It is valid for 10 minutes.`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email to", email, ":", error.message)
                resolve() // Don't reject - email failure shouldn't block registration
            } else {
                console.log("✓ Email sent to", email)
                resolve()
            }
        })
    })
}

const sendBookingConfirmationEmail = (userName, userEmail, eventName) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "Booking Confirmation for " + eventName,
            text: `Dear ${userName},\n\nYour booking for the event "${eventName}" has been confirmed. We look forward to seeing you there!\n\nBest regards,\nEvent Team`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(" Error sending booking confirmation to", userEmail, ":", error.message)
                resolve()
            } else {
                console.log(" Booking confirmation sent to", userEmail)
                resolve()
            }
        })
    })
}

module.exports = {
    sendOtpEmail,
    sendBookingConfirmationEmail
}