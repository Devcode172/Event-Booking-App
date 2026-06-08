const pool = require('../db/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { sendOtpEmail } = require('../utils/email')

function registerUser(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        })
    }

    const checkQuery = "SELECT * FROM users WHERE email = $1"
    pool.query(checkQuery, [email], (err, result) => {
        if (err) {
            console.error(" Error checking user:", err.message)
            return res.status(500).json({
                message: "Error occurred while checking user"
            })
        }
        if (result.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        /* const insertQuery = "INSERT INTO users(name, email, password) VALUES($1, $2, $3)"
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(" Error hashing password:", err.message)
                return res.status(500).json({
                    message: "Error occurred while hashing password"
                })
            }
            pool.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error(" Error registering user:", err.message)
                    return res.status(500).json({
                        message: "Error occurred while registering user"
                    })
                } */

        const otp = Math.floor(100000 + Math.random() * 900000)
        const otpInsertQuery = "INSERT INTO otp(user_email, otp_code, otp_type) VALUES($1, $2, $3)"
        pool.query(otpInsertQuery, [email, otp, "account_verification"], async (err, result) => {
            if (err) {
                console.error(" Error saving OTP:", err.message)
                return res.status(500).json({
                    message: "Error occurred while saving OTP"
                })
            }

            console.log(` User registered: ${email}, OTP: ${otp}`)
            await sendOtpEmail(email, otp, "account_verification")
            res.status(201).json({
                message: "User registered successfully. Please verify your email with the OTP sent to your email address."
            })
        })
    })
}


const generateToken = (user) => {
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return token
}

function loginUser(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }
    // checking if user exists in database
    const query = "SELECT * FROM users WHERE email = $1"
    pool.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while checking user"
            })
        }
        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const user = result.rows[0]
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while comparing passwords"
                })
            }
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid email or password"
                })
            }
            // no need of this as we are now storing user after opt verfication so isverified will always be true
            /* if (!user.isverified && user.role === "user") {
                const deleteQuery = "DELETE FROM otp WHERE user_email = $1 AND otp_type = $2"
                pool.query(deleteQuery, [email, "account_verification"], (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Error occurred while deleting existing OTPs"
                        })
                    }
                    const otp = Math.floor(100000 + Math.random() * 900000)
                    const otpInsertQuery = "INSERT INTO otp(user_email, otp_code, otp_type) VALUES($1, $2, $3)"
                    pool.query(otpInsertQuery, [email, otp, "account_verification"], async (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Error occurred while saving OTP"
                            })
                        }
                        await sendOtpEmail(email, otp, "account_verification")
                        return res.status(400).json({
                            message: "Please verify your email before logging in"
                        })
                    })
                })
                return 
            }*/
            return res.json({
                message: "User logged in successfully",
                token: generateToken(user),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isverified: user.isverified
                }
            })
        })
    })
}

function verifyOtp(req, res) {
    const { email, otp, password } = req.body
    if (!email || !otp || !password) {
        return res.status(400).json({
            message: "Email, OTP, and password are required"
        })
    }

    const query = "SELECT * FROM otp WHERE user_email = $1 AND otp_code = $2 AND otp_type = $3"
    pool.query(query, [email, otp, "account_verification"], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while verifying OTP"
            })
        }
        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }
        // if otp is valid , enter the user in users table 
        const insertQuery = "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *"
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while hashing password"
                })
            }
            pool.query(insertQuery, [req.body.name, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error occurred while creating user"
                    })
                }

                const updateQuery = "UPDATE users SET isverified = true WHERE email = $1 RETURNING *"
                pool.query(updateQuery, [email], (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Error occurred while updating user verification status"
                        })
                    }
                    if (updateResult.rows.length === 0) {
                        return res.status(400).json({
                            message: "User not found"
                        })
                    }
                    const user = updateResult.rows[0]
                    const deleteQuery = "DELETE FROM otp WHERE user_email = $1 AND otp_type = $2"
                    pool.query(deleteQuery, [email, "account_verification"], (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Error occurred while deleting OTP"
                            })
                        }
                        return res.json({
                            message: "OTP verified successfully",
                            token: generateToken(user),
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                isverified: user.isverified
                            }
                        })
                    })
                })
            })
        })
    })
}

module.exports = {
    registerUser,
    loginUser,
    verifyOtp
}