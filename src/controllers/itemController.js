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

// ➕ ADD ITEM (SHOP APP)
exports.addItem = async (req, res) => {
  try {
    const { name, pricePerKg, shopId } = req.body;

    if (!name || !pricePerKg || !shopId) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const item = await Item.create({
      name,
      pricePerKg,
      shop: shopId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item' });
  }
};

// 👀 GET ALL ITEMS (INCLUDING OUT OF STOCK) - SHOP APP
exports.getAllItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const items = await Item.find({ shop: shopId });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// 🔁 TOGGLE STOCK
exports.toggleStock = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};
  // Delete item
  exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Item.findByIdAndDelete(itemId);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};
// 🆕 UPDATE ITEM (PRICE ONLY)
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { pricePerKg } = req.body;

    if (!pricePerKg) {
      return res.status(400).json({ message: 'Price is required' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { pricePerKg },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};