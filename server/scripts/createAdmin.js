const pool = require('../db/db')
const bcrypt = require('bcrypt')
require('dotenv').config()

const args = process.argv.slice(2)
const parseArg = (name) => {
  const prefix = `--${name}=`
  const arg = args.find((item) => item.startsWith(prefix))
  return arg ? arg.slice(prefix.length) : undefined
}

const email = parseArg('email') || process.env.ADMIN_EMAIL
const password = parseArg('password') || process.env.ADMIN_PASSWORD
const name = parseArg('name') || process.env.ADMIN_NAME || 'Administrator'

if (!email || !password) {
  console.error('Error: email and password are required to create an admin user.')
  console.error('Usage: npm run create-admin -- --email=admin@example.com --password=YourPass123 --name=Admin')
  process.exit(1)
}

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const selectQuery = 'SELECT * FROM users WHERE email = $1'
    pool.query(selectQuery, [email], (selectErr, selectResult) => {
      if (selectErr) {
        console.error('Error checking existing user:', selectErr.message)
        process.exit(1)
      }

      if (selectResult.rows.length > 0) {
        const updateQuery = 'UPDATE users SET name = $1, password = $2, role = $3, isverified = true WHERE email = $4 RETURNING *'
        pool.query(updateQuery, [name, hashedPassword, 'admin', email], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating admin user:', updateErr.message)
            process.exit(1)
          }
          console.log('Admin user updated successfully:')
          console.log(updateResult.rows[0])
          pool.end()
        })
      } else {
        const insertQuery = 'INSERT INTO users(name, email, password, role, isverified) VALUES($1, $2, $3, $4, true) RETURNING *'
        pool.query(insertQuery, [name, email, hashedPassword, 'admin'], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error creating admin user:', insertErr.message)
            process.exit(1)
          }
          console.log('Admin user created successfully:')
          console.log(insertResult.rows[0])
          pool.end()
        })
      }
    })
  } catch (err) {
    console.error('Unexpected error creating admin:', err.message)
    process.exit(1)
  }
}

createAdmin()
