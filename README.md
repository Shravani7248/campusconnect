# CampusConnect - Smart Campus Management Platform

CampusConnect is a production-grade, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for smart campus management, student administration, and academic portal operations.

---

## 🌟 Key Features

### 1. Robust Authentication & Security
- **Email Verification via Resend OTP**: 6-digit cryptographically secure OTP generated during registration and delivered using Resend.
- **SHA-256 Hashed OTP Storage**: Raw OTPs are never stored in plain text or logged in production.
- **Resend Cooldown & Expiry**: 60-second resend cooldown timer and 10-minute expiration window.
- **Forgot Password Flow**: Secure 3-step password reset (Request OTP → Verify OTP → Set New Password).
- **JWT Bearer Token Authentication**: State management via Redux Toolkit and automatic header injection with Axios interceptors.
- **Role-Based Authorization**: Support for `student`, `faculty`, and `admin` roles.
- **Centralized Centralized Error Handling**: Structured JSON responses (`{ success, message, data }`) and security headers.

### 2. Student Management Module
- **Full CRUD Operations**: Create, read, update, and delete student records.
- **Validation**: Strict checks for duplicate emails, unique roll numbers, and MongoDB ObjectId validation.
- **Interactive UI**: Search by student name, roll number, or department with dynamic counters.

### 3. Modern Responsive UI
- **React 19 & Vite**: Ultra-fast frontend bundler.
- **Redux Toolkit**: Centralized state management for Auth and Student modules.
- **TailwindCSS & Lucide Icons**: Premium UI styling and micro-interactions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM 7, Redux Toolkit 2, Axios, TailwindCSS 4, Lucide React |
| **Backend** | Node.js (v24+), Express.js 5, Mongoose 9, MongoDB Atlas |
| **Authentication** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), `crypto` OTP |
| **Email Service** | Resend (`resend`) |

---

## 📁 Project Structure

```
CampusConnect/
│
├── backend/
│   ├── config/
│   │   ├── db.js             # Robust MongoDB connection & graceful shutdown
│   ├── controllers/
│   │   ├── authController.js # Auth, OTP verification, login & reset handlers
│   │   └── studentController.js # Student CRUD business logic
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT protect & role authorization
│   │   └── errorMiddleware.js# Centralized error handler & 404 handler
│   ├── models/
│   │   ├── User.js           # User schema with OTP fields & verification state
│   │   └── Student.js        # Student profile schema
│   ├── routes/
│   │   ├── authRoutes.js     # Auth API routes
│   │   └── studentRoutes.js  # Student CRUD API routes
│   ├── services/
│   │   └── emailService.js   # Resend HTML transactional email templates
│   ├── utils/
│   │   ├── generateOTP.js    # Secure 6-digit OTP generator & SHA-256 hash
│   │   └── generateToken.js  # JWT token sign utility
│   ├── tests/
│   │   └── testFullFlow.js   # E2E automated verification test script
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── .env.example
│
├── src/                      # Frontend React Application
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   └── routing/          # ProtectedRoute guard
│   ├── pages/                # Login, Register, VerifyEmail, ForgotPassword, Students, etc.
│   ├── redux/
│   │   ├── slices/           # authSlice & studentSlice
│   │   └── store.js          # Redux Toolkit store
│   └── services/
│       └── api.js            # Axios client with JWT interceptor
│
├── package.json              # Frontend package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.x)
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance (`mongodb://127.0.0.1:27017/campusconnect`)
- **Resend Account**: API key and verified sender for transactional emails (fallback mock mode is available for local development)

### 1. Environment Setup

#### Backend `.env`
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=your_jwt_secret_key_here

RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=CampusConnect
```

#### Frontend `.env`
Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

# Start Entire Project

From CampusConnect root:

```bash
npm install
npm run dev
```

This single command starts both the **Frontend** (`http://localhost:5173`) and **Backend** (`http://localhost:5000`) concurrently.

---

### Running Components Separately (Optional)
- **Backend Only**: `npm run backend` (or `cd backend && npm run dev`)
- **Frontend Only**: `npm run frontend` (or `npx vite`)

---

## 📡 API Endpoint Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user & dispatch Resend OTP |
| `POST` | `/api/auth/verify-email` | Public | Verify email using 6-digit OTP code |
| `POST` | `/api/auth/resend-otp` | Public | Resend verification OTP (60s cooldown) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Public | Request 6-digit password reset OTP |
| `POST` | `/api/auth/verify-reset-otp` | Public | Verify password reset OTP code |
| `POST` | `/api/auth/reset-password` | Public | Reset password with verified OTP |

### Student Endpoints (`/api/students`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Public/Private | Retrieve all student records |
| `GET` | `/api/students/:id` | Public/Private | Retrieve single student by ID |
| `POST` | `/api/students` | Private | Add new student profile |
| `PUT` | `/api/students/:id` | Private | Update student details |
| `DELETE` | `/api/students/:id` | Private | Delete student record |

---

## 🧪 Verification & Testing

To run the full automated end-to-end test suite:
```bash
cd backend
node tests/testFullFlow.js
```
This tests database connection, user registration, OTP generation/hashing, OTP email verification, JWT issuance, login, student CRUD, and password reset flows automatically.
