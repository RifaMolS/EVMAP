import React, { useState } from 'react';
import { useEffect } from 'react';

function SlotModal({ isOpen, onClose, station, onSave }) {
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');  
  const [amount, setAmount] = useState('');
  const [auth]=useState(JSON.parse(localStorage.getItem('yourstorage')))
  console.log("Auth object:", auth);
  const [loading, setLoading] = useState(false); // Added loading state

  if (!isOpen || !station) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!starttime || !endtime || !amount) {
      alert("All fields are required");
      return;
    }
    
    const data = {
      sid: station._id,
      stationname: station.stationname,
      location: station.location,
      starttime,
      endtime,
      amount,
      ownerid:auth.userid,
      status:1

    };

    console.log("Payload being sent:", data); // Debug log
    
    

    try {
      setLoading(true); // Set loading to true
      const response = await fetch('http://localhost:4000/ev/slotins', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Response from server:", result);

      // Clear form fields
      setStarttime('');
      setEndtime('');
      setAmount('');

      alert("Slot Assigned Successfully");

      // Call the onSave callback if provided
      if (onSave) {
        onSave(result);
      }

      onClose(); // Close the modal
    } catch (error) {
      console.error("ERROR:", error);
      alert("An error occurred while submitting the data.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Slot for {station.stationname}</h2>
        <p className="mb-4 text-gray-600">Location: {station.location}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={starttime}
              onChange={(e) => setStarttime(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              value={endtime}
              onChange={(e) => setEndtime(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading} // Disable button while loading
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Saving..." : "Save Slot"} {/* Show loading text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SlotModal;