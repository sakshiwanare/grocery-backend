const Order = require('../models/Order');

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      shop,
      items,
      address,
      paymentMethod,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      shop,
      items,
      address,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('shop', 'name area')
      .populate('items.item', 'name pricePerKg')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// GET /api/shops/:shopId/orders
exports.getOrdersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const orders = await Order.find({ shop: shopId })
      .populate('user', 'name email')
      .populate('items.item', 'name pricePerKg')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('SHOP ORDERS ERROR:', error); // 👈 ADD THIS
    res.status(500).json({ message: 'Failed to fetch shop orders' });
  }
};
// POST /api/orders/:orderId/pay
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Simulate successful payment
    order.paymentStatus = 'PAID';
    order.paymentMethod = paymentMethod;
    order.paymentId = paymentId || `PAY-${Date.now()}`;

    await order.save();

    res.json({
      message: 'Payment successful',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed' });
  }
};
// GET /api/orders/:orderId
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('shop', 'name area')
      .populate('items.item', 'name pricePerKg');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancel if pending
    if (order.status.toLowerCase() !== 'pending') {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage',
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

