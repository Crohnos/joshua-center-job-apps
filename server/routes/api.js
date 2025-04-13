const express = require('express');
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
router.get('/applicants', getApplicants);
router.get('/applicants/:id', getApplicant);
router.put('/applicants/:id', updateApplicant);
router.get('/check-email/:email', checkEmailExists);

// Email verification routes
router.post('/verify-email', sendVerificationCode);
router.post('/verify-code', verifyCode);

// User routes
router.get('/users', getUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Location routes
router.get('/locations', getLocations);
router.post('/locations', addLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

module.exports = router;