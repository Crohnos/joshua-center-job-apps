// Load environment variables
require('dotenv').config();

// Set critical environment variables early
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
console.log('[PRODUCTION DEBUG] Server starting up...');
console.log('[PRODUCTION DEBUG] Environment:', IS_PRODUCTION ? 'production' : 'development');
console.log('[PRODUCTION DEBUG] Render URL:', process.env.RENDER_EXTERNAL_URL);
console.log('[PRODUCTION DEBUG] Initial SERVER_URL:', process.env.SERVER_URL);
console.log('[PRODUCTION DEBUG] Initial CLIENT_URL:', process.env.CLIENT_URL);

if (IS_PRODUCTION && process.env.RENDER_EXTERNAL_URL) {
  // When running on Render.com, use the provided external URL
  process.env.SERVER_URL = process.env.RENDER_EXTERNAL_URL;
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
  console.log(`[PRODUCTION DEBUG] Setting URLs from Render: ${process.env.RENDER_EXTERNAL_URL}`);
  console.log('[PRODUCTION DEBUG] Updated SERVER_URL:', process.env.SERVER_URL);
  console.log('[PRODUCTION DEBUG] Updated CLIENT_URL:', process.env.CLIENT_URL);
}

const express = require('express');
const db = require('./models/db');
const fs = require('fs').promises;
const fsSync = require('fs');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');

const app = express();

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
    console.log('[PRODUCTION DEBUG] CORS request from origin:', origin);
    
    // In production mode, for debugging let's allow all origins
    if (IS_PRODUCTION) {
      console.log('[PRODUCTION DEBUG] Production mode: allowing all origins temporarily for debugging');
      return callback(null, true);
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
    
    console.log('[PRODUCTION DEBUG] Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin in development (like mobile apps or curl requests)
    if (!origin) {
      console.log('[PRODUCTION DEBUG] No origin provided, allowing request');
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      console.log('[PRODUCTION DEBUG] Origin matched or is Render domain, allowing request');
      callback(null, true);
    } else {
      console.log('[PRODUCTION DEBUG] Origin not in allowed list', origin);
      // For debugging purposes, we'll allow all origins temporarily
      callback(null, true);
      // When debugging is complete, uncomment this and comment the line above:
      // callback(null, false);
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

// API routes
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
    console.log('[PRODUCTION DEBUG] Initializing database...');
    
    const dbPath = path.join(__dirname, 'data/joshua_center.db');
    console.log('[PRODUCTION DEBUG] Database path:', dbPath);
    console.log('[PRODUCTION DEBUG] Database exists:', fsSync.existsSync(dbPath));
    
    if (fsSync.existsSync(dbPath)) {
      const stats = fsSync.statSync(dbPath);
      console.log('[PRODUCTION DEBUG] Database file size:', stats.size, 'bytes');
      console.log('[PRODUCTION DEBUG] Database last modified:', stats.mtime);
    }
    
    // Read and execute the SQL schema
    const sql = await fs.readFile(path.join(__dirname, 'models/init.sql'), 'utf8');
    console.log('[PRODUCTION DEBUG] SQL file read, length:', sql.length);
    
    db.exec(sql, (err) => {
      if (err) {
        console.error('[PRODUCTION DEBUG] Database initialization error:', err);
      } else {
        console.log('[PRODUCTION DEBUG] Database initialized successfully');
        
        // Check applicant count in all environments for debugging
        db.get('SELECT COUNT(*) as count FROM Applicant', (err, result) => {
          if (err) {
            console.error('[PRODUCTION DEBUG] Error checking applicant count:', err);
            return;
          }
          
          console.log(`[PRODUCTION DEBUG] Database contains ${result.count} applicants`);
          
          // For debugging in production too, print the first few applicants
          db.all('SELECT id, name, email FROM Applicant LIMIT 3', (err, rows) => {
            if (err) {
              console.error('[PRODUCTION DEBUG] Error fetching sample applicants:', err);
              return;
            }
            
            console.log('[PRODUCTION DEBUG] Sample applicants:', rows);
          });
          
          // If there are no applicants, generate mock data
          if (result.count === 0) {
            console.log('[PRODUCTION DEBUG] No applicants found in database, generating mock data...');
            
            // Import and run the mock data generator 
            // We'll now do this in any environment if the DB is empty
            try {
              console.log('[PRODUCTION DEBUG] Running mock data generator...');
              require('./models/mock_data');
            } catch (err) {
              console.error('[PRODUCTION DEBUG] Error generating mock data:', err);
            }
          } 
        });
      }
    });
  } catch (err) {
    console.error('[PRODUCTION DEBUG] Failed to read SQL file:', err);
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
  // Get the public URL
  const host = process.env.RENDER_EXTERNAL_URL || 
               process.env.SERVER_URL || 
               `http://localhost:${PORT}`;
  
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${IS_PRODUCTION ? 'production' : 'development'}`);
  console.log(`Host URL: ${host}`);
  console.log(`Server URL: ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});