## Vehicle Rental System

A robust and scalable RESTful API for managing vehicle rentals, built with Node.js, Express, TypeScript, and PostgreSQL.

## Live URL
live_url: https://vehicle-rental-system-orpin-seven.vercel.app/

##  Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin & Customer)
- Secure password hashing with bcrypt
- Token-based authorization for protected routes

### User Management
- User CRUD operations with role-based permissions
- Customers can update their own profiles
- Admins can manage all users
- Delete users only if no active bookings exist
- Password exclusion from API responses

### Vehicle Management
- Complete vehicle CRUD operations
- Search and filter vehicles
- Automatic availability status management
- Partial updates support (all fields optional)
- Prevent deletion of vehicles with active bookings

### Booking System
- Create new vehicle bookings
- Automatic price calculation based on rental duration
- View all bookings (Admin) or own bookings (Customer)
- Update booking status (cancel/return)
- Automatic vehicle availability updates
- Date formatting (YYYY-MM-DD)

### Business Logic
- Automatic total price calculation
- Vehicle availability tracking
- Active booking validation
- Authorization checks for all operations

##  Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Deployment:** Vercel

### Development Tools
- **TypeScript Compiler:** tsc
- **Dev Server:** tsx (watch mode)
- **Environment Variables:** dotenv

##  Prerequisites

Before running this project, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/tawhidislam22/vehicle-renting-system.git
cd vehicle-rental-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
CONNECTION_STRING=your connection_string
SECRET_KEY=your_jwt_secret_key
```

##  Authentication

All protected endpoints require the following header:

```
Authorization: Bearer <your-jwt-token>
```

Get your token by logging in through `/api/v1/auth/login`

##  User Roles

### Admin
- Full CRUD access to all resources
- Manage users, vehicles, and bookings
- View all system data

### Customer
- Create and view own bookings
- Update own profile
- View available vehicles
- Cancel own bookings

## Testing

Use tools like Postman to test the API endpoints.

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Made with by Tawhid Islam**
