const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Store verification codes in memory (in production, you'd use a database)
const verificationCodes = new Map();

// Generate a random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure storage for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
    }
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('resume');

function submitApplicant(req, res) {
  upload(req, res, (err) => {
    if (err) return res.status(500).send(`File upload failed: ${err.message}`);
    
    try {
      const data = JSON.parse(req.body.data);
      const resumePath = `/uploads/${req.file.filename}`;
      
      const sql = `
        INSERT INTO Applicant (
          email, name, address, city, state, zip, phone, us_citizen, felony_conviction, felony_explanation,
          dual_relationships, dual_relationships_explanation, interests, why_joshua_center, ethical_framework_thoughts,
          populations, education, previous_employer, previous_employer_address, previous_employer_city,
          previous_employer_state, previous_employer_zip, previous_employer_phone, previous_employer_title,
          previous_employer_length, previous_employer_reason_leaving, other_employment, languages, gender,
          race_ethnicity, resume_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        data.email, data.name, data.address, data.city, data.state, data.zip, data.phone, 
        data.usCitizen ? 1 : 0, data.felonyConviction ? 1 : 0, data.felonyExplanation || null, 
        data.dualRelationships, data.dualRelationshipsExplanation || null,
        data.interests, data.whyJoshuaCenter, data.ethicalFrameworkThoughts, 
        JSON.stringify(data.populations),
        data.education, data.previousEmployer, data.previousEmployerAddress, data.previousEmployerCity,
        data.previousEmployerState, data.previousEmployerZip, data.previousEmployerPhone, 
        data.previousEmployerTitle, data.previousEmployerLength, data.previousEmployerReasonLeaving, 
        data.otherEmployment || null, data.languages, data.gender, data.raceEthnicity, resumePath
      ];
      
      db.run(sql, params, function(err) {
        if (err) {
          console.error('Application submission error:', err);
          return res.status(400).send(`Application submission failed: ${err.message}`);
        }
        
        const applicantId = this.lastID;
        let referencePromises = [];
        let locationPromises = [];
        
        // Insert references
        if (Array.isArray(data.references) && data.references.length >= 3) {
          data.references.forEach(ref => {
            const refPromise = new Promise((resolve, reject) => {
              db.run(
                'INSERT INTO Reference (applicant_id, name, relationship, phone, email, type) VALUES (?, ?, ?, ?, ?, ?)',
                [applicantId, ref.name, ref.relationship, ref.phone, ref.email, ref.type],
                err => err ? reject(err) : resolve()
              );
            });
            referencePromises.push(refPromise);
          });
        } else {
          return res.status(400).send('At least three references are required');
        }
        
        // Insert applied locations
        if (Array.isArray(data.locations) && data.locations.length > 0) {
          data.locations.forEach(locId => {
            const locPromise = new Promise((resolve, reject) => {
              db.run(
                'INSERT INTO AppliedLoc (applicant_id, location_id) VALUES (?, ?)', 
                [applicantId, locId],
                err => err ? reject(err) : resolve()
              );
            });
            locationPromises.push(locPromise);
          });
        } else {
          return res.status(400).send('At least one location must be selected');
        }
        
        // Wait for all inserts to complete
        Promise.all([...referencePromises, ...locationPromises])
          .then(() => res.status(201).send({ message: 'Application submitted successfully', id: applicantId }))
          .catch(err => {
            console.error('Error saving references or locations:', err);
            res.status(500).send(`Error saving application details: ${err.message}`);
          });
      });
    } catch (err) {
      console.error('Error processing application:', err);
      res.status(400).send(`Error processing application: ${err.message}`);
    }
  });
}

function getApplicants(req, res) {
  console.log('getApplicants called');
  
  // Use the same database connection for consistency
  const query = `
    SELECT a.id, a.email, a.name, a.application_status, a.assigned_employee_id,
           u.first_name || ' ' || u.last_name as assigned_to
    FROM Applicant a
    LEFT JOIN User u ON a.assigned_employee_id = u.id
    ORDER BY a.id DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching applicants:', err);
      return res.status(500).json({ error: `Error fetching applicants: ${err.message}` });
    }
    
    console.log(`Found ${rows.length} applicants in database`);
    
    // Check for null values that might cause issues
    const sanitizedRows = rows.map(row => {
      // Replace any null values with appropriate defaults
      return {
        id: row.id,
        email: row.email || '',
        name: row.name || '',
        application_status: row.application_status || 'not viewed',
        assigned_employee_id: row.assigned_employee_id || null,
        assigned_to: row.assigned_to || null
      };
    });
    
    res.setHeader('Cache-Control', 'no-store');
    res.json(sanitizedRows);
  });
}

