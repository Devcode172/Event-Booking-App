# Event Booking App - Architecture & Components Guide

## 📁 Project Structure Overview

```
09_Event_Booking_App/
│
├── client/                          # React Frontend (Vite)
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar with logout
│   │   │   ├── EventCard.jsx        # Event listing card component
│   │   │   ├── BookingModal.jsx     # Booking workflow modal
│   │   │   ├── BookingCard.jsx      # Booking history card
│   │   │   └── ProtectedRoute.jsx   # Route protection HOC
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page (public)
│   │   │   ├── Login.jsx            # User login page
│   │   │   ├── Register.jsx         # User registration + OTP
│   │   │   ├── Events.jsx           # All events listing
│   │   │   ├── EventDetail.jsx      # Event details + booking
│   │   │   ├── MyBookings.jsx       # User's booking history
│   │   │   └── NotFound.jsx         # 404 page
│   │   │
│   │   ├── utlis/
│   │   │   └── axios.js             # Axios instance with JWT interceptor
│   │   │
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # React DOM entry point
│   │   ├── index.css                # Global styles (Tailwind)
│   │   └── App.css                  # Component styles
│   │
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js           # Tailwind CSS config
│
├── server/                          # Express Backend
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login, verify)
│   │   ├── eventController.js       # Event CRUD operations
│   │   └── bookingController.js     # Booking logic
│   │
│   ├── routes/
│   │   ├── auth.route.js            # Auth endpoints
│   │   ├── event.route.js           # Event endpoints
│   │   └── booking.route.js         # Booking endpoints
│   │
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification & role check
│   │
│   ├── db/
│   │   └── db.js                    # PostgreSQL connection pool
│   │
│   ├── utils/
│   │   └── email.js                 # Email sending utility
│   │
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   └── .env.example                 # Example env file
│
├── README.md                        # Main documentation
├── QUICK_START.md                   # Quick start guide
└── ARCHITECTURE.md                  # This file
```

---

## 🏗️ Architecture Overview

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│            React Application             │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │      React Router Setup          │   │
│  │  (Routes & Protected Routes)     │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │    Pages Layer                   │   │
│  │  - Home, Login, Register         │   │
│  │  - Events, EventDetail           │   │
│  │  - MyBookings, NotFound          │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │    Components Layer              │   │
│  │  - Navbar, EventCard             │   │
│  │  - BookingModal, BookingCard     │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │    API Layer (Axios)             │   │
│  │  - JWT token management          │   │
│  │  - Request/Response handling     │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │   Backend API (Express)          │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────┐
│        Express Application              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │    Routes Layer                  │   │
│  │  - /api/auth                     │   │
│  │  - /api/events                   │   │
│  │  - /api/bookings                 │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │  Middleware Layer                │   │
│  │  - Authentication & Authorization│   │
│  │  - CORS, JSON parsing            │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │  Controllers Layer               │   │
│  │  - Business Logic                │   │
│  │  - Request Validation            │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │  Database Layer                  │   │
│  │  - PostgreSQL Connection Pool    │   │
│  │  - Query Execution               │   │
│  └──────────────────────────────────┘   │
│           ↓                              │
│  ┌──────────────────────────────────┐   │
│  │  PostgreSQL Database             │   │
│  │  - Users, Events, Bookings, OTP  │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Data Flow & User Journeys

### 1. Authentication Flow

```
User → Register Page → Validation
  ↓
Hash Password (bcrypt)
  ↓
Save to DB
  ↓
Generate & Send OTP (Email)
  ↓
User enters OTP
  ↓
Verify OTP
  ↓
Generate JWT Token
  ↓
Store Token (localStorage)
  ↓
Redirect to Events Page
```

### 2. Event Booking Flow

```
User → Events List Page
  ↓
Click Event
  ↓
View Event Details
  ↓
Click "Book Now"
  ↓
Select Seats
  ↓
Confirm Booking
  ↓
Create Booking (pending status)
  ↓
Send Confirmation OTP
  ↓
User Enters OTP
  ↓
Verify OTP
  ↓
Update Booking Status (confirmed)
  ↓
Redirect to My Bookings
```

### 3. Booking Management Flow

```
My Bookings Page
  ↓
Display User's Bookings
  ↓
For Pending Bookings:
  ├─ Send OTP button
  ├─ Cancel button
  ↓
For Confirmed Bookings:
  ├─ Cancel button
  ↓
For Cancelled Bookings:
  ├─ Read-only view
```

---

## 📡 API Endpoints Reference

### Authentication Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/verify-otp` | No | Verify email OTP |

**Request/Response Examples:**

```javascript
// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user }

// Verify OTP
POST /api/auth/verify-otp
{
  "email": "john@example.com",
  "otp": "123456"
}
Response: { token, user }
```

