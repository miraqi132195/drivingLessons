const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
 authenticateUser = async (req, res, next) => {
   try {
     const token = req.header('Authorization').replace('Bearer ', '');
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await  Users.findById(decoded.userId);

     if (!user) return res.status(401).json({message: 'Unauthorized'});

     req.user = user;
     next();
   } catch (error) {
     res.status(401).json({message: 'Invalid token'});
   }
 };

module.exports = {authMiddleware, authorizeRoles, authenticateUser};