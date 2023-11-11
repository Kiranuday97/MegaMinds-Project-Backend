const express = require("express");
const router = express.Router();
const multer = require('multer');
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = process.env;
const path = require('path');
const cartController = require("../controllers/cartControllers");
const {
  doSignUp,
  doLogin,
  testController,
  addProductController,
  fetchProductController,
  addToCartController
} = require("../controllers/controllers");
const OrdersController = require("../controllers/orderController.js")


requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token , SECRET_KEY, (err, decodedToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token has expired' });
          
        }
        return res.status(401).json({ error: 'Invalid token' });

      }else{
      req.user = decodedToken.user;
      next();
      }
    });
  } else {

    return res.status(401).json({ error: 'Authentication required' });
  }
};




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const encodedFilename = Date.now() + '-' + encodeURIComponent(file.originalname);
    cb(null, encodedFilename);
  },
});

const upload = multer({ storage: storage });



const extractUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);
      req.userId = decodedToken.userId;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        
        return res.status(401).json({ error: 'Token has expired' });
      }

      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
};


router.post("/signup", doSignUp);
router.post("/login", doLogin);

router.get("/test", requireSignIn, testController);

router.post("/add-product",  upload.single('image'),requireSignIn, extractUserId,   addProductController);

router.get("/fetch-products", fetchProductController);

router.post('/add-to-cart', requireSignIn, extractUserId, addToCartController);

router.get('/cart', requireSignIn, extractUserId, cartController.getCartItems);

router.delete('/cart/:id', requireSignIn, extractUserId, cartController.removeFromCart);

router.put('/cart-update-quantity/:id/:operation', requireSignIn, extractUserId, cartController.updateQuantity);

router.post('/place-order-cod', requireSignIn, extractUserId,   OrdersController.OrderCODController );


router.delete('/delete-cart', requireSignIn, extractUserId,   OrdersController.deleteCartOnOrderController );

router.get("/admin/orders-list",  extractUserId, OrdersController.fetchAllOrdersController);

router.get('/fetchorders', requireSignIn, extractUserId,   OrdersController.fetchOrdersController );



module.exports = router;
