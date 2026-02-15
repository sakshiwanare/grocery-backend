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
