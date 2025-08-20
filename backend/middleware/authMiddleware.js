const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    // Try getting token from cookie first, fallback to Authorization header
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in to continue',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    // so that downstream routes and controllers can easily know who the logged-in user is and what permissions they may have.
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);

    // Differentiate between expired and invalid token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed',
    });
  }
};
