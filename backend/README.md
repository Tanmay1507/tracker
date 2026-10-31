# Git Tracker Backend

Boilerplate backend service built with Node.js, Express, and MongoDB (Mongoose) for tracking Git repositories, commits, and webhooks.

## Architecture & Directory Structure

```text
backend/
├── index.js                # Server entry point & Express configuration
├── .env.example            # Sample environment variables
├── .env                    # Local environment config
├── package.json            # Node.js dependencies & scripts
│
├── database/               # Database connection logic
│   └── db.js               # MongoDB connection setup via Mongoose
│
├── schema/                 # Mongoose data models
│   ├── User.js             # User accounts & auth schema
│   ├── Repository.js       # Tracked Git repository schema
│   ├── Commit.js           # Git commit history schema
│   └── index.js            # Schemas aggregator
│
├── controllers/            # Controller business logic
│   ├── authController.js   # User registration, login, current profile
│   ├── repoController.js   # Tracked repos CRUD & sync
│   ├── commitController.js # Commit listings & activity stats
│   └── webhookController.js# GitHub incoming webhook handler
│
├── routers/                # Express router definitions
│   ├── index.js            # Aggregated /api router & health check
│   ├── authRoutes.js       # /api/auth routes
│   ├── repoRoutes.js       # /api/repos routes
│   ├── commitRoutes.js     # /api/commits routes
│   └── webhookRoutes.js    # /api/webhooks routes
│
├── middleware/             # Express middlewares
│   ├── authMiddleware.js   # JWT authentication & route protection
│   ├── errorMiddleware.js  # 404 handler & centralized error handler
│   └── loggerMiddleware.js # Incoming HTTP request logger
│
└── util/                   # Utility helpers
    ├── apiResponse.js      # Standardized JSON response helpers
    ├── asyncHandler.js     # Async controller wrapper
    └── auth.js             # Password hashing (bcrypt) & JWT helpers
```

## Setup & Running

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Run the Server**:
   - Development mode (with live-reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Health check endpoint | Public |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate & get JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private (Bearer) |
| `GET` | `/api/repos` | List user's tracked repositories | Private (Bearer) |
| `POST` | `/api/repos` | Track a new repository | Private (Bearer) |
| `GET` | `/api/repos/:id` | Get repository details & latest commits | Private (Bearer) |
| `DELETE` | `/api/repos/:id` | Untrack repository | Private (Bearer) |
| `POST` | `/api/repos/:id/sync` | Trigger sync for repository | Private (Bearer) |
| `GET` | `/api/commits/stats` | Get user commit activity statistics | Private (Bearer) |
| `GET` | `/api/commits/repo/:repoId` | Get commits for a tracked repository | Private (Bearer) |
| `POST` | `/api/webhooks/github` | Receive GitHub push/ping webhooks | Public (GitHub Secret) |
