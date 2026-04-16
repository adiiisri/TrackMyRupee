# Expense Tracker (MERN Stack)

A full-stack Expense Tracker web application built using the MERN stack with a clean, modern UI and scalable architecture.

## Features
- **Dashboard**: Visual summaries with Recharts (Area charts, Pie charts for spending trends and categories).
- **Expense Management**: Add, edit, and search through your expenses. Filter by category or time.
- **Budgeting**: Set limits for different categories. See progress bars and get warnings at 80% usage.
- **Recurring Expenses**: Mark expenses as daily, weekly, or monthly, and a backend cron job will evaluate and duplicate them automatically.
- **Auth**: Unified login using Local Credentials (JWT) and Google OAuth.
- **Modern UI**: Fully responsive, plain CSS styled, dynamic Light/Dark mode.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed.
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB).
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/).

### 2. Backend Setup
1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` (check `.env.example`):
   - Replace `<MONGO_URI>` with your actual MongoDB connection string.
   - Insert `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Start the backend DEV server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. In a new terminal, navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```

### Important Endpoints
**Frontend:** `http://localhost:5173`
**Backend API:** `http://localhost:5000`
