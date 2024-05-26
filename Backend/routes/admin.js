const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.send('Admin content');
});

module.exports = router;
