// Load environment variables
require('dotenv').config();

const express = require('express');
const db = require('./models/db');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { passport, session } = require('./middleware/auth');

const app = express();

// Trust proxy - needed for secure cookies behind a proxy/load balancer
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// Set up CORS with appropriate settings for cross-domain cookies
const corsOptions = {
  // Allow multiple origins (both production and development)
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173', 
      'https://joshua-center-job-apps-app.onrender.com',
      // Local development 
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Cache-Control', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
};

console.log('Setting up CORS with options:', {
  ...corsOptions,
  origin: 'Function configured with allowed origins'
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Job Application API Server Running');
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
        
        // Check if we need to populate with mock data
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});