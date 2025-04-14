const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_for_development';

// Middleware function to authenticate requests
const auth = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check for Editor or Admin role
const checkEditorOrAdmin = function(req, res, next) {
  if (req.user.role === 'Editor' || req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized to perform this action' });
  }
};

// Middleware to check for Admin role only
const checkAdmin = function(req, res, next) {
  if (req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin privileges required' });
  }
};

module.exports = {
  auth,
  checkEditorOrAdmin,
  checkAdmin
};