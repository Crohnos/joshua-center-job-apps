const passport = require('passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');
const db = require('../models/db');

// Setup passport and session
const passportSetup = () => {
  console.log('=== PASSPORT SETUP DEBUG ===');
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const SESSION_SECRET = process.env.SESSION_SECRET;
  
  console.log('OAuth Config:', {
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    SESSION_SECRET: SESSION_SECRET ? 'Set' : 'Not set',
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:3001'}/auth/google/callback`
  });

  // Create a custom dummy strategy for development
  const DummyStrategy = function() {
    this.name = 'google';
    this.authenticate = function(req, options) {
      console.log('DummyStrategy.authenticate called with options:', options);
      console.log('Request session in dummy strategy:', req.session);
      const email = 'dev@example.com';
      const user = { email: email, name: 'Dev User' };
      console.log('Creating dummy user:', user);
      return this.success(user);
    };
  };

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not set. Using dummy strategy for development.');
    console.log('Initializing DummyStrategy for development');
    
    // Use the dummy strategy for development
    passport.use(new DummyStrategy());
  } else {
    // Use the real Google strategy
    console.log('Initializing real GoogleStrategy with credentials');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:3001'}/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth callback received');
        console.log('Profile:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos
        });
        
        // Extract user data from Google profile
        const email = profile.emails[0].value;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const displayName = profile.displayName || `${firstName} ${lastName}`;
        
        console.log('User data extracted:', { email, firstName, lastName, displayName });
        
        // Find or create user in database
        console.log('Querying database for user:', email);
        db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
          if (err) {
            console.error('Database error during authentication:', err);
            return done(err);
          }
          
          if (user) {
            // User exists, return the user
            console.log(`User found in database:`, user);
            return done(null, { 
              id: user.id,
              email, 
              name: displayName,
              firstName: user.first_name,
              lastName: user.last_name,
              active: user.active
            });
          } else {
            console.log('User not found in database:', email);
            // Restrict to specific email for security during testing
            if (email !== 'johncgraham1997@gmail.com') {
              console.log(`Unauthorized email attempted login: ${email}`);
              return done(null, false, { message: 'Unauthorized email' });
            }
            
            // Create new user - for development only! In production you'd want admin approval
            console.log(`Creating new user: ${email}`);
            db.run(
              'INSERT INTO User (email, first_name, last_name, active) VALUES (?, ?, ?, 1)',
              [email, firstName, lastName],
              function(err) {
                if (err) {
                  console.error('Error creating user:', err);
                  return done(err);
                }
                console.log('User created successfully with ID:', this.lastID);
                return done(null, { 
                  id: this.lastID,
                  email, 
                  name: displayName,
                  firstName,
                  lastName,
                  active: 1
                });
              }
            );
          }
        });
      } catch (error) {
        console.error('Error in Google authentication strategy:', error);
        return done(error);
      }
    }));
  }
  console.log('=== END PASSPORT SETUP DEBUG ===');
};

passport.serializeUser((user, done) => {
  console.log('serializeUser called with user:', user);
  const result = done(null, user.email);
  console.log('User serialized with email:', user.email);
  return result;
});

passport.deserializeUser((email, done) => {
  console.log('deserializeUser called with email:', email);
  db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Error in deserializeUser:', err);
      return done(err);
    }
    
    if (!user) {
      console.log('User not found in deserializeUser for email:', email);
      return done(null, { email }); // Basic user info if not in DB
    }
    
    const userData = { 
      id: user.id, 
      email, 
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      active: user.active
    };
    
    console.log('User deserialized:', userData);
    done(null, userData);
  });
});

function isAdmin(req, res, next) {
  console.log('isAdmin middleware called');
  console.log('User in request:', req.user);
  console.log('isAuthenticated:', req.isAuthenticated());
  console.log('Session:', req.session);
  
  if (!req.user) {
    console.log('No user in request, returning 401');
    return res.status(401).send('Unauthorized');
  }
  
  console.log('Checking if user is active in database:', req.user.email);
  db.get('SELECT * FROM User WHERE email = ? AND active = 1', [req.user.email], (err, row) => {
    if (err) {
      console.error('Database error in isAdmin:', err);
      return res.status(500).send('Server Error');
    }
    
    if (!row) {
      console.log('User not found or not active:', req.user.email);
      return res.status(403).send('Forbidden');
    }
    
    console.log('User is active admin:', row);
    req.user.id = row.id;
    next();
  });
}

// Initialize passport
passportSetup();

// Create session middleware with persistent SQLite storage
const sessionMiddleware = () => {
  console.log('=== SESSION CONFIG DEBUG ===');
  const sessionSecret = process.env.SESSION_SECRET || 'default-dev-secret';
  console.log('Session secret:', sessionSecret ? `${sessionSecret.substring(0, 3)}...` : 'Not set');
  
  // Ensure sessions directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create a SQLite session store
  const sessionDBPath = path.join(dataDir, 'sessions.db');
  console.log(`Using session database at: ${sessionDBPath}`);
  
  const sqliteStoreOptions = {
    db: 'sessions.db',
    dir: dataDir,
    table: 'sessions'
  };
  
  const sessionConfig = {
    store: new SQLiteStore(sqliteStoreOptions),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'none' // For cross-domain cookies
    }
  };
  
  console.log('Session config:', {
    ...sessionConfig,
    store: 'SQLiteStore',
    secret: sessionConfig.secret ? `${sessionConfig.secret.substring(0, 3)}...` : 'Not set'
  });
  console.log('=== END SESSION CONFIG DEBUG ===');
  
  return session(sessionConfig);
};

module.exports = { 
  passport, 
  session: sessionMiddleware(), 
  isAdmin 
};