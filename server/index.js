// Load environment variables
require('dotenv').config();

const express = require('express');
const db = require('./models/db');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { passport, session } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
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
    const sql = await fs.readFile(path.join(__dirname, 'models/init.sql'), 'utf8');
    db.exec(sql, (err) => {
      if (err) console.error('Database initialization error:', err);
      else console.log('Database initialized');
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