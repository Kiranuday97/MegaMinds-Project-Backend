const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Users = require("../models/signupSchema");
const Products = require("../models/productSchema");
const multer = require("multer");
const Cart = require("../models/cartSchema");


const { SECRET_KEY } = process.env;

exports.doSignUp = async (req, res) => {
  const { name, email, password} = req.body
  let hashedpassword =await bcrypt.hashSync(password, 10) 
    Users.create({name, email, password:hashedpassword})
        .then((user) => {
            console.log({ user });
            res.json({
                message: "User created",
                user,
            });
        })
        .catch((err) => {
            res.status(404).json({
                message: "User not created",
                error: err.message,
            });
        });
};


exports.doLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
  
      const user = await Users.findOne({ email });
      if (!user) {
        
        return res.status(401).json({ success:false, message: 'Invalid user' });

      }
  
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({success:false,  message: 'Invalid  password' });
        console.log("password error");
      }
  
      user.lastLogin = new Date();
      await user.save();
  
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1d"
      });
      
      res.json({
        success: true,
        message:"Login successful",
        user:{
          name:user.name,
          email: user.email
        },
          token });
    } catch (err) {
      console.log('Login error:', err);
      res.status(500).json({ message: ' error ouside' });
    }
  
}
  
  
  
  
  
exports.testController = (req, res) => {
  req.send("Protected Route")
  console.log("protected route");
}



exports.addProductController = async (req, res) => {
  console.log(req.body);
  try {
    const { name, price, category } = req.body;
    const imageUrl = req.file.path; 
    


    const product = new Products({
      name,
      price,
      imageUrl,
      category,
      
    });

    await product.save();

    res.json({
      message: "Product added successfully",
      imageUrl: imageUrl, ...product 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'An error occurred while adding the product. Please try again.' });
  }
};





exports.fetchProductController = async(req, res) => {
  try {
    const products =await  Products.find();
   
      res.json(products)
   
  } catch (error) {
    res.json("Failed to fetch products")
  }
}



exports.addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; 
    
    const cart = await Cart.findOne({ user: userId });


    if (!cart) {
      const newCart = new Cart({
        user: userId,
        products: [{ productId, count: 1 }],
        
      });
      await newCart.save();
    } else {
      const existingProduct = cart.products.find(item => item.productId.toString() === productId);

      if (existingProduct) {
        existingProduct.count += 1;
      } else {
        cart.products.push({ productId, count: 1 });
      }

      await cart.save();
    }

    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Failed to add product to cart' });
  }
};
