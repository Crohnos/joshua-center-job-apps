const db = require('../models/db');

function getLocations(req, res) {
  db.all('SELECT * FROM Location ORDER BY name', (err, rows) => {
    if (err) {
      console.error('Error fetching locations:', err);
      return res.status(500).send(`Error fetching locations: ${err.message}`);
    }
    res.json(rows);
  });
}

function addLocation(req, res) {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).send('Location name is required');
  }
  
  db.run('INSERT INTO Location (name) VALUES (?)', [name], function(err) {
    if (err) {
      // Check for duplicate name error
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).send('A location with this name already exists');
      }
      console.error('Error adding location:', err);
      return res.status(400).send(`Location addition failed: ${err.message}`);
    }
    res.status(201).json({ id: this.lastID, message: 'Location added successfully' });
  });
}

function updateLocation(req, res) {
  const id = req.params.id;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).send('Location name is required');
  }
  
  db.run('UPDATE Location SET name = ? WHERE id = ?', [name, id], function(err) {
    if (err) {
      // Check for duplicate name error
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).send('A location with this name already exists');
      }
      console.error('Error updating location:', err);
      return res.status(500).send(`Update failed: ${err.message}`);
    }
    
    if (this.changes === 0) {
      return res.status(404).send('Location not found');
    }
    
    res.json({ message: 'Location updated successfully' });
  });
}

function deleteLocation(req, res) {
  const id = req.params.id;
  
  // First check if this location is used by any applicants
  db.get('SELECT COUNT(*) as count FROM AppliedLoc WHERE location_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error checking location usage:', err);
      return res.status(500).send(`Delete failed: ${err.message}`);
    }
    
    if (result.count > 0) {
      return res.status(400).send(`Cannot delete location: used by ${result.count} applicant(s)`);
    }
    
    // Safe to delete
    db.run('DELETE FROM Location WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting location:', err);
        return res.status(500).send(`Delete failed: ${err.message}`);
      }
      
      if (this.changes === 0) {
        return res.status(404).send('Location not found');
      }
      
      res.json({ message: 'Location deleted successfully' });
    });
  });
}

module.exports = { getLocations, addLocation, updateLocation, deleteLocation };
