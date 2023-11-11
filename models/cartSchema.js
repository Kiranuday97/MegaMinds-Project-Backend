const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      count: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
