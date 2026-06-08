const pool = require("../db/db")

function getAllEvents(req, res) {
    //apply filters if any
  /*   const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit; */
    const query = "SELECT * FROM events";

    pool.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while fetching events"
            })
        }
        return res.json({
            message: "Events fetched successfully",
            events: result.rows
        })
    })
}


function getEventById(req, res) {
    const { id } = req.params
    const query = "SELECT * FROM events WHERE id = $1"
    pool.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while fetching event"
            })
        }
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            })
        }
        return res.json({
            message: "Event fetched successfully",
            event: result.rows[0]
        })
    })
}
 
function createEvent(req, res) {
    const { title, description, location, event_date, ticket_price, image_url, total_seats, available_seats } = req.body
    const created_by = req.user.id
    const query = "INSERT INTO events(title, description, location, event_date, ticket_price, image_url, total_seats, available_seats, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
    pool.query(query, [title, description, location, event_date, ticket_price, image_url, total_seats, available_seats, created_by], (err, result) => {
        if (err) {
            console.error('Database error creating event:', err.message)
            return res.status(500).json({   
                message: "Error occurred while creating event",
                error: err.message
            })
        }   
        return res.status(201).json({
            message: "Event created successfully",
            event: result.rows[0]
        })
    })
}

function updateEvent(req, res) {
    const { id } = req.params
    const { title, description, location, event_date, ticket_price, image_url, total_seats, available_seats } = req.body
    const query = "UPDATE events SET title = $1, description = $2, location = $3, event_date = $4, ticket_price = $5, image_url = $6, total_seats = $7, available_seats = $8 WHERE id = $9 RETURNING *" 
    const seatsValue = available_seats || total_seats
    pool.query(query, [title, description, location, event_date, ticket_price, image_url, total_seats, seatsValue, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error occurred while updating event"
            })
        }   
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            })
        }   
        return res.json({
            message: "Event updated successfully",
            event: result.rows[0]
        })
    })
}

async function deleteEvent(req, res) {
    const { id } = req.params
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        await client.query('DELETE FROM bookings WHERE event_id = $1', [id])
        const result = await client.query('DELETE FROM events WHERE id = $1 RETURNING *', [id])

        if (result.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({
                message: "Event not found"
            })
        }

        await client.query('COMMIT')
        return res.json({
            message: "Event deleted successfully",
            event: result.rows[0]
        })
    } catch (err) {
        try {
            await client.query('ROLLBACK')
        } catch (rollbackErr) {
            console.error('Rollback error:', rollbackErr.message)
        }
        console.error('Error deleting event:', err.message)
        return res.status(500).json({
            message: "Error occurred while deleting event",
            error: err.message
        })
    } finally {
        client.release()
    }
}   

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}   
