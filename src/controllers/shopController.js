const Shop = require('../models/Shop');

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true })
    /*const shops = await Shop.find();*/
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shops' });
  }
};

exports.getMyShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user.id });

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shops' });
  }
};


exports.createShop = async (req, res) => {
  try {
    const { name, area } = req.body;

    if (!name || !area) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const shop = await Shop.create({
      name,
      area,
      owner: req.user.id, // ✅ IMPORTANT
    });

    res.status(201).json(shop);
  } catch (error) {
    console.error("CREATE SHOP ERROR:", error);
    res.status(500).json({ message: 'Failed to create shop' });
  }
};
