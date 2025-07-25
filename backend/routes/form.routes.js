var express = require('express');
var router =express.Router();

const formController = require('../controller/form.controller')
const mailController = require('../controller/mailer.controller');

router.post('/addmechanic',formController.MechInsert)
router.get('/viewm', formController.mechanicView)
router.post('/delmech',formController.deleteMech)
router.post('/editmech',formController.mechEditByid)
router.post('/updatemech',formController.mechanicUpdate)
router.post('/register',formController.userReg)
router.get('/viewreg',formController.regView)
router.post('/stationreg',formController.regStation)
router.get('/stationregview',formController.regStationView)
router.post('/login',formController.login)
router.post('/viewslot',formController.viewslot)
router.post('/slotdelete',formController.slotdelete)
router.post('/editslot',formController.editslot)
router.post('/updateslot',formController.editslotupdate)
router.get('/viewslots',formController.slotview)
router.get('/viewmech', formController.mechanicView)
router.post('/regdelete',formController.regDelete)

router.post('/stationownerreg',formController.stationregister)

router.post('/statview', formController.viewStation)
router.post('/slotins',formController.slotinsert)
router.post('/viewprofile',formController.viewprofile)
router.post('/profileedit',formController.editprofile)
router.post('/profileupdate',formController.updateprofile)
router.get('/viewadminslot', formController.viewslotadmin)

router.post('/bookslot', formController.createBooking)
router.get("/getBookedTimes/:slotId", formController.getBookedTime)
router.post('/bookinghistory',formController.bookinghistory)
router.put("/paymentstatus/:id", formController.updatePaymentStatus);
router.post('/addcomplaint', formController.addcomplaint)
router.get('/viewstation', formController.viewStations)
router.get('/viewcomplaint',formController.viewcomplaint)
router.post('/replycomplaint/:id',formController.replycomplaint)

router.get('/viewcomplaintreply', formController.viewcomplaintreply)
router.post('/addstatus', formController.addstatus);
router.post('/viewreply', formController.viewreplyforuser)
router.get('/viewadminpayment' , formController.viewpaymentforadmin);

router.post('/viewstationpayment', formController.viewpaymentforstation)

router.post("/getstations", formController.getAllStations);
router.get("/getNotifications", formController.getNotifications);
router.get("/getdashboarddetails", formController.getDashboardDetails);
router.post("/updateNoficationStatus", formController.updateNoficationStatus);
router.post('/viewslotforstation',formController.viewslotforstation)
router.post('/viewslothistory',formController.viewslothistory);
router.get('/getslots', formController.getAllSlots)
router.post('/getstationownerbyid',formController.getStationOwnerById)

module.exports = router;