import React, { useEffect, useState } from 'react'
import { MapPin, Clock, DollarSign, Zap, IndianRupee } from 'lucide-react'

function Slot() {
  const [view, setView] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [auth] = useState(null) // Placeholder for demo

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:4000/ev/viewadminslot")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then((result) => {
        setView(result)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, []) 

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-gray-700 font-medium">Loading charging slots...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <Zap className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h3>
          <p className="text-gray-600">Failed to load charging slots: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-10 w-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EV Charging Slots
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage and monitor electric vehicle charging stations</p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Available Charging Stations
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-indigo-500" />
                      Station Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-500" />
                      Location
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Start Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      End Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-emerald-500" />
                      Amount
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {view.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Zap className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No charging slots available</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  view.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {item.sid?.stationname || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-green-500 mr-2" />
                          {item.sid?.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.starttime || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.endtime || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {item.amount || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        {view.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Zap className="h-5 w-5 mr-2 text-indigo-500" />
                <span className="font-medium">Total Slots: {view.length}</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Slot