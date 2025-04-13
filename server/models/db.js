const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// For Render.com, we MUST use the data directory for the database
// since the root directory may be read-only in their container environment
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Use the database in the data directory which will persist
const dbPath = path.join(dataDir, 'joshua_center.db');

// Log detailed info about this database connection
console.log(`Using database at: ${dbPath}`);
console.log(`Database exists: ${fs.existsSync(dbPath)}`);
console.log(`Full path: ${path.resolve(dbPath)}`);

// Connect to the database - it will be created if it doesn't exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;