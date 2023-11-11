const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          imageUrl: String,
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      address: {
        name: {
          type: String,
          required: true,
        },
        address1: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zip: {
          type: String,
          required: true,
        },
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      totalAmount:{
        type: Number,
        
      }
}) 

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;