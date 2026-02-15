const express = require('express');
const router = express.Router();
const { getAllShops } = require('../controllers/shopController');

router.get('/', getAllShops);
router.get('/my', authMiddleware, getMyShops);

module.exports = router;
