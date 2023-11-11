const express = require("express");
const router = express.Router();
const {paymentController, paymentVerification} = require("../controllers/paymentControllers")

const app = express();



router.post("/paynow", paymentController );

router.post("/payment-verification", paymentVerification)




module.exports = router;
