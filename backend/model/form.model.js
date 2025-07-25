<<<<<<< HEAD
const mongoose = require('mongoose');
const status = require('statuses');
const mechanicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    workingtime: {
        type: String,
        required: true
    }
})
const mechanicModel = mongoose.model('mechanic', mechanicSchema)
const registerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    license: {
        type: String,
        required: true
    }

})
const registerModel = mongoose.model('register', registerSchema)
const loginSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    usertype: {
        type: Number,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'regtype'
    },
    regtype: {
        type: String,
        enum: ['register', 'stationreg', 'stationowner'],
        required: true
    }
})
const loguserModel = mongoose.model('login', loginSchema)
const stationregSchema = mongoose.Schema({
    stationname: {
        type: String,
        required: true
    },
    location: {
        type: String,

    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    chargingtype:
    {
        type: String,
        required: true
    },
    restroom: {
        gender: String,
        toilet: String,
        water: String,
        toiletpaper: String,
        changingroom: String,
        feedingroom: String,
        handryer: String,
        sanitarybin: String,
        wheelchair: String,
        emergency: String,
        // notes: String
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    }

})
const stationregModel = mongoose.model('stationreg', stationregSchema)
const assignslotSchema = mongoose.Schema({
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg',
    },
    starttime: {
        type: String,
        required: true
    },
    endtime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    },
    status: {
        type: Number,
        default: 0
    }
})
const assignslotModel = mongoose.model('slot', assignslotSchema)

const stationownerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    stationlicense: {
        type: String,
        required: true
    }
})
const stationownerModel = mongoose.model('stationowner', stationownerSchema)
const paymentSchema = mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
    },
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationreg"
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationowner"
    },
    price: {
        type: Number
    },
    payment_id: {
        type: String,

    },
    order_id: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slot'
    },
    status: {
        type: Number,
        default: 0
    }
})
const paymentModel = mongoose.model('payment', paymentSchema)
const bookingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register", // Reference to the user collection
        required: true,
    },
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationreg", // Reference to the station registration collection
        required: true,
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationowner"
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "slot", // Reference to the slot collection
        required: true,
    },
    battery_percent: {
        type: Number, // Current battery percentage
        required: true,
    },
    desired_battery_percent: {
        type: Number, // Desired battery percentage
        required: true,
    },
    start_time: {
        type: String, // Start time of the booking
        required: true,
    },
    charging_time: {
        type: Number, // Calculated charging time in hours
        required: true,
    },
    amount: {
        type: Number, // Calculated amount for the booking
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const bookingModel = mongoose.model("booking", bookingSchema);


const complaintSchema = new mongoose.Schema({
    recipient: {
        type: String,
        enum: ['admin', 'station'],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true
    },
    stationowner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner',
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        default: 0
    }
});

const complaintModel = mongoose.model("complaint", complaintSchema)

const replySchema = mongoose.Schema({
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'complaint'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg'
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    replies: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const replyModel = mongoose.model('reply', replySchema)

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    admin_seen: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
})

const notificationModel = mongoose.model('notifications', notificationSchema)

module.exports = { mechanicModel, registerModel, loguserModel, stationregModel, assignslotModel, stationownerModel, paymentModel, bookingModel, complaintModel, replyModel, notificationModel };
=======
const mongoose = require('mongoose');
const status = require('statuses');
const mechanicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    workingtime: {
        type: String,
        required: true
    }
})
const mechanicModel = mongoose.model('mechanic', mechanicSchema)
const registerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    license: {
        type: String,
        required: true
    }

})
const registerModel = mongoose.model('register', registerSchema)
const loginSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    usertype: {
        type: Number,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'regtype'
    },
    regtype: {
        type: String,
        enum: ['register', 'stationreg', 'stationowner'],
        required: true
    }
})
const loguserModel = mongoose.model('login', loginSchema)
const stationregSchema = mongoose.Schema({
    stationname: {
        type: String,
        required: true
    },
    location: {
        type: String,

    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    chargingtype:
    {
        type: String,
        required: true
    },
    restroom: {
        gender: String,
        toilet: String,
        water: String,
        toiletpaper: String,
        changingroom: String,
        feedingroom: String,
        handryer: String,
        sanitarybin: String,
        wheelchair: String,
        emergency: String,
        // notes: String
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    }

})
const stationregModel = mongoose.model('stationreg', stationregSchema)
const assignslotSchema = mongoose.Schema({
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg',
    },
    starttime: {
        type: String,
        required: true
    },
    endtime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    },
    status: {
        type: Number,
        default: 0
    }
})
const assignslotModel = mongoose.model('slot', assignslotSchema)

const stationownerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    stationlicense: {
        type: String,
        required: true
    }
})
const stationownerModel = mongoose.model('stationowner', stationownerSchema)
const paymentSchema = mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking"
    },
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationreg"
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationowner"
    },
    price: {
        type: Number
    },
    payment_id: {
        type: String,

    },
    order_id: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slot'
    },
    status: {
        type: Number,
        default: 0
    }
})
const paymentModel = mongoose.model('payment', paymentSchema)
const bookingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register", // Reference to the user collection
        required: true,
    },
    sid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationreg", // Reference to the station registration collection
        required: true,
    },
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stationowner"
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "slot", // Reference to the slot collection
        required: true,
    },
    battery_percent: {
        type: Number, // Current battery percentage
        required: true,
    },
    desired_battery_percent: {
        type: Number, // Desired battery percentage
        required: true,
    },
    start_time: {
        type: String, // Start time of the booking
        required: true,
    },
    charging_time: {
        type: Number, // Calculated charging time in hours
        required: true,
    },
    amount: {
        type: Number, // Calculated amount for the booking
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const bookingModel = mongoose.model("booking", bookingSchema);


const complaintSchema = new mongoose.Schema({
    recipient: {
        type: String,
        enum: ['admin', 'station'],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true
    },
    stationowner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner',
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        default: 0
    }
});

const complaintModel = mongoose.model("complaint", complaintSchema)

const replySchema = mongoose.Schema({
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'complaint'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationreg'
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stationowner'
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    replies: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const replyModel = mongoose.model('reply', replySchema)

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    admin_seen: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
})

const notificationModel = mongoose.model('notifications', notificationSchema)

module.exports = { mechanicModel, registerModel, loguserModel, stationregModel, assignslotModel, stationownerModel, paymentModel, bookingModel, complaintModel, replyModel, notificationModel };
>>>>>>> 7e53bc75fe70b0ea731176fb4678a1049314690a
