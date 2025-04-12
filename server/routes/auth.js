const express = require('express');
const { passport } = require('../middleware/auth');
const router = express.Router();

router.get('/google', (req, res, next) => {
  console.log('Auth route hit: /google');
  
  // Store redirect URL in session if provided
  if (req.query.redirectTo) {
    console.log(`Storing redirectTo: ${req.query.redirectTo}`);
    req.session.redirectTo = req.query.redirectTo;
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    // Add dummy email to query for development mode
    ...(process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_CLIENT_ID && { 
      state: JSON.stringify({ email: 'dev@example.com', name: 'Dev User' })
    })
  })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true 
  }), 
  (req, res) => {
    console.log('Auth callback hit: /google/callback');
    console.log('User:', req.user);
    console.log('RedirectTo:', req.session.redirectTo);
    
    // If authentication failed with a message, redirect to login with error
    if (req.session.messages && req.session.messages.length) {
      const errorMsg = encodeURIComponent(req.session.messages[req.session.messages.length-1]);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=${errorMsg}`);
    }
    
    // For form authentication, add email to query params
    if (req.session.redirectTo && req.session.redirectTo.startsWith('/form')) {
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${req.session.redirectTo}?email=${encodeURIComponent(req.user.email)}`;
      console.log(`Redirecting to: ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    
    // For admin routes, redirect to client URL + admin route
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${req.session.redirectTo || '/admin/applicants'}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
    delete req.session.redirectTo;
  });

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    // Redirect to the client login page instead of server root
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/`);
  });
});

router.get('/check-auth', (req, res) => {
  console.log('Check auth hit, isAuthenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  }
  return res.status(401).json({ authenticated: false });
});

// Development endpoint for quick login without Google OAuth
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev-login', (req, res) => {
    console.log('Development login endpoint hit');
    
    // Log in the user with the dev account
    req.login({ email: 'dev@example.com', name: 'Dev User' }, err => {
      if (err) {
        console.error('Error during dev login:', err);
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