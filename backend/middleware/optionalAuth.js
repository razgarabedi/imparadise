const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(); // No token, proceed without authentication
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user; // Token is valid, attach user
    }
    // If token is invalid, we don't throw an error, just proceed
    next();
  });
};

module.exports = { optionalAuth }; 