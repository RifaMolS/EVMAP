
const cron = require('node-cron');
const mongoose = require('mongoose');
const { bookingModel, assignslotModel } = require('../model/form.model');

const startCronJobs = () => {
    cron.schedule('* * * * *', async () => {
        console.log('🔁 Cron job running every minute');

        try {
            const now = new Date();
            const bookings = await bookingModel.find({ status: 0 }); // 0 = active

            for (const booking of bookings) {
                const createdAt = new Date(booking.created_at);
                const chargingTimeMs = booking.charging_time * 60 * 60 * 1000;
                const endTime = new Date(createdAt.getTime() + chargingTimeMs);

                const nowRounded = new Date();
                nowRounded.setSeconds(0, 0);
                const endRounded = new Date(endTime);
                endRounded.setSeconds(0, 0);

                if (nowRounded.getTime() >= endRounded.getTime()) {
                    // ✅ Mark booking as completed
                    await bookingModel.findByIdAndUpdate(booking._id, { status: 4 });

                    // ✅ Free the slot
                    await assignslotModel.findByIdAndUpdate(booking.slot_id, { status: 0 });

                    console.log(`✅ Booking ${booking._id} completed. Slot ${booking.slot_id} freed.`);
                }
            }
        } catch (err) {
            console.error('❌ Error running cron job:', err);
        }
    });
};

module.exports = startCronJobs;

