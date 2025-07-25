<<<<<<< HEAD
var express = require('express');
var router =express.Router();


const mailController = require('../controller/mailer.controller');



router.post("/forgot-password", mailController.sendResetEmail);
router.post("/reset-password/:token", mailController.resetPassword);

=======
var express = require('express');
var router =express.Router();


const mailController = require('../controller/mailer.controller');



router.post("/forgot-password", mailController.sendResetEmail);
router.post("/reset-password/:token", mailController.resetPassword);

>>>>>>> 7e53bc75fe70b0ea731176fb4678a1049314690a
module.exports=router;