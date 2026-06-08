# Quick Start Guide - Event Booking App

## 🚀 Getting Started (5 minutes)

### Prerequisites Checklist
- [ ] Node.js installed (v16+)
- [ ] PostgreSQL running locally
- [ ] Port 5000 and 5173 available
- [ ] Environment variables configured

### Step 1: Backend Setup (2 min)

```bash
cd server

# Install dependencies
npm install

# Create database (in PostgreSQL)
CREATE DATABASE eventBooking;

# Start backend server
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
```

✅ Backend ready on: `http://localhost:5000`

---

### Step 2: Frontend Setup (2 min)

In a **new terminal**:

```bash
cd client

# Install dependencies  
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v8.0.12 ready in XXX ms

➜  Local:   http://localhost:5173
```

✅ Frontend ready on: `http://localhost:5173`

---

### Step 3: Test the App (1 min)

1. Open browser: `http://localhost:5173`
2. Click "Get Started" or "Register"
3. Fill in registration form
4. Check email for OTP
5. Verify OTP to complete registration
6. Login and browse events!

---

## 📋 Feature Walkthrough

### 1. **Authentication**
- Register with name, email, password
- OTP verification via email
- Secure JWT-based login

### 2. **Event Browsing**
- View all available events
- See event details (date, time, location, price)
- Check available seats

### 3. **Event Booking**
- Select number of seats
- Confirm booking details
- Receive confirmation OTP
- Booking confirmation with email

### 4. **Booking Management**
- View all your bookings
- Check booking status (pending/confirmed/cancelled)
- Cancel bookings if needed
- Resend confirmation OTP

---

## 🔧 Configuration

### Backend Environment (.env)
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
DB_DATABASE=eventBooking
PORT=5000
EMAIL=your_email@gmail.com
PASSWORD=your_app_password
JWT_SECRET=your_secret_key
```

### Frontend API Configuration
Already configured in `client/src/utlis/axios.js`:
- Base URL: `http://localhost:5000/api`
- Authorization header with JWT token

---

## 📱 Main Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require login)
- `/events` - Browse all events
- `/event/:id` - Event details & booking
- `/my-bookings` - Your bookings

---

## 🛠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Ensure server running on port 5000 |
| "Database connection failed" | Check PostgreSQL running, verify credentials |
| "OTP not received" | Check email config, spam folder |
| "Port already in use" | Kill existing process or use different port |
| "Module not found" | Run `npm install` in respective folder |

---

## 📊 Database Schema (Quick Reference)

### Users Table
- id, name, email, password, is_verified, role, created_at

### Events Table
- id, title, description, location, event_date, price, available_seats, image_url

### Bookings Table
- id, user_id, event_id, number_of_seats, total_amount, status, created_at

### OTP Table
- id, user_email, otp_code, otp_type, created_at, expires_at

---

## 🔑 Test Account

After registration, use this to test:
```
Email: test@example.com
Password: Test@123
```

---

## 📞 API Quick Reference

```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login user
POST   /api/auth/verify-otp        - Verify email OTP

GET    /api/events                 - List all events
GET    /api/events/:id             - Get event details

POST   /api/bookings               - Create booking
GET    /api/bookings/my-bookings   - Get user's bookings
POST   /api/bookings/send-otp      - Send confirmation OTP
POST   /api/bookings/:id/confirm   - Confirm booking
DELETE /api/bookings/:id           - Cancel booking
```

---

## ✨ Key Features Implemented

✅ User authentication with email OTP
✅ Event browsing and filtering
✅ Booking system with OTP verification
✅ Booking history and management
✅ Protected routes
✅ Responsive design (mobile-friendly)
✅ Error handling
✅ Toast notifications
✅ Tailwind CSS styling
✅ React Router navigation

---

## 🎯 Next Steps (Optional)

- [ ] Add event filtering by category, date range
- [ ] Add payment gateway integration
- [ ] Send booking confirmation emails
- [ ] Admin dashboard
- [ ] Event analytics
- [ ] User profile management
- [ ] Search functionality
- [ ] Review and ratings system

---

## 📦 Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS
**Backend:** Express.js, PostgreSQL, JWT, bcrypt, Nodemailer
**Deployment:** Ready for Vercel (frontend), Railway/Render (backend)

---

**Happy Coding! 🎉**
