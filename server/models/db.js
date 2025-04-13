const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use the database file in the server root directory since it has the data
let dbPath = path.join(__dirname, '../joshua_center.db');

// If that doesn't exist, fall back to the one in the data directory
// This ensures compatibility with both development and production environments
if (!fs.existsSync(dbPath)) {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  dbPath = path.join(dataDir, 'joshua_center.db');
}

console.log(`Using database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

module.exports = db;