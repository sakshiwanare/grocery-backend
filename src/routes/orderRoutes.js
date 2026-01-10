const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createOrder,
  getMyOrders,
  getOrdersByShop,
  confirmPayment,
} = require('../controllers/orderController');

router.post('/orders', authMiddleware, createOrder);
router.get('/orders/my', authMiddleware, getMyOrders);
router.get('/shops/:shopId/orders', authMiddleware, getOrdersByShop);
router.post(
  '/orders/:orderId/pay',
  authMiddleware,
  confirmPayment
);


module.exports = router;
