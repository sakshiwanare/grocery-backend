const Address = require('../models/Address');

exports.addAddress = async (req, res) => {
  try {
    const { house, area, city, pincode } = req.body;

    const address = await Address.create({
      user: req.user.id,
      house,
      area,
      city,
      pincode,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save address' });
  }
};

exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load addresses' });
  }
};
