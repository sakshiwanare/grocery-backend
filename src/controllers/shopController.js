const Shop = require('../models/Shop');

// GET /api/shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shops' });
  }
};