function getApplicant(req, res) {
  const id = req.params.id;
  console.log(`Getting details for applicant ID: ${id}`);
  
  // Use the established database connection
  db.get('SELECT * FROM Applicant WHERE id = ?', [id], (err, applicant) => {
    if (err) {
      console.error('Error fetching applicant:', err);
      return res.status(500).send(`Error fetching applicant: ${err.message}`);
    }
    
    if (!applicant) {
      return res.status(404).send('Applicant not found');
    }
    
    console.log(`Found applicant: ${applicant.name}`);
    
    // Parse JSON fields
    try {
      applicant.populations = JSON.parse(applicant.populations);
    } catch (e) {
      applicant.populations = [];
    }
    
    // Get references
    db.all('SELECT * FROM Reference WHERE applicant_id = ?', [id], (refErr, refs) => {
      if (refErr) {
        console.error('Error fetching references:', refErr);
        return res.status(500).send(`Error fetching references: ${refErr.message}`);
      }
      
      console.log(`Found ${refs.length} references`);
      
      // Get locations
      db.all(
        `SELECT l.* FROM AppliedLoc al 
         JOIN Location l ON al.location_id = l.id 
         WHERE al.applicant_id = ?`, 
        [id], 
        (locErr, locs) => {
          if (locErr) {
            console.error('Error fetching locations:', locErr);
            return res.status(500).send(`Error fetching locations: ${locErr.message}`);
          }
          
          console.log(`Found ${locs.length} applied locations`);
          
          // Combine all data
          applicant.references = refs;
          applicant.locations = locs;
          
          res.json(applicant);
        }
      );
    });
  });
}

function updateApplicant(req, res) {
  const id = req.params.id;
  const { status, employeeId } = req.body;
  
  if (!status) {
    return res.status(400).send('Status is required');
  }
  
  const validStatuses = ['not viewed', 'in review', 'rejected', 'accepted'];
  if (!validStatuses.includes(status)) {
    return res.status(400).send(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  db.run(
    'UPDATE Applicant SET application_status = ?, assigned_employee_id = ? WHERE id = ?',
    [status, employeeId || null, id], 
    (err) => {
      if (err) {
        console.error('Error updating applicant:', err);
        return res.status(500).send(`Update failed: ${err.message}`);
      }
      res.json({ message: 'Applicant updated successfully' });
    }
  );
}

// Check if an email has already been used for an application
function checkEmailExists(req, res) {
  const { email } = req.params;
  
  if (!email) {
    return res.status(400).send('Email is required');
  }
  
  db.get('SELECT id, name, application_status FROM Applicant WHERE email = ?', [email], (err, applicant) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send(`Error checking email: ${err.message}`);
    }
    
    if (applicant) {
      // Return information about the existing application
      return res.json({ 
        exists: true, 
        applicant: {
          id: applicant.id,
          name: applicant.name,
          status: applicant.application_status
        }
      });
    }
    
    // Email not found in database
    res.json({ exists: false });
  });
}

// Generate and send verification code (simulated)
function sendVerificationCode(req, res) {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Check if email format is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Generate a verification code
  const code = generateVerificationCode();
  
  // Store the code with an expiration (15 minutes)
  verificationCodes.set(email, {
    code,
    expires: Date.now() + (15 * 60 * 1000) // 15 minutes
  });
  
  // In a real implementation, you would send an email here
  console.log(`[DEV] Verification code for ${email}: ${code}`);
  
  // For demo purposes, we'll return the code in the response
  // In production, you would only send it via email
  res.json({ 
    message: 'Verification code sent',
    // In production remove this line and actually send an email
    code // Only include this in development
  });
}

// Verify code
function verifyCode(req, res) {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }
  
  const verification = verificationCodes.get(email);
  
  // Check if verification exists and is valid
  if (!verification) {
    return res.status(400).json({ error: 'No verification code found for this email' });
  }
  
  if (verification.expires < Date.now()) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: 'Verification code has expired' });
  }
  
  if (verification.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  
  // Code is valid, clean up and create session
  verificationCodes.delete(email);
  
  // Store verification status (no longer using sessions)
  // This would be better stored in the database in a real application
  verificationCodes.set(`verified_${email}`, { 
    verified: true,
    timestamp: Date.now()
  });
  
  // Return success with verified email
  res.json({ 
    verified: true, 
    email
  });
}

module.exports = { 
  submitApplicant, 
  getApplicants, 
  getApplicant, 
  updateApplicant, 
  checkEmailExists,
  sendVerificationCode,
  verifyCode
};
