const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).populate('role_id').exec();
      if (!user || !roles.includes(user.role_id.role_name)) {
        return res.status(403).send('Access Denied');
      }
      next();
    } catch (error) {
      return res.status(500).send('Server Error');
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};