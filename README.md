# Secure Task Management System

A production-ready, full-stack task management application with JWT authentication, responsive UI, and advanced features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security Features](#security-features)

## ✨ Features

### ✅ Authentication & Security
- **JWT Authentication**: Secure signup, login, and token-based API access
- **Password Security**: Bcrypt hashing with salt rounds
- **Private Data Access**: Users can only access their own tasks (403/401 protection)
- **Token Expiry**: 7-day JWT token expiration
- **CORS Protection**: Properly configured CORS headers

### 📝 Task Management
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Schema**: Title, Description, Priority, Status, Due Date
- **Priority Levels**: Low, Medium, High
- **Status Tracking**: Pending, Completed
- **Due Dates**: Track task deadlines with overdue indicators

### 🔍 Advanced Filtering
- **Server-Side Pagination**: Configurable page size (5-50 records)
- **Status Filtering**: Filter by Pending or Completed
- **Priority Filtering**: Filter by Low, Medium, or High
- **Full-Text Search**: Search tasks by title (backend indexed)
- **Combination Filtering**: Apply multiple filters simultaneously

### 🎨 Frontend Excellence
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Skeleton Loaders**: Professional loading states
- **Toast Notifications**: Global error, success, and warning messages
- **Modern UI**: Built with Tailwind CSS for sleek, professional design

### ⚡ Performance
- **Database Indexing**: Optimized MongoDB indexes for fast queries
- **Query Caching**: TanStack Query for efficient data management
- **Lean Queries**: Minimal data fetching with MongoDB `.lean()`
- **Pagination**: Avoid loading all records at once

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod schema validation
- **CORS**: Express CORS middleware

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
secure-task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema with password hashing
│   │   │   └── Task.js              # Task schema with indexes
│   │   ├── services/
│   │   │   ├── authService.js       # Auth business logic
│   │   │   └── taskService.js       # Task business logic
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth route handlers
│   │   │   └── taskController.js    # Task route handlers
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT protect, validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth endpoints
│   │   │   └── taskRoutes.js        # /api/tasks endpoints
│   │   ├── validations/
│   │   │   └── schemas.js           # Zod validation schemas
│   │   └── server.js                # Express app setup
│   ├── .env.example                 # Environment variables template
│   └── package.json                 # Backend dependencies

└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Button.jsx            # Reusable button component
    │   │   ├── Input.jsx             # Form input with validation
    │   │   ├── SkeletonLoader.jsx    # Loading skeleton
    │   │   ├── Toast.jsx             # Notification toasts
    │   │   ├── TaskCard.jsx          # Task display card
    │   │   ├── TaskModal.jsx         # Create/edit task form
    │   │   └── ProtectedRoute.jsx    # Auth guard wrapper
    │   ├── pages/
    │   │   ├── LoginPage.jsx         # Login screen
    │   │   ├── SignupPage.jsx        # Registration screen
    │   │   └── TasksPage.jsx         # Dashboard with task list
    │   ├── services/
    │   │   ├── api.js                # Axios instance with interceptors
    │   │   ├── authService.js        # Auth API calls
    │   │   └── taskService.js        # Task API calls
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Auth state management
    │   │   └── NotificationContext.jsx # Toast notifications
    │   ├── App.jsx                   # Main app component
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Tailwind + custom styles
    ├── index.html                    # HTML template
    ├── vite.config.js                # Vite configuration
    ├── tailwind.config.js            # Tailwind theme config
    ├── postcss.config.js             # PostCSS configuration
    ├── .env.example                  # Environment variables template
    └── package.json                  # Frontend dependencies
```

## 🚀 Installation

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your MongoDB URI:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/secure-task-management
   JWT_SECRET=your_very_secure_secret_key_min_32_characters
   JWT_EXPIRY=7d
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secure-task-management
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Application runs on `http://localhost:3000`

## 🔧 Development

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
# No build needed - Node.js runs directly
npm start  # Production mode
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011"
  }
}
```

### Task Endpoints

All task endpoints require `Authorization: Bearer <token>` header

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=Pending&priority=High&search=urgent
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Urgent Task",
      "description": "Task description",
      "priority": "High",
      "status": "Pending",
      "dueDate": "2026-03-15T00:00:00.000Z",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-24T10:00:00.000Z",
      "updatedAt": "2026-02-24T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "Medium",
  "status": "Pending",
  "dueDate": "2026-03-15T00:00:00.000Z"
}

Response:
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New Task",
    "description": "Task description",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-24T10:00:00.000Z",
    "updatedAt": "2026-02-24T10:00:00.000Z"
  }
}
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>

Response: { "success": true, "task": { ... } }
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "Completed"
}

Response: { "success": true, "task": { ... } }
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🔐 Security Features

### Backend Security
- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **JWT Tokens**: Secure token-based authentication
- ✅ **User Isolation**: Database queries filter by `userId`
- ✅ **Authorization**: 403 Forbidden for unauthorized access attempts
- ✅ **Input Validation**: Zod schema validation on all routes
- ✅ **CORS**: Configured with proper origins
- ✅ **Async Errors**: Express-async-errors for error handling
- ✅ **Rate Limiting Ready**: Structure supports rate limiting middleware

### Frontend Security
- ✅ **Token Storage**: localStorage for JWT persistence
- ✅ **Auto Logout**: 401 response triggers logout
- ✅ **Protected Routes**: ProtectedRoute wrapper for auth guarding
- ✅ **Request Interceptors**: Axios auto-adds Authorization header
- ✅ **XSS Prevention**: React's built-in XSS protection

## 📦 Deployment

### Backend Deployment (Render.com)

1. **Create Render account** and connect GitHub

2. **Create New Web Service:**
   - Select your repository
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<generate_secure_key>
   JWT_EXPIRY=7d
   NODE_ENV=production
   ```

4. **Deploy** - Render will auto-deploy on push

### Frontend Deployment (Vercel)

1. **Connect GitHub to Vercel**

2. **Import your frontend folder**

3. **Build Settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=<your_backend_url>
   ```

5. **Deploy** - Auto-deploys on push

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Use in `.env` as `MONGODB_URI`

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required, max 100),
  description: String (max 1000),
  priority: String (Low|Medium|High),
  status: String (Pending|Completed),
  dueDate: Date (required),
  userId: ObjectId (ref: User, indexed),
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - userId + status (for filtering)
// - userId + priority (for filtering)
// - userId + title (text search)
```

## 🧪 Testing the Application

### Sign Up Flow
1. Go to `http://localhost:3000/signup`
2. Enter email, name, and password
3. Click "Create Account"

### Login
1. Go to `http://localhost:3000/login`
2. Enter credentials
3. Click "Sign In"

### Create Task
1. Click "New Task" button
2. Fill in title, description, priority, status, due date
3. Click "Create"

### Task Operations
- **Edit**: Click edit icon on task card
- **Delete**: Click delete icon (with confirmation)
- **Toggle**: Click circle icon to mark complete/incomplete
- **Filter**: Use status and priority dropdowns
- **Search**: Type in search box (queries backend)
- **Paginate**: Use pagination controls at bottom

## 🐛 Troubleshooting

### Backend Won't Start
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check port 5000 is not in use

### Frontend Won't Connect to Backend
- Verify backend is running on `http://localhost:5000`
- Check CORS is enabled in backend
- Verify `http://localhost:5000` is in Vite proxy config

### MongoDB Connection Failed
- For local: Start MongoDB service
- For Atlas: Check IP whitelist and credentials
- Verify connection string format

## 📄 License

This project is open source and available under the MIT License.

---

**Created with ❤️ for production-ready applications**
