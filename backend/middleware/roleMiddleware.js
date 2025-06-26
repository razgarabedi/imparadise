const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have the required role.' });
    }
    next();
  };
};

module.exports = { authorizeRole }; 