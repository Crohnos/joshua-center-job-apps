const express = require('express');
const { passport } = require('../middleware/auth');
const router = express.Router();

router.get('/google', (req, res, next) => {
  console.log('=== AUTH DEBUG ===');
  console.log('Auth route hit: /google');
  console.log('req.session:', req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Not set',
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL
  });
  
  // Store redirect URL in session if provided
  if (req.query.redirectTo) {
    console.log(`Storing redirectTo: ${req.query.redirectTo}`);
    req.session.redirectTo = req.query.redirectTo;
  }
  
  const authOptions = { 
    scope: ['profile', 'email'],
    // Add dummy email to query for development mode
    ...(process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_CLIENT_ID && { 
      state: JSON.stringify({ email: 'dev@example.com', name: 'Dev User' })
    })
  };
  
  console.log('Auth options:', authOptions);
  console.log('=== END AUTH DEBUG ===');
  
  passport.authenticate('google', authOptions)(req, res, next);
});

router.get('/google/callback', 
  (req, res, next) => {
    console.log('=== CALLBACK DEBUG - Before Authentication ===');
    console.log('Callback route hit: /google/callback');
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('Session data:', req.session);
    console.log('Request query params:', req.query);
    console.log('Request cookies:', req.headers.cookie);
    console.log('=== END CALLBACK DEBUG - Before Authentication ===');
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true,
    session: true // Explicitly enable session
  }), 
  (req, res) => {
    console.log('=== CALLBACK DEBUG - After Authentication ===');
    console.log('Auth callback completed successfully');
    console.log('Session ID:', req.sessionID);
    console.log('Session data after auth:', req.session);
    console.log('User authenticated:', !!req.user);
    console.log('User details:', req.user);
    console.log('RedirectTo from session:', req.session.redirectTo);
    console.log('Messages:', req.session.messages);
    
    // If authentication failed with a message, redirect to login with error
    if (req.session.messages && req.session.messages.length) {
      const errorMsg = encodeURIComponent(req.session.messages[req.session.messages.length-1]);
      const errorUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/#/?error=${errorMsg}`;
      console.log(`Auth failed with message. Redirecting to: ${errorUrl}`);
      return res.redirect(errorUrl);
    }
    
    // For form authentication, add email to query params
    if (req.session.redirectTo && req.session.redirectTo.startsWith('/form')) {
      // Check if redirectTo already has hash format
      const redirectPath = req.session.redirectTo.includes('/#/') 
        ? req.session.redirectTo 
        : `/#${req.session.redirectTo}`;
      
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}?email=${encodeURIComponent(req.user.email)}`;
      console.log(`Form auth. Redirecting to: ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    
    // For admin routes, redirect to client URL + admin route with hash format
    const redirectPath = (req.session.redirectTo || '/admin/applicants').includes('/#/') 
      ? (req.session.redirectTo || '/admin/applicants')
      : `/#${req.session.redirectTo || '/admin/applicants'}`;
      
    // Use absolute URL for redirection 
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}`;
    console.log(`Admin auth. Redirecting to: ${redirectUrl}`);
    console.log('=== END CALLBACK DEBUG - After Authentication ===');
    
    res.redirect(redirectUrl);
    delete req.session.redirectTo;
  });

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    // Redirect to the client login page with absolute URL
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/#/`);
  });
});

router.get('/check-auth', (req, res) => {
  console.log('=== CHECK AUTH DEBUG ===');
  console.log('Check auth hit, session ID:', req.sessionID);
  console.log('isAuthenticated:', req.isAuthenticated());
  console.log('Session data:', req.session);
  console.log('Session cookie:', req.cookies);
  console.log('User:', req.user);
  console.log('=== END CHECK AUTH DEBUG ===');
  
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