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

// CREATE ORDER
// POST /api/orders
router.post('/', authMiddleware, createOrder);

// GET MY ORDERS
// GET /api/orders/my
router.get('/my', authMiddleware, getMyOrders);

// GET ORDERS BY SHOP
// GET /api/orders/shop/:shopId
router.get('/shop/:shopId', authMiddleware, getOrdersByShop);

// CONFIRM PAYMENT
// POST /api/orders/:orderId/pay
router.post('/:orderId/pay', authMiddleware, confirmPayment);

// GET ORDER BY ID
// GET /api/orders/:orderId
router.get('/:orderId', authMiddleware, getOrderById);

// CANCEL ORDER
// PUT /api/orders/:orderId/cancel
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

module.exports = router;