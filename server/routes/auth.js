const express = require('express');
const { passport } = require('../middleware/auth');
const router = express.Router();

// Google OAuth login route
router.get('/google', (req, res, next) => {
  // Store redirect URL in session if provided
  if (req.query.redirectTo) {
    req.session.redirectTo = req.query.redirectTo;
    console.log(`OAuth login initiated with redirectTo: ${req.query.redirectTo}`);
  } else {
    console.log('OAuth login initiated without redirect URL');
  }
  
  console.log(`Current Environment: ${process.env.NODE_ENV}`);
  console.log(`Server URL: ${process.env.SERVER_URL}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`Render URL: ${process.env.RENDER_EXTERNAL_URL}`);
  
  const authOptions = { 
    scope: ['profile', 'email']
  };
  
  passport.authenticate('google', authOptions)(req, res, next);
});

// OAuth callback handling
router.get('/google/callback', 
  (req, res, next) => {
    console.log('Google OAuth callback received');
    console.log(`Callback query params: ${JSON.stringify(req.query)}`);
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true,
    session: true
  }), 
  (req, res) => {
    console.log('OAuth authentication successful');
    
    // If authentication failed with a message, redirect to login with error
    if (req.session.messages && req.session.messages.length) {
      const errorMsg = encodeURIComponent(req.session.messages[req.session.messages.length-1]);
      const errorUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/#/?error=${errorMsg}`;
      console.log(`Authentication error, redirecting to: ${errorUrl}`);
      return res.redirect(errorUrl);
    }
    
    console.log(`User authenticated: ${req.user?.email}`);
    console.log(`Session redirectTo: ${req.session.redirectTo || '(none)'}`);
    
    // For form authentication, add email to query params
    if (req.session.redirectTo && req.session.redirectTo.startsWith('/form')) {
      // Check if redirectTo already has hash format
      const redirectPath = req.session.redirectTo.includes('/#/') 
        ? req.session.redirectTo 
        : `/#${req.session.redirectTo}`;
      
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}?email=${encodeURIComponent(req.user.email)}`;
      console.log(`Form auth redirect to: ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    
    // For admin routes, always redirect to admin dashboard
    // Only use redirectTo if it contains /admin/, otherwise force admin/applicants
    let targetPath = '/admin/applicants';
    if (req.session.redirectTo && req.session.redirectTo.includes('/admin/')) {
      targetPath = req.session.redirectTo;
    }
    
    // Ensure proper hash format
    const redirectPath = targetPath.includes('/#/') 
      ? targetPath
      : `/#${targetPath}`;
      
    // Use absolute URL for redirection 
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${redirectPath}`;
    
    console.log(`Admin redirect path: ${redirectPath}`);
    
    console.log(`Redirecting after auth to: ${redirectUrl}`);
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
  console.log('Check Auth endpoint accessed');
  
  // Log request headers for debugging
  console.log(`Request origin: ${req.headers.origin}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  // Set CORS headers explicitly for this route
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  console.log(`Session ID: ${req.sessionID || 'none'}`);
  console.log(`Is Authenticated: ${req.isAuthenticated()}`);
  
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
    
    console.log(`Returning authenticated user: ${safeUserData.email}`);
    
    return res.status(200).json({ 
      authenticated: true, 
      user: safeUserData
    });
  }
  
  console.log('User not authenticated');
  
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

// OAuth config test endpoint (available in all environments)
router.get('/oauth-config', (req, res) => {
  const { passport } = require('../middleware/auth');
  
  // Get Google strategy configuration
  let googleStrategy = null;
  passport._strategies.google && (googleStrategy = passport._strategies.google);
  
  const config = {
    environment: process.env.NODE_ENV,
    renderUrl: process.env.RENDER_EXTERNAL_URL,
    serverUrl: process.env.SERVER_URL,
    clientUrl: process.env.CLIENT_URL,
    oauthCallbackConfigured: googleStrategy ? googleStrategy._oauth2._customHeaders.callbackURL : 'unknown',
    strategyName: googleStrategy ? googleStrategy.name : 'unknown'
  };
  
  res.json(config);
});

module.exports = router;