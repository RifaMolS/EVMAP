var express = require('express');
var cors = require('cors');
// const Razorpay = require('razorpay');
// const Crypto = require('crypto');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var app = express();
dotenv.config();
var session = require('express-session')
var fileUpload = require('express-fileupload');
const database = require('./config/database');
var formRouter = require('./routes/form.routes');
const paymentRoute = require('./routes/payment.routes');
const mailRoute = require('./routes/mail.routes')
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())


const startCronJobs = require("./cron/job")
startCronJobs(); // Start cron jobs






// parse application/json
app.use(express.static('asset'))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
database()
app.use("/api/payment/", paymentRoute)
app.use("/ev", formRouter)
app.use("/api/auth", mailRoute)
app.listen(4000)