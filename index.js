const express = require("express");
const cors = require("cors");
const databaseConfiguration = require("./config/database.js");
const routes = require("./routes/routes")
const paymentRoutes = require ("./routes/paymentRoutes.js")
const path = require("path")
const bodyParser = require("body-parser")


const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


databaseConfiguration();

app.use(cors());


app.use(express.json({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.use(express,express.urlencoded({ extended: true  }))

app.use('/uploads', express.static(path.join(__dirname, './uploads')));






app.get("/", (req, res) =>
  res.send("Hello there!! Cheers !! The server is up and running")
);


app.use("/api", routes );
app.use("/api/payment", paymentRoutes );

app.get("/api/payment/getkey", (req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))











app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));