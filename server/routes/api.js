const express = require('express');
const { isAdmin } = require('../middleware/auth');
const { 
  submitApplicant, 
  getApplicants, 
  getApplicant, 
  updateApplicant, 
  checkEmailExists,
  sendVerificationCode,
  verifyCode
} = require('../controllers/applicant');
const { getUsers, addUser, updateUser, deleteUser } = require('../controllers/user');
const { getLocations, addLocation, updateLocation, deleteLocation } = require('../controllers/location');
const db = require('../models/db');

const router = express.Router();

// Applicant routes
router.post('/applicants', submitApplicant);
router.get('/applicants', isAdmin, getApplicants);
router.get('/applicants/:id', isAdmin, getApplicant);
router.put('/applicants/:id', isAdmin, updateApplicant);
router.get('/check-email/:email', checkEmailExists);

// Email verification routes
router.post('/verify-email', sendVerificationCode);
router.post('/verify-code', verifyCode);

// User routes
router.get('/users', isAdmin, getUsers);
router.post('/users', isAdmin, addUser);
router.put('/users/:id', isAdmin, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);

// Location routes
router.get('/locations', getLocations);
router.post('/locations', isAdmin, addLocation);
router.put('/locations/:id', isAdmin, updateLocation);
router.delete('/locations/:id', isAdmin, deleteLocation);

module.exports = router;