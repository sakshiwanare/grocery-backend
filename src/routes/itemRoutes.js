const express = require('express');
const router = express.Router();
const {
  getItemsByShop,
  addItem,
  getAllItemsByShop,
  toggleStock,
  deleteItem,
  updateItem,
  validateCart,
} = require('../controllers/itemController');

// 🟢 CUSTOMER APP (UNCHANGED)
router.get('/shops/:shopId/items', getItemsByShop);

// 🆕 SHOP APP ROUTES
router.post('/items', addItem);
router.get('/items/:shopId', getAllItemsByShop);
router.put('/items/:id/toggle', toggleStock);
router.delete('/items/:itemId', deleteItem);
router.put('/items/:itemId', updateItem);
router.post('/items/validate-cart', validateCart);

console.log(deleteItem);

module.exports = router;