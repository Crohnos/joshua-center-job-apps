# Job Application Tracker

A full-stack web application for The Joshua Center to manage job applications. 

## Features

- Multi-page application form for candidates
- Admin dashboard to review applications
- Google OAuth authentication for both applicants and admin
- User management for admin access

## Tech Stack

### Frontend
- React
- React Router
- Zustand (state management)
- React Hook Form
- TanStack React Query and React Table
- PicoCSS (styling)

### Backend
- Node.js with Express
- SQLite database 
- PassportJS for Google OAuth authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Setup

1. Clone the repository
```
git clone <repository-url>
cd job-app-tracker
```

2. Install dependencies
```
npm install
cd src && npm install
cd ../server && npm install
```

3. Set up Environment Variables
Create a `.env` file in the server directory with:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

4. Run the application
```
npm run dev
```

This will start both the backend server (port 3001) and frontend development server (port 5173).

## Project Structure

- `/server` - Backend Express application
  - `/controllers` - Route handlers
  - `/middleware` - Authentication and utilities
  - `/models` - Database models
  - `/routes` - API routes
  
- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/services` - API clients
  - `/store` - State management

## License

This project is licensed under the MIT License.