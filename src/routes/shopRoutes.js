// const express = require('express');
// const router = express.Router();
// const { getAllShops } = require('../controllers/shopController');

// router.get('/', getAllShops);


// module.exports = router;

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware'); // ✅ ADD THIS
const {
  getAllShops,
  createShop,
  getMyShops,
} = require('../controllers/shopController');

router.get('/', getAllShops);
router.post('/', authMiddleware, createShop);
router.get('/my', authMiddleware, getMyShops); // ✅ now works

module.exports = router;

