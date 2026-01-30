const express = require('express');
const router = express.Router();

const {
  saveAddress,
  getAddresses,
} = require('../controllers/addressController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, saveAddress);
router.get('/', authMiddleware, getAddresses);

module.exports = router;
