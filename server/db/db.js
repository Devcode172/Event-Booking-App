const pkg = require('pg')
require('dotenv').config()
const { Pool } = pkg

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

pool.connect((err) => {
    if (err) {
        console.log("❌ Database connection error:", err.message)
        process.exit(1)
    }
    else {
        console.log("✓ Database connected successfully")
        //initializeTables()
    }
})

// Initialize database tables
/* const initializeTables = () => {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            isverified BOOLEAN DEFAULT FALSE,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `

    const createOtpTable = `
        CREATE TABLE IF NOT EXISTS otp (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            otp_type VARCHAR(50),
            is_used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP
        );
    `

    const createEventsTable = `
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            event_date TIMESTAMP NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            available_seats INT NOT NULL,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `

    const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            number_of_seats INT NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `

    const createTestTable = `
        CREATE TABLE IF NOT EXISTS test (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255)
        );
    `

    // Execute table creation queries
    pool.query(createUsersTable, (err) => {
        if (err) console.log("Error creating users table:", err.message)
        else console.log("✓ Users table ready")
    })

    pool.query(createOtpTable, (err) => {
        if (err) console.log("Error creating otp table:", err.message)
        else console.log("✓ OTP table ready")
    })

    pool.query(createEventsTable, (err) => {
        if (err) console.log("Error creating events table:", err.message)
        else console.log("✓ Events table ready")
    })

    pool.query(createBookingsTable, (err) => {
        if (err) console.log("Error creating bookings table:", err.message)
        else console.log("✓ Bookings table ready")
    })

    pool.query(createTestTable, (err) => {
        if (err) console.log("Error creating test table:", err.message)
        else console.log("✓ Test table ready")
    })
} */

module.exports = pool