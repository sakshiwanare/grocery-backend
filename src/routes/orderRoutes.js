const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createOrder,
  getMyOrders,
  getOrdersByShop,
  confirmPayment,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/shop/:shopId', authMiddleware, getOrdersByShop);
router.post('/:orderId/pay', authMiddleware, confirmPayment);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

module.exports = router;