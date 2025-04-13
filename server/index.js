// Load environment variables
require('dotenv').config();

const express = require('express');
const db = require('./models/db');
const fs = require('fs').promises;
const fsSync = require('fs');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { passport, session } = require('./middleware/auth');

const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Ensure required directories exist
function ensureDirectoriesExist() {
  const directories = [
    path.join(__dirname, 'data'),
    path.join(__dirname, '../uploads')
  ];
  
  directories.forEach(dir => {
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

ensureDirectoriesExist();

// Trust proxy - needed for secure cookies behind a proxy/load balancer
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Set up CORS with appropriate settings for cross-domain cookies
const corsOptions = {
  // Allow multiple origins (both production and development)
  origin: function(origin, callback) {
    if (IS_PRODUCTION && !origin) {
      // In production, only allow requests with an origin header
      return callback(null, false);
    }

    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173', 
      'https://joshua-center-job-apps-app.onrender.com',
      'https://www.joshua-center-job-apps-app.onrender.com',
      'https://joshua-center-job-apps.onrender.com',
      'https://www.joshua-center-job-apps.onrender.com',
      // Local development 
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Always allow the Render.com domain in production
    if (IS_PRODUCTION && origin && origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    // Allow requests with no origin in development (like mobile apps or curl requests)
    if (!IS_PRODUCTION && !origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Cache-Control', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  // Set a long maxAge for the CORS preflight response cache
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Uploads folder is available publicly
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Root route for API server check
app.get('/api-status', (req, res) => {
  res.send('Job Application API Server Running');
});

// In production, serve static files from the built frontend
if (IS_PRODUCTION) {
  // Check if the build directory exists
  const frontendBuildPath = path.join(__dirname, '../src/dist');
  
  try {
    if (fsSync.existsSync(frontendBuildPath)) {
      console.log(`Serving static files from: ${frontendBuildPath}`);
      
      // Serve static files from the React build
      app.use(express.static(frontendBuildPath));
      
      // Create a specific "catch-all" route for SPA that should come AFTER API routes
      // but BEFORE the 404 handler
      app.get('/', (req, res) => {
        // Send the main index.html for root requests
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
      });
      
      // Serve the React app for any routes that aren't API/auth/uploads
      app.use((req, res, next) => {
        // Skip API and other special routes
        if (req.path.startsWith('/api') || 
            req.path.startsWith('/auth') || 
            req.path.startsWith('/uploads') || 
            req.path.startsWith('/health') ||
            req.path.startsWith('/api-status')) {
          return next();
        }
        
        // For all other routes, serve the React app
        try {
          res.sendFile(path.join(frontendBuildPath, 'index.html'));
        } catch (err) {
          console.error(`Error serving React app for path ${req.path}:`, err);
          next(err);
        }
      });
    } else {
      console.warn(`Frontend build directory not found at: ${frontendBuildPath}`);
    }
  } catch (err) {
    console.error('Error checking for frontend build:', err);
  }
}

// API information route
app.get('/api-info', (req, res) => {
  res.json({
    name: 'Job Application API',
    version: '1.0.0',
    status: 'running'
  });
});

// Database initialization
async function initializeDatabase() {
  try {
    // Read and execute the SQL schema
    const sql = await fs.readFile(path.join(__dirname, 'models/init.sql'), 'utf8');
    db.exec(sql, (err) => {
      if (err) {
        console.error('Database initialization error:', err);
      } else {
        console.log('Database initialized');
        
        // Check if we need to populate with mock data (only in development)
        if (!IS_PRODUCTION) {
          db.get('SELECT COUNT(*) as count FROM Applicant', (err, result) => {
            if (err) {
              console.error('Error checking applicant count:', err);
              return;
            }
            
            // If there are no applicants, generate mock data
            if (result.count === 0) {
              console.log('No applicants found in database, generating mock data...');
              
              // Import and run the mock data generator
              try {
                require('./models/mock_data');
              } catch (err) {
                console.error('Error generating mock data:', err);
              }
            } else {
              console.log(`Database already contains ${result.count} applicants`);
            }
          });
        }
      }
    });
  } catch (err) {
    console.error('Failed to read SQL file:', err);
  }
}

initializeDatabase();

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  // Get the public URL if on Render.com
  const host = process.env.RENDER_EXTERNAL_URL || 
               process.env.SERVER_URL || 
               `http://localhost:${PORT}`;
  
  // If SERVER_URL isn't set but we're on Render, use the Render URL
  if (IS_PRODUCTION && !process.env.SERVER_URL && process.env.RENDER_EXTERNAL_URL) {
    process.env.SERVER_URL = process.env.RENDER_EXTERNAL_URL;
    process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
  }
  
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${IS_PRODUCTION ? 'production' : 'development'}`);
  console.log(`Host URL: ${host}`);
  console.log(`Server URL: ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});