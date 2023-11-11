const mongoose  = require("mongoose")
const Cart = require("../models/cartSchema");

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.userId; 
    
        const cart = await Cart.findOne({ user: userId }).populate('products.productId', 'name price imageUrl ');
    
        if (!cart) {
          return res.status(200).json({ cart: null });
        }
    
        res.status(200).json({ cart });
      } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
      }
};




// exports.removeFromCart=  async (req, res) => {
//   const productId = req.params.id;

//   try {
//     await Cart.findOneAndRemove({ 'products.productId': productId });
//     res.json({ message: 'Item removed from cart' });
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     res.status(500).json({ error: 'Failed to remove item from cart' });
//   }
// };



exports.removeFromCart= async (req, res) => {
  const productId = req.params.id;
  const userId = req.userId

  try {
    await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { productId: productId } } },
      { new: true }
    );

     res.json({ message: 'Item removed from cart'});
        
      
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

exports.updateQuantity = async (req, res) => {
  const productId = req.params.id;
  const operation = req.params.operation
  const  userId  = req.userId;


  try {
    const cartItem = await Cart.findOne({ user: userId, 'products.productId': productId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const productIndex = cartItem.products.findIndex((product) => product.productId.equals(productId));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (operation === 'increment') {
      cartItem.products[productIndex].count += 1;
    } else if (operation === 'decrement') {
      if (cartItem.products[productIndex].count > 1) {
        cartItem.products[productIndex].count -= 1;
      } else if (cartItem.products[productIndex].count === 1) {
        cartItem.products.splice(productIndex, 1); 
      }
    }

    await cartItem.save();

    res.json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};


