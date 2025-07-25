import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SlotEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    starttime: '',
    endtime: '',
    amount: ''
  });

  useEffect(() => {
    if (!location.state?.id) {
      setError("No slot ID provided");
      setIsLoading(false);
      return;
    }

    fetchSlotData();
  }, []);

  const fetchSlotData = async () => {
    try {
      const response = await fetch('http://localhost:4000/ev/editslot', {
        method: 'POST',
        headers: {
          Accept:'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: location.state.id }),
      });

      if (!response.ok) throw new Error('Failed to fetch slot data');

      const result = await response.json();
      setFormData({
        starttime: result.starttime ? result.starttime.split(' ')[0] : '',
        // starttimePeriod: result.starttime ? result.starttime.split(' ')[1] : 'AM',
        endtime: result.endtime ? result.endtime.split(' ')[0] : '',
        // endtimePeriod: result.endtime ? result.endtime.split(' ')[1] : 'AM',
        amount: result.amount || ''
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load slot data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.starttime) {
      errors.starttime = "Start time is required";
    }

    if (!formData.endtime) {
      errors.endtime = "End time is required";
    }

    if (
      formData.starttime &&
      formData.endtime &&
      formData.starttime >= formData.endtime
    ) {
      formErrors.endtime = "End time must be after start time";
    }

    if (!formData.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(formData.amount)) {
      errors.amount = "Amount must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/ev/updateslot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: location.state.id,
          starttime: `${formData.starttime}`,
          endtime: `${formData.endtime}`,
          amount: formData.amount
        }),
      });

      if (!response.ok) throw new Error("Failed to update slot");

      const data = await response.json();
      console.log(data);
      navigate('/', { state: { message: "Slot successfully updated" } });
    } catch (err) {
      console.error(err);
      setError("Failed to update slot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">Edit Slot</h2>
        <form onSubmit={handleEdit}>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="starttime"
                  value={formData.starttime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.starttime ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {formErrors.starttime && <p className="text-sm text-red-600 mt-1">{formErrors.starttime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="endtime"
                  value={formData.endtime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.endtime ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {formErrors.endtime && <p className="text-sm text-red-600 mt-1">{formErrors.endtime}</p>}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Charging Amount (₹/kWh)</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${formErrors.amount ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter amount in INR per kWh"
            />
            {formErrors.amount && <p className="text-sm text-red-600 mt-1">{formErrors.amount}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Updating..." : "Update Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
