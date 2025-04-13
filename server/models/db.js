const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Always use the database in the server root directory which contains the actual data
const dbPath = path.join(__dirname, '../joshua_center.db');

// Log detailed info about this database connection
console.log(`Using database at: ${dbPath}`);
console.log(`Database exists: ${fs.existsSync(dbPath)}`);
console.log(`Full path: ${path.resolve(dbPath)}`);

// Ensure the database exists and is accessible
if (!fs.existsSync(dbPath)) {
  console.error(`ERROR: Database file does not exist at ${dbPath}`);
  
  // Copy from data dir if it exists there as fallback
  const dataDbPath = path.join(__dirname, '../data/joshua_center.db');
  if (fs.existsSync(dataDbPath)) {
    try {
      fs.copyFileSync(dataDbPath, dbPath);
      console.log(`Copied database from ${dataDbPath} to ${dbPath}`);
    } catch (err) {
      console.error(`Failed to copy database: ${err.message}`);
    }
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Verify we can access data
    db.get("SELECT COUNT(*) as count FROM Applicant", (err, result) => {
      if (err) {
        console.error("Failed to query Applicant table:", err.message);
      } else {
        console.log(`Database contains ${result.count} applicants`);
      }
    });
  }
});

module.exports = db;