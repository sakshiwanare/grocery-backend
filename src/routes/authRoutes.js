const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword, // ✅ add this
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getProfile);

// ✅ NEW ROUTE
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
