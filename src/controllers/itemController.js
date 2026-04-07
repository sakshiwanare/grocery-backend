const Item = require('../models/Item');

// GET /api/shops/:shopId/items (ONLY AVAILABLE ITEMS - CUSTOMER APP)
exports.getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const items = await Item.find({
      shop: shopId,
      // isAvailable: true,//
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// ➕ ADD ITEM (SHOP APP)
exports.addItem = async (req, res) => {
  try {
    const { name, pricePerKg, shopId, quantity } = req.body;

    // ✅ updated validation
    if (!name || !pricePerKg || !shopId || quantity === undefined) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const item = await Item.create({
      name,
      pricePerKg,
      shop: shopId,
      quantity, // ✅ NEW
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

    // ❌ If no quantity → force out of stock
    if (item.quantity === 0) {
      item.isAvailable = false;

      return res.json({
        message: 'Item is out of stock (quantity is 0)',
        item,
      });
    }

    // ✅ Only toggle if quantity > 0
    item.isAvailable = !item.isAvailable;

    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};

// ❌ DELETE ITEM
exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Item.findByIdAndDelete(itemId);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

// ✏️ UPDATE ITEM (PRICE + QUANTITY)
exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { pricePerKg, quantity } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (pricePerKg !== undefined) {
      item.pricePerKg = pricePerKg;
    }

    if (quantity !== undefined) {
      item.quantity = quantity;

      // 🔥 AUTO STOCK CONTROL
      if (quantity === 0) {
        item.isAvailable = false;
      } else {
        item.isAvailable = true;
      }
    }

    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
};

exports.validateCart = async (req, res) => {
  try {
    const { items } = req.body;
    console.log('REQ BODY:', req.body);

    for (const cartItem of items) {
      const dbItem = await Item.findById(cartItem.itemId);

      if (!dbItem) {
        return res.status(400).json({
          message: `Item not found`,
        });
      }

      const availableStock = dbItem.quantity * 1000;

      if (cartItem.quantity > availableStock) {
        return res.status(400).json({
          message: `${dbItem.name} stock changed`,
        });
      }
    }

    res.json({ message: 'Stock valid' });
  } catch (error) {
    res.status(500).json({ message: 'Validation failed' });
  }
};