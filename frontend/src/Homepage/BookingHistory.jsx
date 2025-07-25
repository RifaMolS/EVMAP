import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Clock, Zap, CreditCard, Download,
  X, AlertCircle, CheckCircle, Play, ArrowLeft
} from "lucide-react";

function BookingHistory() {
  const [bookinghistory, setBookinghistory] = useState([]);
  const [auth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yourstorage"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [tailwindReady, setTailwindReady] = useState(false);

  // ✅ Booking history fetch with auto-complete logic
  const fetchBookingHistory = useCallback(() => {
    if (!auth?.userid) return;

    const data = { user_id: auth.userid };

    fetch("http://localhost:4000/ev/bookinghistory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedBookings = result.map((booking) => {
          const status = booking.status;
          const start = new Date(booking.booking_id?.start_time);
          const duration = parseFloat(booking.booking_id?.charging_time || 0);
          const endTime = new Date(start.getTime() + duration * 60 * 60 * 1000);
          const now = new Date();

          if (status === 5 && now > endTime) {
            // ✅ Auto-mark as Completed
            fetch(`http://localhost:4000/ev/paymentstatus/${booking._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: 4 }),
            })
              .then(() => {
                booking.status = 4;
              })
              .catch((err) => console.error("Auto-complete failed", err));
          }

          return booking;
        });

        setBookinghistory(updatedBookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking history:", error);
        setLoading(false);
      });
  }, [auth]);

  useEffect(() => {
    fetchBookingHistory();
    const interval = setInterval(fetchBookingHistory, 60000);
    return () => clearInterval(interval);
  }, [fetchBookingHistory]);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:4000/ev/paymentstatus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setBookinghistory((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      })
      .catch((err) => console.error("Status update error:", err));
  };

  const downloadPDF = (book) => {
    try {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica");
        const createdAt = book.booking_id?.created_at
          ? new Date(book.booking_id.created_at).toLocaleString()
          : "N/A";
        const restroomAvailable = book.sid?.restroom ? "Yes" : "No";

        doc.setFontSize(20);
        doc.text("EV Charging Receipt", 20, 20);
        doc.setFontSize(12);
        doc.line(20, 25, 190, 25);

        const lines = [
          `User Name: ${book.user_id?.name || "N/A"}`,
          `Station Name: ${book.sid?.stationname || "N/A"}`,
          `Location: ${book.sid?.location || "N/A"}`,
          `Start Time: ${book.booking_id?.start_time || "N/A"}`,
          `Charging Time: ${book.booking_id?.charging_time || "N/A"} hrs`,
          `Amount Paid: ${book.booking_id?.amount || 0} Rs`,
          `Created At: ${createdAt}`,
          `Restroom Available: ${restroomAvailable}`,
        ];

        let y = 35;
        lines.forEach((line) => {
          doc.text(line, 20, y);
          y += 10;
        });

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for using EVMap!", 20, y + 10);
        doc.save(`booking-${book._id}.pdf`);
      };

      script.onerror = () => {
        console.error("Failed to load jsPDF");
        alert("Failed to load PDF library. Please try again.");
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 1:
        return { label: "Not Completed", color: "bg-gray-100 text-gray-800", icon: AlertCircle, dotColor: "bg-gray-400" };
      case 2:
        return { label: "Delayed", color: "bg-orange-100 text-orange-800", icon: Clock, dotColor: "bg-orange-400" };
      case 3:
        return { label: "Cancelled", color: "bg-red-100 text-red-800", icon: X, dotColor: "bg-red-400" };
      case 4:
        return { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle, dotColor: "bg-green-400" };
      case 5:
        return { label: "Charging", color: "bg-blue-100 text-blue-800", icon: Zap, dotColor: "bg-blue-400" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: AlertCircle, dotColor: "bg-gray-400" };
    }
  };

  if (!tailwindReady || loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button style={{ color: "black", fontSize: "25px", fontWeight: "bold" }} onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-600">Track and manage your EV charging bookings</p>
        </div>

        {bookinghistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking history found</h3>
            <p className="text-gray-500">Your charging session history will appear here once you make your first booking.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookinghistory.map((book, index) => {
              const statusConfig = getStatusConfig(book.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {book.sid?.stationname || "N/A"}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{book.sid?.location || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`} />
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-xs font-medium">Start Time</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{book.booking_id?.start_time || "N/A"}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Zap className="w-4 h-4 mr-2" />
                          <span className="text-xs font-medium">Duration</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{book.booking_id?.charging_time || "N/A"} hrs</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 mb-1">
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span className="text-xs font-medium">Amount</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">₹{book.booking_id?.amount || 0}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-xs font-medium">Booked</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {book.booking_id?.created_at
                            ? new Date(book.booking_id.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    {book.status !== 4 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        {book.status !== 2 && book.status !== 3 && book.status !== 5 && (
                          <button
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
                            onClick={() => updateStatus(book._id, 3)}
                          >
                            <X className="w-4 h-4 mr-2 inline" />
                            Cancel
                          </button>
                        )}

                        {book.status !== 2 && book.status !== 3 && book.status !== 5 && (
                          <button
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg"
                            onClick={() => updateStatus(book._id, 2)}
                          >
                            <Clock className="w-4 h-4 mr-2 inline" />
                            Mark Delayed
                          </button>
                        )}

                        {/* ✅ Only show Mark Complete after Start Charging */}
                        {book.status === 5 && (
                          <button
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                            onClick={() => updateStatus(book._id, 4)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2 inline" />
                            Mark Complete
                          </button>
                        )}

                        {book.status !== 3 && book.status !== 5 && (
                          <button
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                            onClick={() => updateStatus(book._id, 5)}
                          >
                            <Play className="w-4 h-4 mr-2 inline" />
                            Start Charging
                          </button>
                        )}
                      </div>
                    )}

                    {book.status === 4 && (
                      <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                          onClick={() => downloadPDF(book)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
