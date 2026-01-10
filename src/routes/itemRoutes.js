const express = require('express');
const router = express.Router();
const { getItemsByShop } = require('../controllers/itemController');

router.get('/shops/:shopId/items', getItemsByShop);

module.exports = router;
