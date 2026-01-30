const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  addAddress,
  getMyAddresses,
} = require('../controllers/addressController');

router.post('/address', authMiddleware, addAddress);
router.get('/address', authMiddleware, getMyAddresses);

module.exports = router;
