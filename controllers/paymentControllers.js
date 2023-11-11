const dotenv = require("dotenv");
const crypto = require("crypto")
const Payment = require ("../models/paymentSchema");





dotenv.config();
// const { instance } = require ("../index.js");
const razorpay = require("razorpay");

const instance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRETE,
});

exports.paymentController = async (req, res) => {
  const options = {
    amount: Number(req.body.totalAmount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

exports.paymentVerification = async (req, res) => {
  console.log(req.body);
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRETE)
                                    .update(body.toString())
                                    .digest('hex');
                                    console.log("sig recieved", razorpay_signature);
                                    console.log("sig generated", expectedSignature);
    

       const  isAuthentic  =  expectedSignature  === razorpay_signature;
       
       if(isAuthentic){

        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

        
        
         res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`)
       }else{
        res.status(200).json({
            success: false,
          });
       }

  
};
