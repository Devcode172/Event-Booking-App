const jwt = require('jsonwebtoken')
const pool = require('../db/db')

const protect = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or missing authorization header"
        })
    }
    const token = authHeader.substring(7)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized: Invalid token"
            })
        }
        const query = "SELECT * FROM users WHERE id = $1"
        pool.query(query, [decoded.id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while fetching user"
                })
            }
            if (result.rows.length === 0) {
                return res.status(401).json({
                    message: "Unauthorized: User not found"
                })
            }
            req.user = result.rows[0]
            next()
        })
    })
}

const adminOnly = (req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Forbidden: Admins only"
        })
    }
    next()
}

module.exports = {
    protect,
    adminOnly
}
