import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, MapPin, Clock, Zap, Plus, AlertCircle, Loader, IndianRupee } from 'lucide-react';

function AllSlots() {
  const [slot, setSlot] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Using your localStorage approach
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));

  useEffect(() => {
    setLoading(true);
    let ids = {
      ownerid: auth?.userid,
    };

    fetch('http://localhost:4000/ev/viewslot', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Response from backend:", result);
        setSlot(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error:', err);
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = (delid) => {
    setDeleteLoading(delid);
    let ids = {
      id: delid
    };
    
    fetch('http://localhost:4000/ev/slotdelete', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(ids)
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      setRefresh(prev => prev + 1);
      setDeleteLoading(null);
    })
    .catch((err) => {
      console.log('Delete Error:', err);
      setDeleteLoading(null);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your charging slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Zap className="w-10 h-10 text-indigo-600" />
                Charging Slots
              </h1>
              <p className="text-gray-600 text-lg">Manage your EV charging station time slots</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Slots</p>
                <p className="text-3xl font-bold text-gray-800">{slot.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Stations</p>
                <p className="text-3xl font-bold text-gray-800">{new Set(slot.map(s => s.sid?.stationname)).size}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Rate</p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{slot.length > 0 ? (slot.reduce((sum, s) => sum + (s.amount || 0), 0) / slot.length).toFixed(1) : '0'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <IndianRupee className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Slots Table/Cards */}
        {slot.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Slots Available</h3>
            <p className="text-gray-600 mb-6">You haven't created any charging slots yet. Get started by adding your first slot!</p>
            <Link 
              to="/addslot" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Slot
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Station
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Schedule
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        Rate
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {slot.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.sid?.stationname || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{item.sid?.location || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                            {item.starttime}
                          </span>
                          <span className="text-gray-400">to</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                            {item.endtime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-indigo-600">₹{item.amount}/KWh</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to="/slotedit" 
                            state={{id: item._id}}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Edit Slot"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteLoading === item._id}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Slot"
                          >
                            {deleteLoading === item._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {slot.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{item.sid?.stationname || "N/A"}</h3>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.sid?.location || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        to="/slotedit" 
                        state={{id: item._id}}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        disabled={deleteLoading === item._id}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
                      >
                        {deleteLoading === item._id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Schedule</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium inline-block w-fit">
                          {item.starttime}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium inline-block w-fit">
                          {item.endtime}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-sm font-medium">Rate</span>
                      </div>
                      <div className="font-bold text-lg text-indigo-600">₹{item.amount}/KWh</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSlots;