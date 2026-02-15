const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    owner: {type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);
