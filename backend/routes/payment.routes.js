const router = require('express').Router();
const Razorpay = require('razorpay');
const Crypto = require('crypto');
const { paymentModel, bookingModel, assignslotModel } = require('../model/form.model');


router.post("/orders", async (req, res) => {
    try {
        const instancee = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: req.body.amount,
            currency: "INR",
            receipt: Crypto.randomBytes(10).toString("hex"),
        }
        instancee.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
            slot_id,
            booking_id,
            sid,
            ownerid,
            amount,
            status } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = Crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const booking = await bookingModel.findById(booking_id);
            const slot = await assignslotModel.findById(slot_id);
            slot.status = 1; // Mark the slot as booked
            await slot.save();

            await paymentModel.create({
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount,
                user_id: booking.user_id,
                slot_id: booking.slot_id,
                booking_id: booking._id,
                sid: booking.sid,
                ownerid: booking.ownerid,
                status
            });
            return res.status(200).json({ message: "Payment verified successfully" });
        }
        else {
            return res.status(400).json({ message: "Invalid Signature" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});




module.exports = router;