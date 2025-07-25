import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ViewSlot() {
  useEffect(() => {
    if (sessionStorage.getItem("reload") === "true") {
      sessionStorage.removeItem("reload");

      // Show loading overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: white; z-index: 9999; display: flex;
          align-items: center; justify-content: center;
        `;
      overlay.innerHTML = '<div>Loading...</div>';
      document.body.appendChild(overlay);

      // Immediate reload
      window.location.replace(window.location.href);
    }
  }, []);
  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    navigate('/');
  };
  const [slotview, setSlotview] = useState([]);
  console.log("Slotview:", slotview);
  const [auth] = useState(JSON.parse(localStorage.getItem("yourstorage") || '{"userid": "default"}'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [batteryPercent, setBatteryPercent] = useState("");
  const [desiredBatteryPercent, setDesiredBatteryPercent] = useState("");
  const [chargingTime, setChargingTime] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:4000/ev/viewslots")
      .then((res) => res.json())
      .then((result) => {
        console.log("Fetched slots:", result);
        setSlotview(result)})
      .catch((err) => console.error("Error fetching slot data:", err));
  }, []);

  const handleOpenModal = async (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
    try {
      const res = await fetch(`http://localhost:4000/ev/getBookedTimes/${slot._id}`);
      const data = await res.json();
      if (data.success) setBookedTimes(data.times);
    } catch (error) {
      console.error("Failed to fetch booked times", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setBatteryPercent("");
    setDesiredBatteryPercent("");
    setChargingTime(0);
    setCalculatedAmount(0);
    setSelectedStartTime("");
  };

  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading form styles...</p>
        </div>
      </div>
    );
  }

  const handleDesiredBatteryPercentChange = (e) => {
  const desiredPercent = parseFloat(e.target.value);
  const currentPercent = parseFloat(batteryPercent);
  setDesiredBatteryPercent(desiredPercent);

  if (
    !isNaN(currentPercent) &&
    !isNaN(desiredPercent) &&
    currentPercent >= 0 &&
    currentPercent <= 100 &&
    desiredPercent >= 0 &&
    desiredPercent <= 100 &&
    selectedSlot
  ) {
    const percentToCharge = desiredPercent - currentPercent;

    if (percentToCharge > 0) {
      // Assume 40 kWh full battery
      const totalBatteryCapacity = 40;
      const kWhToCharge = (percentToCharge / 100) * totalBatteryCapacity;

      const chargingType = selectedSlot.sid?.chargingtype?.toLowerCase();
      const ratePerKWh = selectedSlot.amount;

      // Adjust charging speed based on type
      const chargingPower = chargingType.includes("dc") ? 30 : 7; // kW speed

      const timeInHours = kWhToCharge / chargingPower;
      const totalAmount = kWhToCharge * ratePerKWh;

      setChargingTime(timeInHours.toFixed(2));
      setCalculatedAmount(totalAmount.toFixed(2));
    } else {
      setChargingTime(0);
      setCalculatedAmount(0);
    }
  } else {
    setChargingTime(0);
    setCalculatedAmount(0);
  }
};


  const handleConfirmBooking = () => {
    if (!batteryPercent || batteryPercent < 0 || batteryPercent > 100) {
      alert("Please enter a valid current battery percentage (0-100).");
      return;
    }
    if (!desiredBatteryPercent || desiredBatteryPercent < 0 || desiredBatteryPercent > 100) {
      alert("Please enter a valid desired battery percentage (0-100).");
      return;
    }
    if (!selectedStartTime) {
      alert("Please select a start time.");
      return;
    }
    const bookingDetails = {
      user_id: auth.userid,
      slot_id: selectedSlot._id,
      sid: selectedSlot.sid?._id,
      ownerid: selectedSlot.ownerid ?? null,
      battery_percent: batteryPercent,
      desired_battery_percent: desiredBatteryPercent,
      start_time: selectedStartTime,
      charging_time: chargingTime,
      amount: calculatedAmount,
    };
    fetch("http://localhost:4000/ev/bookslot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingDetails),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.booking) {
          navigate("/paybooking", { state: { booking: result.booking } });
        } else {
          alert("Booking successful, but payment details could not be loaded.");
        }
      })
      .catch((err) => {
        console.error("Error booking slot:", err);
        alert("Failed to book the slot. Please try again.");
      });
  };

  const getCardColor = (slot) => {
    const chargingType = slot.sid?.chargingtype?.toLowerCase() || "";
    if (chargingType.includes("dc")) {
      return {
        header: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-500",
        badge: "bg-purple-100 text-purple-800 border border-purple-200",
        button: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        rate: "text-purple-700 font-bold",
        glow: "shadow-purple-200",
        icon: "⚡"
      };
    }
    return {
      header: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
      badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      button: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      rate: "text-emerald-700 font-bold",
      glow: "shadow-emerald-200",
      icon: "🔋"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              ⚡ EV Charging Hub
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover premium charging stations near you. Fast, reliable, and eco-friendly power for your electric journey.
            </p>

            {/* Back Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleBack}
                className="group flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/30"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 text-blue-50">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
            <div className="text-3xl font-bold text-blue-600 mb-2">{slotview.length}</div>
            <div className="text-gray-600">Available Slots</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Service Available</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
            <div className="text-3xl font-bold text-pink-600 mb-2">Regular & Fast</div>
            <div className="text-gray-600">AC & DC Charging</div>
          </div>
        </div>

        {/* Charging Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {slotview.map((slot) => {
            const color = getCardColor(slot);

            return (
              <div
                key={slot._id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Glowing effect */}
                <div className={`absolute inset-0 ${color.glow} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}></div>

                {/* Header */}
                <div className={`${color.header} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12">
                    {color.icon}
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white mb-2 truncate">
                      {slot.sid?.stationname || "Unnamed Station"}
                    </h2>
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {slot.sid?.location || "Location not available"}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Charging Type Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Charging Type</span>
                    <span className={`${color.badge} px-4 py-2 rounded-full text-sm font-semibold`}>
                      {slot.sid?.chargingtype}
                    </span>
                  </div>

                  {/* Time Slot */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Time Slot</span>
                    <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                      {slot.starttime} - {slot.endtime}
                    </span>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Rate</span>
                    <span className={`${color.rate} text-xl flex items-center gap-1`}>
                      ₹{slot.amount}
                      <span className="text-sm text-gray-500">/kWh</span>
                    </span>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600">
                      {slot.sid?.chargingtype?.toLowerCase().includes("dc")
                        ? "⚡ DC Fast Charging: Perfect for quick top-ups and busy schedules"
                        : "🔋 AC Standard Charging: Cost-effective solution for extended stays"}
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleOpenModal(slot)}
                    className={`w-full ${color.button} text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Reserve Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Booking Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className={`${getCardColor(selectedSlot).header} p-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform rotate-12">
                {getCardColor(selectedSlot).icon}
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Reserve Your Slot</h2>
                  <p className="text-white/90 text-lg">{selectedSlot.sid?.stationname}</p>
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {selectedSlot.sid?.location}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-96">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Time
                </label>
                <input
                  type="time"
                  value={selectedStartTime}
                  onChange={(e) => {
                    const time = e.target.value;
                    if (bookedTimes.includes(time)) {
                      alert("This time slot is already booked.");
                      setSelectedStartTime("");
                    } else {
                      setSelectedStartTime(time);
                    }
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Current Battery */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                  </svg>
                  Current Battery %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Enter current battery level"
                />
              </div>

              {/* Target Battery */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Target Battery %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={desiredBatteryPercent}
                  onChange={handleDesiredBatteryPercentChange}
                  className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Enter desired battery level"
                />
              </div>

              {/* Calculation Summary */}
              {chargingTime > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Booking Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {chargingTime}{" "}
                      {selectedSlot.sid?.chargingtype?.toLowerCase().includes("dc") &&
                        `(${Math.round(parseFloat(chargingTime) * 60)} mins)`}
                    </div>
                    <div className="text-sm text-gray-600">Hours</div>

                    </div>
                    <div className="bg-white p-4 rounded-xl text-center border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">₹{calculatedAmount}</div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                  </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewSlot;