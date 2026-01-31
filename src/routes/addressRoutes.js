const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  addAddress,
  getMyAddresses
} = require('../controllers/addressController');

// ✅ IMPORTANT: NO /address prefix here
router.post('/', authMiddleware, addAddress);
router.get('/', authMiddleware, getMyAddresses);

module.exports = router;
