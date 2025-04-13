const db = require('./db');
const fs = require('fs');
const path = require('path');

// Simple script to populate the database with sample data
console.log('Populating database with sample data...');

// Read SQL file
const sqlPath = path.join(__dirname, 'sample_data.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Execute SQL
db.exec(sql, (err) => {
  if (err) {
    console.error('Error populating database:', err);
    process.exit(1);
  }
  
  // Verify the data was inserted
  db.all('SELECT COUNT(*) as count FROM Applicant', [], (err, result) => {
    if (err) {
      console.error('Error verifying data:', err);
      process.exit(1);
    }
    
    console.log(`Database now contains ${result[0].count} applicants`);
    
    // Get the first few records to verify
    db.all('SELECT id, name, email FROM Applicant LIMIT 3', (err, rows) => {
      if (err) {
        console.error('Error fetching sample:', err);
        process.exit(1);
      }
      
      console.log('Sample applicants:', rows);
      console.log('Database population complete!');
      process.exit(0);
    });
  });
});