### Event Endpoints

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| GET | `/api/events` | Yes | User | Get all events |
| GET | `/api/events/:id` | Yes | User | Get event details |
| POST | `/api/events` | Yes | Admin | Create event |
| PUT | `/api/events/:id` | Yes | Admin | Update event |
| DELETE | `/api/events/:id` | Yes | Admin | Delete event |

### Booking Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings/my-bookings` | Yes | Get user's bookings |
| POST | `/api/bookings/send-otp` | Yes | Send confirmation OTP |
| POST | `/api/bookings/:id/confirm` | Yes | Confirm booking |
| DELETE | `/api/bookings/:id` | Yes | Cancel booking |

---

## 🔐 Security Features

### 1. Authentication
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Token Expiry**: 7 days
- **Local Storage**: Token stored securely in browser

### 2. Authorization
- **Route Protection**: Protected routes require valid token
- **Role-Based Access**: Admin-only endpoints
- **Middleware Validation**: JWT verification on every request

### 3. Data Validation
- **Input Validation**: Required fields checking
- **Password Requirements**: Minimum 6 characters
- **Email Verification**: OTP-based email verification
- **OTP Expiry**: OTP codes expire after set time

### 4. API Security
- **CORS Enabled**: Controlled cross-origin requests
- **Bearer Token**: Authorization header uses Bearer scheme
- **HTTP Only**: Token stored in localStorage (consider httpOnly cookies for production)

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
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
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  event_id INT NOT NULL REFERENCES events(id),
  number_of_seats INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### OTP Table
```sql
CREATE TABLE otp (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  otp_type VARCHAR(50),
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

---

## 🛠️ Component Details

### Frontend Components

#### **Navbar Component**
- Conditional rendering (hidden on public pages)
- Navigation links for authenticated users
- User name display
- Logout functionality
- Mobile responsive menu

#### **EventCard Component**
- Event details preview
- Date, time, location display
- Price and available seats
- Link to event details
- Responsive grid layout

#### **BookingModal Component**
- Multi-step booking process
- Seat selection
- OTP verification
- Payment confirmation
- Error handling

#### **BookingCard Component**
- Display booking details
- Status badge with color coding
- Action buttons (send OTP, cancel)
- Booking information display
- Responsive layout

#### **ProtectedRoute Component**
- Route protection HOC
- Token validation
- Automatic redirection to login
- Authentication state check

### Backend Controllers

#### **AuthController**
- `registerUser()` - User registration with validation
- `loginUser()` - User login with password verification
- `verifyOtp()` - OTP verification and token generation
- `generateToken()` - JWT token generation

#### **EventController**
- `getAllEvents()` - Fetch all events
- `getEventById()` - Fetch single event
- `createEvent()` - Create new event (admin)
- `updateEvent()` - Update event (admin)
- `deleteEvent()` - Delete event (admin)

#### **BookingController**
- `bookEvent()` - Create new booking
- `getMyBookings()` - Get user's bookings
- `sendBookingOtp()` - Send OTP for confirmation
- `confirmBooking()` - Confirm booking with OTP
- `cancelBooking()` - Cancel booking

---

## 🔧 Configuration Files

### Frontend (client/package.json)
```json
{
  "name": "client",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.17.0",
    "axios": "^1.17.0",
    "tailwindcss": "^4.3.0",
    "react-icons": "^5.6.0"
  }
}
```

### Backend (server/package.json)
```json
{
  "name": "server",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "pg": "^8.21.0",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "nodemailer": "^8.0.10"
  }
}
```

---

## 📊 State Management

### Frontend State
- **User Authentication**: localStorage (token, user info)
- **Component State**: useState hooks (forms, modals)
- **Server State**: Fetched via API calls

### Backend State
- **Session Management**: JWT tokens
- **Database State**: PostgreSQL persistence
- **Cache**: None (can be added with Redis)

---

## 🚀 Performance Considerations

### Frontend
- Code splitting with React lazy loading
- Image optimization
- Responsive image sizing
- Debounced API calls

### Backend
- Connection pooling (pg pool)
- Query optimization
- Indexing on frequently queried fields
- Pagination for large datasets

---

## 📈 Scalability Improvements

### Short Term
1. Add caching layer (Redis)
2. Implement pagination
3. Add database indexing
4. Rate limiting on API

### Medium Term
1. Microservices architecture
2. Message queue (RabbitMQ)
3. CDN for static assets
4. API versioning

### Long Term
1. Distributed database
2. Load balancing
3. Horizontal scaling
4. Event-driven architecture

---

## 🧪 Testing Recommendations

### Unit Tests
- Controller logic
- Utility functions
- Component logic

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests
- User registration flow
- Event booking flow
- Booking management

---

## 📚 Additional Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintainer**: Development Team
