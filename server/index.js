// Load environment variables
require('dotenv').config();

// Set critical environment variables early
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
console.log('Server starting up...');
console.log('Environment:', IS_PRODUCTION ? 'production' : 'development');

if (IS_PRODUCTION && process.env.RENDER_EXTERNAL_URL) {
  // When running on Render.com, use the provided external URL
  process.env.SERVER_URL = process.env.RENDER_EXTERNAL_URL;
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
  console.log(`Setting URLs from Render: ${process.env.RENDER_EXTERNAL_URL}`);
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

// Simple CORS configuration - allow all origins for this application
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Cache-Control', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
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

// Sample PDF generation
async function generateSamplePDFs() {
  try {
    // Import the PDF generator module
    const generatePDFs = require('./generate-sample-pdfs');
    generatePDFs(); // Call the function to generate PDFs
  } catch (err) {
    console.error('Error generating sample PDFs:', err);
  }
}

// Database initialization
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check database tables exist before overwriting schema
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='User'", async (tableErr, tableResult) => {
      if (tableErr) {
        console.error('Error checking for existing tables:', tableErr);
      }
      
      // If User table doesn't exist, initialize the database schema
      if (!tableResult) {
        console.log('Setting up database schema...');
        // Read and execute the SQL schema
        const schema = await fs.readFile(path.join(__dirname, 'models/init.sql'), 'utf8');
        
        db.exec(schema, async (err) => {
      if (err) {
        console.error('Database initialization error:', err);
        return;
      } 
      
      console.log('Database schema initialized');
      
      // Check if we need to add sample data
      db.get('SELECT COUNT(*) as count FROM Applicant', async (err, result) => {
        if (err) {
          console.error('Error checking applicant count:', err);
          return;
        }
        
        // If database is empty, add essential sample data
        if (result.count === 0) {
          console.log('Adding sample data...');
          try {
            // Load and execute essential data SQL
            const essentialData = await fs.readFile(path.join(__dirname, 'models/essential_data.sql'), 'utf8');
            db.exec(essentialData, async (err) => {
              if (err) {
                console.error('Error adding essential sample data:', err);
              } else {
                console.log('Essential sample data added successfully');
                
                // Generate sample PDFs for the resumes after sample data is added
                generateSamplePDFs();
              }
            });
          } catch (err) {
            console.error('Error reading essential data file:', err);
          }
        } else {
          console.log(`Database already contains ${result.count} applicants`);
          
          // Check if we have locations (required for application to function)
          db.get('SELECT COUNT(*) as count FROM Location', async (err, locationResult) => {
            if (err) {
              console.error('Error checking location count:', err);
              return;
            }
            
            // If no locations exist, add only the default locations (needed for functionality)
            if (locationResult.count === 0) {
              console.log('Adding default locations...');
              try {
                // A simplified SQL to just add the locations
                const locationSql = `
                  INSERT OR IGNORE INTO Location (name) VALUES ('Fayetteville');
                  INSERT OR IGNORE INTO Location (name) VALUES ('Rogers');
                  INSERT OR IGNORE INTO Location (name) VALUES ('Siloam Springs');
                  INSERT OR IGNORE INTO Location (name) VALUES ('Conway');
                  INSERT OR IGNORE INTO Location (name) VALUES ('Jonesboro');
                `;
                db.exec(locationSql, (err) => {
                  if (err) {
                    console.error('Error adding default locations:', err);
                  } else {
                    console.log('Default locations added successfully');
                  }
                });
              } catch (err) {
                console.error('Error adding default locations:', err);
              }
            }
          });
          
          // Ensure PDFs exist but don't add more sample data
          generateSamplePDFs();
        }
      });
    });
      } else {
        console.log('Database schema already exists, skipping initialization');
        // Just ensure sample PDFs exist
        generateSamplePDFs();
      }
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
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