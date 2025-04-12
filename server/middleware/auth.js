const passport = require('passport');
const session = require('express-session');
const db = require('../models/db');

// Setup passport and session
const passportSetup = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  // Create a custom dummy strategy for development
  const DummyStrategy = function() {
    this.name = 'google';
    this.authenticate = function(req, options) {
      const email = 'dev@example.com';
      const user = { email: email, name: 'Dev User' };
      return this.success(user);
    };
  };

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not set. Using dummy strategy for development.');
    
    // Use the dummy strategy for development
    passport.use(new DummyStrategy());
  } else {
    // Use the real Google strategy
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:3001'}/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user data from Google profile
        const email = profile.emails[0].value;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const displayName = profile.displayName || `${firstName} ${lastName}`;
        
        // Find or create user in database
        db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
          if (err) {
            console.error('Database error during authentication:', err);
            return done(err);
          }
          
          if (user) {
            // User exists, return the user
            console.log(`User authenticated: ${email}`);
            return done(null, { 
              id: user.id,
              email, 
              name: displayName,
              firstName: user.first_name,
              lastName: user.last_name,
              active: user.active
            });
          } else {
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
};

passport.serializeUser((user, done) => done(null, user.email));

passport.deserializeUser((email, done) => {
  db.get('SELECT * FROM User WHERE email = ?', [email], (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, { email }); // Basic user info if not in DB
    
    done(null, { 
      id: user.id, 
      email, 
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      active: user.active
    });
  });
});

function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).send('Unauthorized');
  db.get('SELECT * FROM User WHERE email = ? AND active = 1', [req.user.email], (err, row) => {
    if (err || !row) return res.status(403).send('Forbidden');
    req.user.id = row.id;
    next();
  });
}

// Initialize passport
passportSetup();

module.exports = { 
  passport, 
  session: session({ 
    secret: process.env.SESSION_SECRET || 'default-dev-secret', 
    resave: false, 
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  }), 
  isAdmin 
};