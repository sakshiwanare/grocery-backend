const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createOrder,
  getMyOrders,
  getOrdersByShop,
  getCompletedOrdersByShop,
  confirmPayment,
  getOrderById,
  cancelOrder,
  acceptOrder,   
  rejectOrder,
  markOutForDelivery,
  markDelivered,
  getAvailableOrders,
  acceptDelivery,
  getMyDeliveries,
  getDeliveredOrders,
} = require('../controllers/orderController');

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/shop/:shopId', authMiddleware, getOrdersByShop);
router.get('/shop/:shopId/completed',authMiddleware,getCompletedOrdersByShop);
router.get('/available', authMiddleware, getAvailableOrders);
router.get('/my-deliveries',authMiddleware,getMyDeliveries);
router.get('/delivered-orders',authMiddleware,getDeliveredOrders);
router.put('/:orderId/accept-delivery',authMiddleware,acceptDelivery);
router.post('/:orderId/pay', authMiddleware, confirmPayment);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);
router.put('/:orderId/accept', authMiddleware, acceptOrder);
router.put('/:orderId/reject', authMiddleware, rejectOrder);
router.put('/:orderId/out-for-delivery', authMiddleware, markOutForDelivery);
router.put('/:orderId/delivered', authMiddleware, markDelivered);



module.exports = router;