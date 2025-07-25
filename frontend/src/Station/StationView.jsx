import React, { useEffect, useState } from 'react';
import { Search, MapPin, Phone, Mail, Zap, Eye, EyeOff, Plus, SortAsc, SortDesc, Filter, Clock, Droplets, Home } from 'lucide-react';
import SlotModal from './SlotModal';

function StationView() {
  const [stationview, setStationview] = useState([]);
  const [stationsWithSlots, setStationsWithSlots] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'stationname',
    direction: 'ascending'
  });

  useEffect(() => {
    if (!auth?.userid) return;

    const ids = { ownerid: auth.userid };

    fetch("http://localhost:4000/ev/statview", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(ids)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stations');
        return res.json();
      })
      .then((result) => {
        console.log("Fetched stations:", result);
        
        setStationview(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations");
        setLoading(false);
      });
      // Fetch slots to identify which stations already have slots
fetch("http://localhost:4000/ev/getslots", {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then((res) => res.json())
.then((slots) => {
  const stationIdsWithSlots = slots.map(slot => slot.sid); // sid is station ID
  setStationsWithSlots(stationIdsWithSlots);
})
.catch((err) => {
  console.error("Error fetching slots:", err);
});

  }, [auth.userid]);

  const handleAddSlot = (station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    const sorted = [...stationview];
    sorted.sort((a, b) => {
      const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
      const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [stationview, sortConfig]);

  const filteredStations = sortedItems.filter((station) => {
    const search = searchTerm.toLowerCase();
    return (
      (station.stationname?.toLowerCase() || '').includes(search) ||
      (station.location?.toLowerCase() || '').includes(search) ||
      (station.email?.toLowerCase() || '').includes(search)
    );
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <SortAsc className="w-4 h-4 inline ml-1" />
      ) : (
        <SortDesc className="w-4 h-4 inline ml-1" />
      );
    }
    return <Filter className="w-4 h-4 inline ml-1 opacity-30" />;
  };

// ...existing code...
const formatBoolean = (value) => {
  if (value === 'yes' || value === true || value === 'true') 
    return <span className="text-green-600 font-bold">✓</span>;
  if (value === 'no' || value === false || value === 'false') 
    return <span className="text-red-500 font-bold">✗</span>;
  // Changed from text-gray-400 to text-gray-700 and bold
  return <span className="text-gray-700 font-semibold">N/A</span>;
};
// ...existing code...

  const getChargingTypeColor = (type) => {
    const typeStr = (type || '').toLowerCase();
    if (typeStr.includes('dc') || typeStr.includes('fast')) 
      return 'bg-purple-100 text-purple-800';
    if (typeStr.includes('level 2') || typeStr.includes('ac')) 
      return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading stations...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Stations</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Registered Stations
            </h1>
            <p className="text-gray-600 text-lg">Manage your charging station network</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Stats Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg hover:shadow-xl"
              placeholder="Search by station name, location or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredStations.length}</div>
                <div className="text-sm text-gray-600">Showing</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stationview.length}</div>
                <div className="text-sm text-gray-600">Total Stations</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Updated just now
            </div>
          </div>
        </div>

        {/* Stations Grid/Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th 
                    onClick={() => requestSort('stationname')} 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span className="font-semibold">Station Name</span>
                      {getSortIndicator('stationname')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold">Phone</span>
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('email')} 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="font-semibold">Email</span>
                      {getSortIndicator('email')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('location')} 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">Location</span>
                      {getSortIndicator('location')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('chargingtype')} 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Type</span>
                      {getSortIndicator('chargingtype')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="font-semibold">Details</span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="font-semibold">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStations.length > 0 ? (
                  filteredStations.map((station, index) => (
                    <React.Fragment key={station._id}>
                      <tr className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {station.stationname || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {station.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {station.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {station.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getChargingTypeColor(station.chargingtype)}`}>
                            {station.chargingtype || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            {expandedRow === index ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span>Details</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {stationsWithSlots.includes(station._id) ? (
  <button
    disabled
    className="inline-flex items-center space-x-1 bg-gray-300 text-white px-4 py-2 rounded-xl cursor-not-allowed"
  >
    <span className="font-medium">✅ Added</span>
  </button>
) : (
  <button
    onClick={() => handleAddSlot(station)}
    className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
  >
    <Plus className="w-4 h-4" />
    <span className="font-medium">Add Slot</span>
  </button>
)}

                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <td colSpan="7" className="p-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Home className="w-5 h-5 mr-2 text-blue-600" />
                                Station Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Toilet</span>
                                    <span className="text-gray-900">{station.restroom?.toilet || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <Droplets className="w-4 h-4 text-gray-600" />
                                      <span className="font-medium text-gray-700">Water</span>
                                    </div>
                                    {formatBoolean(station.restroom?.water)}
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Toilet Paper</span>
                                    {formatBoolean(station.restroom?.toiletpaper)}
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Changing Room</span>
                                    {formatBoolean(station.restroom?.changingroom)}
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Feeding Room</span>
                                    {formatBoolean(station.restroom?.feedingroom)}
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Hand Dryer</span>
                                    {formatBoolean(station.restroom?.handryer)}
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Sanitary Bin</span>
                                    {formatBoolean(station.restroom?.sanitarybin)}
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Wheelchair</span>
                                    {formatBoolean(station.restroom?.wheelchair)}
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Emergency</span>
                                    {formatBoolean(station.restroom?.emergency)}
                                  </div>
                                </div>
                              </div>
                              
                              {station.restroom?.notes && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <h5 className="font-semibold text-blue-800 mb-2">Notes</h5>
                                  <p className="text-blue-700">{station.restroom?.notes}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">No stations found</h3>
                          <p className="text-gray-500">Try adjusting your search criteria</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        station={selectedStation}
       
      />
    </div>
  );
}

export default StationView;

