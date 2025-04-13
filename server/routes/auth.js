const express = require('express');
const { passport } = require('../middleware/auth');
const router = express.Router();

// Google OAuth login route
router.get('/google', (req, res, next) => {
  // Store redirect URL in session if provided
  if (req.query.redirectTo) {
    req.session.redirectTo = req.query.redirectTo;
  }
  
  const authOptions = { 
    scope: ['profile', 'email']
  };
  
  passport.authenticate('google', authOptions)(req, res, next);
});

// OAuth callback handling
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true,
    session: true
  }), 
  (req, res) => {
    // If authentication failed with a message, redirect to login with error
    if (req.session.messages && req.session.messages.length) {
      const errorMsg = encodeURIComponent(req.session.messages[req.session.messages.length-1]);
      const errorUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/#/?error=${errorMsg}`;
      return res.redirect(errorUrl);
    }
    
    // For form authentication, add email to query params
    if (req.session.redirectTo && req.session.redirectTo.startsWith('/form')) {
      // Check if redirectTo already has hash format
      const redirectPath = req.session.redirectTo.includes('/#/') 
        ? req.session.redirectTo 
        : `/#${req.session.redirectTo}`;
      
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}?email=${encodeURIComponent(req.user.email)}`;
      return res.redirect(redirectUrl);
    }
    
    // For admin routes, redirect to client URL + admin route with hash format
    const redirectPath = (req.session.redirectTo || '/admin/applicants').includes('/#/') 
      ? (req.session.redirectTo || '/admin/applicants')
      : `/#${req.session.redirectTo || '/admin/applicants'}`;
      
    // Use absolute URL for redirection 
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}`;
    
    res.redirect(redirectUrl);
    delete req.session.redirectTo;
  });

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    // Redirect to the client login page with absolute URL
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/#/`);
  });
});

// Check authentication status
router.get('/check-auth', (req, res) => {
  // Set CORS headers explicitly for this route
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.isAuthenticated()) {
    // Clean user object to avoid circular references
    const safeUserData = {
      id: req.user.id || null,
      email: req.user.email || null,
      name: req.user.name || null,
      firstName: req.user.firstName || null,
      lastName: req.user.lastName || null,
      isAdmin: req.user.isAdmin || false
    };
    
    return res.status(200).json({ 
      authenticated: true, 
      user: safeUserData
    });
  }
  
  return res.status(200).json({ 
    authenticated: false, 
    message: 'Not authenticated'
  });
});

// Development endpoint for quick login without Google OAuth
if (process.env.NODE_ENV !== 'production' && process.env.USE_DEV_MODE === 'true') {
  router.get('/dev-login', (req, res) => {
    // Log in the user with the dev account
    req.login({ email: 'dev@example.com', name: 'Dev User', isAdmin: true }, err => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Redirect to the client with query params
      const redirectTo = req.query.redirectTo || '/admin/applicants';
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectTo}`;
      
      if (redirectTo.startsWith('/form')) {
        res.redirect(`${redirectUrl}?email=dev@example.com`);
      } else {
        res.redirect(redirectUrl);
      }
    });
  });
}

module.exports = router;