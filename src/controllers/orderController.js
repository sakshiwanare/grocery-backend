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
exports.getOrdersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const orders = await Order.find({ shop: shopId });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to fetch shop orders',
    });
  }
};
// GET /api/shops/:shopId/orders
// exports.getOrdersByShop = async (req, res) => {
//   try {
//     const { shopId } = req.params;

//     const orders = await Order.find({ shop: shopId })
//       .populate('user', 'name email')
//       .populate('items.item', 'name pricePerKg')
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     console.error('SHOP ORDERS ERROR:', error); // 👈 ADD THIS
//     res.status(500).json({ message: 'Failed to fetch shop orders' });
//   }
// };
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
      .populate('items.item', 'name pricePerKg')
      .populate('user', 'name email');

      console.log('ORDER USER FIELD:', order.user);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};
// exports.cancelOrder = async (req, res) => {
//   try {
//     console.log('CANCEL PARAMS:', req.params);
//     const orderId = req.params.orderId;// ✅ FIXED
//     const params = useLocalSearchParams();
//     const orderId =
//       Array.isArray(params.orderId)
//         ? params.orderId[0]
//         : params.orderId;
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const status = order.status.toLowerCase();
//     if (status !== 'pending' && status !== 'placed') {
//       return res.status(400).json({
//         message: 'Order cannot be cancelled at this stage',
//       });
//     }

//     order.status = 'cancelled';
//     await order.save();

//     res.status(200).json({
//       message: 'Order cancelled successfully',
//       order,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.cancelOrder = async (req, res) => {
  try {
    console.log('CANCEL PARAMS:', req.params);

    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ enum-safe check
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage',
      });
    }

    // ✅ enum-safe assignment
    order.status = 'CANCELLED';
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
const Item = require('../models/Item'); // ✅ ADD THIS

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Order cannot be accepted' });
    }

    // ✅ UPDATE STATUS FIRST
    order.status = 'ACCEPTED';
    await order.save();

    // 🔥 STOCK UPDATE LOGIC (MOVE BEFORE res.json)
    for (const orderItem of order.items) {
      const item = await Item.findById(orderItem.item);

      if (item) {
        console.log('BEFORE:', item.name, item.quantity);

        const orderedQtyInKg = orderItem.quantity / 1000; // convert grams → kg
        item.quantity -= orderedQtyInKg;

        if (item.quantity < 0) item.quantity = 0;

        // ✅ FIXED LOGIC
        if (item.quantity === 0) {
          item.isAvailable = false;
        } else {
          item.isAvailable = true;
        }

        await item.save();

        console.log('AFTER:', item.name, item.quantity);
      }
    }

    // ✅ SEND RESPONSE AT END
    res.json({
      message: 'Order accepted & stock updated',
      order,
    });

  } catch (error) {
    console.error('ACCEPT ERROR:', error);
    res.status(500).json({ message: 'Failed to accept order' });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Order cannot be rejected' });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject order' });
  }
};

exports.markOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'ACCEPTED') {
      return res.status(400).json({
        message: 'Only accepted orders can be sent out for delivery',
      });
    }

    order.status = 'OUT_FOR_DELIVERY';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'OUT_FOR_DELIVERY') {
      return res.status(400).json({
        message: 'Order must be out for delivery first',
      });
    }

    // Only the assigned delivery partner can mark it delivered
    if (
      !order.deliveryPartner ||
      order.deliveryPartner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'You are not assigned to this delivery',
      });
    }

    order.status = 'DELIVERED';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// GET /api/orders/available
exports.getAvailableOrders = async (req, res) => {
  try {
    console.log("✅ getAvailableOrders called");

    const orders = await Order.find({
      status: 'OUT_FOR_DELIVERY',
      $or: [
        { deliveryPartner: null },
        { deliveryPartner: { $exists: false } },
      ],
    })
      .populate('user', 'name')
      .populate('shop', 'name area')
      .sort({ createdAt: -1 });

    console.log("Orders found:", orders.length);

    res.json(orders);
  } catch (error) {
    console.error("AVAILABLE ORDERS ERROR:", error);

    res.status(500).json({
      message: 'GET_ORDER_BY_ID_ERROR',
    });
  }
};
// PUT /api/orders/:orderId/accept-delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Order must be ready for delivery
    if (order.status !== 'OUT_FOR_DELIVERY') {
      return res.status(400).json({
        message: 'Order is not ready for delivery',
      });
    }

    // Prevent another delivery partner from accepting it
    if (order.deliveryPartner) {
      return res.status(400).json({
        message: 'Order already assigned',
      });
    }

    // Assign logged-in delivery partner
    order.deliveryPartner = req.user.id;

    await order.save();

    res.json({
      message: 'Delivery accepted successfully',
      order,
    });

  } catch (error) {
    console.error('ACCEPT DELIVERY ERROR:', error);

    res.status(500).json({
      message: 'Failed to accept delivery',
    });
  }
};
// GET /api/orders/my-deliveries
exports.getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user.id,
      status: 'OUT_FOR_DELIVERY',
    })
      .populate('user', 'name')
      .populate('shop', 'name area')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('MY DELIVERIES ERROR:', error);

    res.status(500).json({
      message: 'Failed to fetch my deliveries',
    });
  }
};