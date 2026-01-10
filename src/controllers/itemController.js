const Item = require('../models/Item');

// GET /api/shops/:shopId/items
exports.getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const items = await Item.find({
      shop: shopId,
      isAvailable: true,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};
