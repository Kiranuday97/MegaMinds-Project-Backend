const mongoose = require("mongoose");

const Order = require("../models/orderSchema");

const Cart = require("../models/cartSchema");

exports.OrderCODController = async (req, res) => {
  const { address, products, paymentMethod } = req.body;

  try {
    const order = new Order({
      user: req.userId,
      products: products.map((product) => ({
        productId: product.productId,
        imageUrl: product.productId.imageUrl,
        name: product.productId.name,
        price: product.productId.price,
        quantity: product.count,
      })),
      // productId:productId.map((image) => {
      //   imageUrl
      // }),
      address: {
        name: address.name,
        address1: address.address1,
        city: address.city,
        state: address.state,
        zip: address.zip,
      },
      paymentMethod,
    });

    const savedOrder = await order.save();
    console.log("Added");

    res.json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save order" });
  }
};

exports.deleteCartOnOrderController = async (req, res) => {
  const userId = req.userId;

  try {
    await Cart.findOneAndRemove({ user: userId });
    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error removing cart:", error);
    res.json({ error: "Failed to remove cart" });
  }
};

exports.fetchAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find().exec();
    const modifiedOrders = orders.map((order) => ({
      _id: order._id,
      user: order.user,
      imageUrl: order.products.imageUrl,
      products: order.products,
      address: order.address,
      paymentMethod: order.paymentMethod,
    }));
    res.json(modifiedOrders);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

exports.fetchOrdersController = async (req, res) => {
  const userId = req.userId;
  console.log("--->Incoming");
  try {
    const orders = await Order.find({ user: userId }).exec();

    const modifiedOrders = orders.map((order) => ({
      _id: order._id,
      imageUrl: order.products.imageUrl,
      user: order.user,
      products: order.products,
      address: order.address,
      paymentMethod: order.paymentMethod,
    }));
    res.json(modifiedOrders);
  } catch (error) {
    res.json(error);
  }
};
