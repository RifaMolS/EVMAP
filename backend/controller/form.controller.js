const { log } = require("console");
const { mechanicModel, registerModel, loguserModel, stationregModel, assignslotModel, stationownerModel, bookingModel, paymentModel, complaintModel, replyModel, notificationModel } = require("../model/form.model")


const path = require("path");


exports.MechInsert = async (req, res) => {
  try {
    await mechanicModel.create(req.body)
    res.json("Successful")
  }
  catch (err) {
    console.log(err);
    res.json(err)
  }
}
exports.mechanicView = async (req, res) => {
  try {
    const data = await mechanicModel.find()
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.json(err)
  }

}
exports.deleteMech = async (req, res) => {
  try {
    await mechanicModel.findByIdAndDelete(req.body.id)
    res.json("Deleted Successfully")
  }
  catch (err) {
    console.log(err);
    res.json(err);

  }
}
exports.mechEditByid = async (req, res) => {
  try {
    let edit = await mechanicModel.findById(req.body.id)
    res.json(edit)
  }
  catch (err) {
    console.log(err);

  }
}
exports.mechanicUpdate = async (req, res) => {
  try {
    let update = await mechanicModel.findByIdAndUpdate(req.body.id, req.body)
    console.log(update);
    res.json("Update Successfully")
  }
  catch (err) {
    console.log(err);
    res.json(err)

  }
}
exports.userReg = async (req, res) => {
  try {
    const file = req.files?.license; // ✅ "license" is the field name used for image
    if (!file) {
      return res.status(400).json({ error: "License image is required" });
    }

    const fileName = file.name;
    const imagePath = path.join(__dirname, "../asset/", fileName);

    file.mv(imagePath, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      try {
        // ✅ Save user with license (image file name)
        const userRegister = {
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          license: fileName,
        };

        const user = await registerModel.create(userRegister);

        // ✅ Save login data
        const userLogin = {
          email: req.body.email,
          password: req.body.password,
          usertype: req.body.usertype,
          regtype: "register",
          userid: user._id,
        };

        await loguserModel.create(userLogin);
        await notificationModel.create({
          title: `New User ${req.body.name} Registered`,
        });


        res.json("Successful");
      } catch (dbErr) {
        console.error("Database error:", dbErr);
        res.status(500).json({ error: "Database operation failed" });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.regView = (async (req, res) => {
  try {
    let data = await loguserModel.find({ regtype: "register" }).populate('userid')
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.json(err)
  }
})

exports.regStation = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const stationReg = {
      stationname: req.body.stationname,
      phone: req.body.phone,
      location: req.body.location,
      lat: req.body.lat,
      lng: req.body.lng,
      chargingtype: req.body.chargingtype,
      restroom: req.body.restroom,
      ownerid: req.body.ownerid
    }
    const station = await stationregModel.create(stationReg);
    console.log("Station created:", station);
    const loginData = {
      email: req.body.email,
      password: req.body.password,
      usertype: req.body.usertype, // Assuming 0 = station
      regtype: "stationreg", // 👈 Update enum to include this in your model if not already
      userid: station._id,
    };

    await loguserModel.create(loginData);

    await notificationModel.create({
      title: `New Station ${req.body.stationname} Registered`,
    });

    res.json("Station registration successful");
  } catch (err) {
    console.error("Error in regStation:", err);
    res.status(500).json({ error: "Registration failed", details: err });
  }
};


exports.stationregister = async (req, res) => {
  try {
    const registerowner = {
      name: req.body.name,
      phone: req.body.phone,
      stationlicense: req.body.stationlicense,
    }
    console.log("err")
    const owner = await stationownerModel.create(registerowner)
    const loginData = {
      email: req.body.email,
      password: req.body.password,
      usertype: req.body.usertype, // Assuming 0 = station
      regtype: "stationowner", // 👈 Update enum to include this in your model if not already
      userid: owner._id,
    };
    await loguserModel.create(loginData);

    await notificationModel.create({
      title: `New Station Owner ${req.body.name} Registered`,
    });
    res.json("station register successfull")
  }
  catch (err) {
    console.log(err);
    res.json(err);
  }
}


exports.regStationView = (async (req, res) => {
  try {
    let data = await loguserModel.find({ regtype: 'stationreg' }).populate('userid')
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.json(err)
  }
})
exports.login = (async (req, res) => {
  try {
    let para = {
      email: req.body.email,
      password: req.body.password
    };
    let user = await loguserModel.findOne({ email: para.email });
    if (user) {
      if (user.password == para.password) {
        if (user.usertype == 0 || user.usertype == 1 || user.usertype == 2 || user.usertype == 3) {
          req.session.user = user;
          res.json(user)
          console.log("success");
        }
        else {
          res.json("user not found")
          console.log("user not found")
        }
      }
      else {
        res.json("Wrong Password")
        console.log("Wrong Password");
      }
    }
    else {
      res.json("User not found")
      console.log("User not found");
    }
  }
  catch (err) {
    console.log(err);
  }
})


exports.slotdelete = (async (req, res) => {
  try {
    const { id } = req.body;
    await assignslotModel.findByIdAndDelete(id);
    res.json("Deleted Successfully")
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete slot" });
  }
})

exports.slotview = async (req, res) => {
  try {
    const data = await assignslotModel.find().populate("sid", "_id stationname location chargingtype")
    res.json(data)
    console.log("Returned slots:", data.map(d => d.sid?.stationname));
  }
  catch (err) {
    console.log(err)
    res.json(err)
  }
}
exports.regDelete = async (req, res) => {
  try {
    const { id } = req.body;

    // First delete instructor from instructorModel
    await stationregModel.findByIdAndDelete(id);

    // Then delete vendor login where vendorid == id (because vendorid points to instructor _id)
    await loguserModel.findOneAndDelete({ userid: id });

    res.json("Deleted from both models successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete" });
  }
};

exports.viewStation = async (req, res) => {
  try {
    const { ownerid } = req.body;

    // 1. Find all stations for this owner
    const stations = await stationregModel.find({ ownerid }).lean();

    // 2. Find email from login table for this owner
    const login = await loguserModel.findOne({
      userid: ownerid,
      regtype: 'stationowner'
    }).lean();

    const email = login?.email || '';

    // 3. Attach email to each station record
    const stationsWithEmail = stations.map(station => ({
      ...station,
      email
    }));

    res.json(stationsWithEmail);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.slotinsert = (async (req, res) => {
  try {
    const slot = {
      ...req.body,
      amount: req.body.amount
    };
    console.log("Request body:", req.body);
    await assignslotModel.create(slot)
    res.json({ message: "Successful", data: slot });
  }
  catch (err) {
    console.error("Insert Error:", err.message, err);
    res.status(500).json({ error: err.message });
  }

})

exports.viewslot = (async (req, res) => {
  try {
    const { ownerid } = req.body;
    console.log(ownerid);
    let data = await assignslotModel.find({ ownerid }).populate('sid', 'stationname location');
    console.log(data);
    res.json(data)
  }
  catch (err) {
    console.log(err);
  }
})
exports.editslot = (async (req, res) => {
  try {
    let edit = await assignslotModel.findById(req.body.id)
    res.json(edit)
  }
  catch (err) {
    console.log(err);
  }
})
exports.editslotupdate = async (req, res) => {
  try {
    const updatedSlot = {
      ...req.body,
      amount: req.body.amount
    };

    await assignslotModel.findByIdAndUpdate(req.body.id, updatedSlot);
    res.json({ message: "Updated Successfully", data: updatedSlot });
  } catch (err) {
    console.error("Update Error:", err.message, err);
    res.status(500).json({ error: err.message });
  }
};


exports.viewprofile = (async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    let data = await loguserModel.find({ userid: id }).populate('userid')
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.json(err)
  }
})

exports.editprofile = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Received ID:", id);

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const userProfile = await loguserModel
      .findOne({ userid: id })
      .populate('userid');

    console.log("User Profile:", userProfile);

    if (!userProfile || !userProfile.userid) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const profileData = {
      name: userProfile.userid.name,
      phone: userProfile.userid.phone,
      address: userProfile.userid.address,
      email: userProfile.email,
    };

    res.json(profileData);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateprofile = (async (req, res) => {
  try {
    let update = await registerModel.findByIdAndUpdate(req.body.id, req.body)
    res.json("Updated Successfully", update)
  }
  catch (err) {
    console.error("Update Error:", err.message, err);
    res.status(500).json({ error: err.message });
  }
})

exports.updateprofile = async (req, res) => {
  try {
    const { id, name, phone, address, email } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Update the register table
    const updatedRegister = await registerModel.findByIdAndUpdate(
      id,
      { name, phone, address },
      { new: true } // Return the updated document
    );

    if (!updatedRegister) {
      return res.status(404).json({ error: "Profile not found in register table" });
    }

    // Update the login table
    const updatedLogin = await loguserModel.findOneAndUpdate(
      { userid: id },
      { email },
      { new: true } // Return the updated document
    );

    if (!updatedLogin) {
      return res.status(404).json({ error: "Profile not found in login table" });
    }

    res.json({ message: "Profile updated successfully", updatedRegister, updatedLogin });
  } catch (err) {
    console.error("Update Error:", err.message, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.viewslotadmin = async (req, res) => {
  try {
    const data = await assignslotModel.find().populate("sid", "stationname location")
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.json(err)
  }
}

exports.viewStations = async (req, res) => {
  try {
    const station = await stationregModel.find().populate('ownerid')
    res.json(station)
  }
  catch (err) {
    console.log("error", err)
  }
}




exports.createBooking = async (req, res) => {
  try {
    const {
      user_id,
      slot_id,
      sid,
      ownerid,
      battery_percent,
      desired_battery_percent,
      start_time,
      charging_time,
      amount,
    } = req.body;

    console.log("Request payload:", req.body);

    // Validate battery percentages
    if (battery_percent < 0 || battery_percent > 100) {
      return res.status(400).json({ message: "Invalid current battery percentage" });
    }
    if (desired_battery_percent < 0 || desired_battery_percent > 100) {
      return res.status(400).json({ message: "Invalid desired battery percentage" });
    }

    // Validate slot existence
    const slot = await assignslotModel.findById(slot_id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Validate station existence
    const station = await stationregModel.findById(slot.sid);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Convert user input to usable time objects
    const userStartTime = new Date(`1970-01-01T${start_time}:00`);
    const userEndTime = new Date(userStartTime.getTime() + charging_time * 60 * 60 * 1000);

    // Ensure user's selected time is within the slot's available window
    const slotStartTime = new Date(`1970-01-01T${slot.starttime}:00`);
    const slotEndTime = new Date(`1970-01-01T${slot.endtime}:00`);

    if (userStartTime < slotStartTime || userEndTime > slotEndTime) {
      return res.status(400).json({ message: "Selected time is outside the slot's available time." });
    }

    const userBookings = await bookingModel.find({
      user_id,
      status: { $nin: [3, 4] }, // not cancelled or completed
    });

    const isOverlapping = userBookings.some((b) => {
      const bookedStart = new Date(`1970-01-01T${b.start_time}:00`);
      const bookedEnd = new Date(bookedStart.getTime() + b.charging_time * 60 * 60 * 1000);

      return userStartTime < bookedEnd && userEndTime > bookedStart;
    });

    if (isOverlapping) {
      return res.status(400).json({
        message: "You already have an active booking that overlaps with this time. Cancel or complete it to proceed.",
      });
    }

    // Proceed with booking
    slot.status = 1; // Mark the slot as booked
    await slot.save();

    const booking = new bookingModel({
      user_id,
      slot_id,
      sid,
      ownerid,
      battery_percent,
      desired_battery_percent,
      start_time,
      charging_time,
      amount,
    });

    await booking.save();

    // Populate booking for confirmation
    const populatedBooking = await bookingModel
      .findById(booking._id)
      .populate({
        path: "slot_id",
        populate: {
          path: "sid",
          select: "stationname location",
        },
      });

    console.log("Populated Booking:", populatedBooking);

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




exports.getBookedTime = async (req, res) => {
  try {
    const bookings = await bookingModel.find({ slot_id: req.params.slotId });
    const times = bookings.map((b) => b.start_time);
    res.json({ success: true, times });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch times" });
  }
}

exports.bookinghistory = async (req, res) => {
  try {
    const { user_id } = req.body;
    const bookings = await paymentModel
      .find({ user_id })
      .populate('sid')
      .populate('booking_id')
      .populate('user_id');
    res.json(Array.isArray(bookings) ? bookings : []);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected values: 2 for delay, 3 for cancel

  try {
    const updated = await paymentModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Status updated", payment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};


exports.addcomplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.create(req.body)
    res.json(complaint)
  }
  catch (err) {
    console.log(err);

  }
}
exports.viewcomplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.find({ recipient: "station" }).populate('station_id', 'stationname').populate('stationowner_id', 'name').populate('userId', 'name')
    res.json(complaint)
  }
  catch (err) {
    console.log(err);
    res.json(err);
  }
}
exports.replycomplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const complaints = await replyModel.create(req.body)
    res.json(complaints)
  }
  catch (err) {
    console.log(err);
    res.json(err);
  }
}

exports.viewcomplaintreply = async (req, res) => {
  try {
    const complaints = await complaintModel
      .find({ recipient: "admin" })
      .populate('userId', 'name')
      .populate('stationowner_id', 'name') // <-- populate owner name
      .populate('station_id', 'stationname'); // <-- populate station name
    res.json(complaints)
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};


exports.addstatus = async (req, res) => {
  try {
    const { complaint_id, status } = req.body;
    if (!complaint_id) {
      return res.status(400).json({ error: "complaint_id is required" });
    }
    const updated = await complaintModel.findByIdAndUpdate(
      complaint_id,
      { status: status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json({ message: "Status updated", complaint: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update complaint status" });
  }
};



exports.viewreplyforuser = async (req, res) => {
  try {
    const { userId } = req.body;
    const replies = await replyModel
      .find({ user_id: userId })
      .populate('complaint_id', 'subject message')
      .populate('owner_id', 'name');
    res.json(Array.isArray(replies) ? replies : []);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

exports.viewpaymentforadmin = async (req, res) => {
  try {
    const payment = await paymentModel.find()
      .populate('booking_id')
      .populate('sid')
      .populate('ownerid')
      .populate('user_id')
    res.json(payment)
  }
  catch (err) {
    console.log(err);
    res.json(err);
  }
}

exports.viewpaymentforstation = async (req, res) => {
  try {
    const { ownerid } = req.body;
    const payment = await paymentModel.find({ ownerid: ownerid }).populate('sid').populate('booking_id').populate('user_id');
    res.json(payment)
  }
  catch (err) {
    console.log(err);
    res.json(err);
  }
}


exports.getAllStations = async (req, res) => {
  try {
    const stations = await stationregModel.find();
    res.json({ message: "ok", stations: stations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ created_at: -1 });
    res.json({ message: "ok", notifications: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};

exports.getDashboardDetails = async (req, res) => {
  try {
    const customersCount = await registerModel.countDocuments();
    const totalIncomeResult = await bookingModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const totalIncome = totalIncomeResult[0]?.total || 0;


    const totalIncomeLast7Days = await bookingModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 6)) // last 7 days including today
          }
        }
      },
      {
        $project: {
          amount: 1,
          dateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
          }
        }
      },
      {
        $group: {
          _id: "$dateOnly",
          revenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    let dashboardArr = {
      customersCount: customersCount,
      totalIncomeLast7Days: totalIncomeLast7Days,
      totalIncome: totalIncome,
    };
    res.json({ message: "ok", dashboardDetails: dashboardArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};

exports.updateNoficationStatus = async (req, res) => {
  try {
    const notifications = await notificationModel.updateMany(
      {},
      { $set: { admin_seen: 1 } }
    );
    res.json({ message: "ok", notifications: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
};


exports.viewslotforstation = async (req, res) => {
  try {
    const { stationId } = req.body;
    console.log(stationId);
    let data = await assignslotModel
      .find({ sid: stationId })
      .populate("sid", "stationname location")
      .lean(); // This is the key line

    const slotsWithPaymentId = await Promise.all(
      data.map(async (slot) => {
        const payment = await paymentModel
          .findOne({ slot_id: slot._id }) // Get first matching payment (or refine as needed)
          .lean();

        return {
          ...slot,
          payment_id: payment || null, // Add the payment_id or null if none
        };
      })
    );
    // console.log(data);
    res.json(slotsWithPaymentId);
  } catch (err) {
    console.log(err);
  }
};
exports.viewslothistory = async (req, res) => {
  try {
    const { slotid } = req.body;
    let data = await paymentModel
      .find({ slot_id: slotid })
      .populate("booking_id")
      .populate("slot_id")
      .populate("user_id");
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await assignslotModel.find({}, 'sid'); // Only fetch station IDs
    res.json(slots);
  } catch (err) {
    console.error("Get Slots Error:", err.message, err);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};


exports.getStationOwnerById = async (req, res) => {
  try {
    const owner = await loguserModel.findOne({ userid: req.body.id });
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const stationOwner = await stationownerModel.findById(req.body.id);
    if (!stationOwner) return res.status(404).json({ message: "Station owner not found" });

    res.json({
      name: stationOwner.name,
      email: owner.email
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching station owner", error: err });
  }
};




