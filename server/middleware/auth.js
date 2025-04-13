const passport = require('passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');
const db = require('../models/db');

// Setup passport and session
const passportSetup = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const SESSION_SECRET = process.env.SESSION_SECRET;
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';
  
  // Use development mode only if explicitly set and not in production
  const USE_DEV_MODE = process.env.USE_DEV_MODE === 'true' && !IS_PRODUCTION;
  
  if (USE_DEV_MODE) {
    // DummyStrategy for development only - never runs in production
    const DummyStrategy = function() {
      this.name = 'google';
      this.authenticate = function(req) {
        const email = 'dev@example.com';
        const user = { email: email, name: 'Dev User' };
        return this.success(user);
      };
    };
    
    passport.use(new DummyStrategy());
  } else if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('ERROR: Google OAuth credentials not set');
    if (IS_PRODUCTION) {
      throw new Error('Google OAuth credentials required in production');
    } else {
      console.warn('Development mode without OAuth credentials. Use USE_DEV_MODE=true for dev auth');
    }
  } else {
    // Use the real Google strategy
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    // For production on Render.com, use the Render external URL if available
    // Hardcode the callback URL for now to ensure exact matching
    const callbackURL = 'https://joshua-center-job-apps.onrender.com/auth/google/callback';
      
    console.log(`Google OAuth callback URL (hardcoded): ${callbackURL}`);
    
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user data from Google profile
        const email = profile.emails[0].value;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const displayName = profile.displayName || `${firstName} ${lastName}`;
        
        // Find user in database
        db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
          if (err) {
            return done(err);
          }
          
          if (user) {
            // User exists, check if active
            if (!user.active) {
              return done(null, false, { message: 'Account is disabled' });
            }
            
            // Return the user
            return done(null, { 
              id: user.id,
              email, 
              name: displayName,
              firstName: user.first_name,
              lastName: user.last_name,
              active: user.active,
              isAdmin: user.is_admin === 1
            });
          } else {
            // User not found - we don't create users automatically
            // They must be pre-created by an admin
            return done(null, false, { message: 'Unauthorized user' });
          }
        });
      } catch (error) {
        return done(error);
      }
    }));
  }
};

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
    if (err) {
      return done(err);
    }
    
    if (!user) {
      return done(null, false);
    }
    
    const userData = { 
      id: user.id, 
      email, 
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      active: user.active,
      isAdmin: user.is_admin === 1
    };
    
    done(null, userData);
  });
});

// Admin authorization middleware
function isAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      authenticated: false,
      message: 'Please log in again'
    });
  }
  
  // Check if user exists, is active, AND has admin role
  db.get('SELECT * FROM User WHERE email = ? AND active = 1 AND is_admin = 1', [req.user.email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Server Error' });
    }
    
    if (!row) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Your account is not active or does not have admin privileges'
      });
    }
    
    req.user.id = row.id;
    req.user.isAdmin = true;
    next();
  });
}

// Initialize passport
passportSetup();

// Create session middleware with secure configuration
const sessionMiddleware = () => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    console.error('ERROR: SESSION_SECRET must be set in environment variables');
    if (IS_PRODUCTION) {
      throw new Error('SESSION_SECRET required in production');
    }
  }
  
  // Ensure sessions directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create a SQLite session store
  const sessionDBPath = path.join(dataDir, 'sessions.db');
  
  const sqliteStoreOptions = {
    db: 'sessions.db',
    dir: dataDir,
    table: 'sessions'
  };
  
  const sessionConfig = {
    store: new SQLiteStore(sqliteStoreOptions),
    secret: sessionSecret || 'development-secret-do-not-use-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Trust the reverse proxy
    cookie: {
      secure: IS_PRODUCTION, // Only use secure in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: IS_PRODUCTION ? 'none' : 'lax',
      httpOnly: true,
      path: '/'
    }
  };
  
  return session(sessionConfig);
};

module.exports = { 
  passport, 
  session: sessionMiddleware(), 
  isAdmin 
};