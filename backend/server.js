const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./connect/connectDB');
const passport = require('passport');


dotenv.config();

// Import passport configuration
require('./controllers/passport');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


// Allowlist CORS origins (local + production)
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser clients (no origin) and allowlist matches
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Trust reverse proxy (needed for secure cookies on many hosts)
app.set('trust proxy', 1);

// Initialize Passport (without sessions)
app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

// Google OAuth routes
// Basic login (no Calendar scope)
app.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email']
}));

// Calendar connect (requests Calendar scope + offline access)
app.get('/auth/google/calendar', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
  accessType: 'offline',
  prompt: 'consent'
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`, session: false }),
  require('./controllers/authController').googleCallback
);

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});


app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});
