const db = require('../models/db');

function getUsers(req, res) {
  db.all('SELECT * FROM User ORDER BY last_name', (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send(`Error fetching users: ${err.message}`);
    }
    res.json(rows);
  });
}

function addUser(req, res) {
  const { email, firstName, lastName } = req.body;
  
  if (!email || !firstName || !lastName) {
    return res.status(400).send('Email, first name, and last name are required');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }
  
  db.run(
    'INSERT INTO User (email, first_name, last_name) VALUES (?, ?, ?)', 
    [email, firstName, lastName], 
    function(err) {
      if (err) {
        // Check for duplicate email error
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).send('A user with this email already exists');
        }
        console.error('Error adding user:', err);
        return res.status(400).send(`User addition failed: ${err.message}`);
      }
      res.status(201).json({ id: this.lastID, message: 'User added successfully' });
    }
  );
}

function updateUser(req, res) {
  const id = req.params.id;
  const { active, firstName, lastName } = req.body;
  
  if (active === undefined && !firstName && !lastName) {
    return res.status(400).send('No update parameters provided');
  }
  
  let sql, params;
  
  if (active !== undefined && firstName && lastName) {
    // Update all fields
    sql = 'UPDATE User SET active = ?, first_name = ?, last_name = ? WHERE id = ?';
    params = [active ? 1 : 0, firstName, lastName, id];
  } else if (active !== undefined) {
    // Update only active status
    sql = 'UPDATE User SET active = ? WHERE id = ?';
    params = [active ? 1 : 0, id];
  } else {
    // Update only name fields
    sql = 'UPDATE User SET first_name = ?, last_name = ? WHERE id = ?';
    params = [firstName, lastName, id];
  }
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send(`Update failed: ${err.message}`);
    }
    
    if (this.changes === 0) {
      return res.status(404).send('User not found');
    }
    
    res.json({ message: 'User updated successfully' });
  });
}

function deleteUser(req, res) {
  const id = req.params.id;
  
  // First check if this user is assigned to any applicants
  db.get('SELECT COUNT(*) as count FROM Applicant WHERE assigned_employee_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error checking user assignments:', err);
      return res.status(500).send(`Delete failed: ${err.message}`);
    }
    
    if (result.count > 0) {
      return res.status(400).send(`Cannot delete user: assigned to ${result.count} applicant(s)`);
    }
    
    // Safe to delete
    db.run('DELETE FROM User WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send(`Delete failed: ${err.message}`);
      }
      
      if (this.changes === 0) {
        return res.status(404).send('User not found');
      }
      
      res.json({ message: 'User deleted successfully' });
    });
  });
}

module.exports = { getUsers, addUser, updateUser, deleteUser };
