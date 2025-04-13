# Job Application Tracker

A full-stack web application for The Joshua Center to manage job applications. 

## Features

- Multi-page application form for candidates
- Admin dashboard to review applications
- Google OAuth authentication for both applicants and admin
- User management for admin access

## Tech Stack

### Frontend
- React 19
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
- Node.js (v18+)
- npm

### Setup

1. Clone the repository
```
git clone <repository-url>
cd job-app-tracker
```

2. Install dependencies
```
npm run install:all
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

## Deployment to Render.com

### Setup Instructions

1. Create a Web Service on Render.com
2. Connect to your GitHub repository
3. Use the following settings:
   - **Name**: joshua-center-job-apps
   - **Environment**: Node
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

4. Add the following environment variables:
   - `NODE_ENV`: production
   - `SESSION_SECRET`: [your secret]
   - `GOOGLE_CLIENT_ID`: [your Google client ID]
   - `GOOGLE_CLIENT_SECRET`: [your Google client secret]
   - `CLIENT_URL`: [your frontend URL - same as this service]
   - `SERVER_URL`: [your backend URL - same as this service]

The application is designed to:
1. Build the frontend static files
2. Serve those static files from the backend
3. Use the same domain for both API and frontend to avoid CORS issues

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