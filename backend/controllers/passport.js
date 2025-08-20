const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth profile:', profile.displayName, profile.emails[0].value);
        
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user from Google profile
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "GoogleOAuth_" + Math.random().toString(36).substring(7), // Random password for OAuth users
            googleId: profile.id,
          });
          await user.save();
          console.log('New Google user created:', user.email);
        } else {
          // Update existing user's name if it changed
          if (user.name !== profile.displayName) {
            user.name = profile.displayName;
            console.log('Existing Google user updated:', user.email);
          }
          // Link googleId if not set
          if (!user.googleId) {
            user.googleId = profile.id;
          }
        }

        // Persist refreshToken if provided (only on first consent or when access type is offline)
        if (refreshToken) {
          user.googleRefreshToken = refreshToken;
        }
        await user.save();

        return done(null, user);
      } catch (err) {
        console.error('Google OAuth error:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
