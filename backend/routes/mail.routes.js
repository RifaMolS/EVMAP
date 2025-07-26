
var express = require('express');
var router =express.Router();


const mailController = require('../controller/mailer.controller');



router.post("/forgot-password", mailController.sendResetEmail);
router.post("/reset-password/:token", mailController.resetPassword);


var express = require('express');
var router =express.Router();


const mailController = require('../controller/mailer.controller');



router.post("/forgot-password", mailController.sendResetEmail);
router.post("/reset-password/:token", mailController.resetPassword);

module.exports=router;