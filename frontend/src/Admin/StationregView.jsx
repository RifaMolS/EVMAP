import React, { useEffect, useState } from 'react';

function StationregView() {
  const [stationview, setStationview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'stationname',
    direction: 'ascending'
  });

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:4000/ev/stationregview")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((result) => {
        console.log("Fetched stations:", result);
        // Log the restroom property of each station
        result.forEach((station, idx) => {
console.log(`Station ${idx} operating hours:`, station.restroom?.operatinghours ?? 'N/A');        });
        setStationview(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load stations");
        setLoading(false);
      });
  }, []);

  // Handle deletion
  const handleDelete = (delid) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      const ids = {
        id: delid
      };
      
      fetch('http://localhost:4000/ev/regdelete', {
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
          // Refresh the list after deletion
          setStationview(stationview.filter(item => item.userid._id !== delid));
        })
        .catch((err) => {
          console.error("Error deleting station:", err);
        });
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...stationview];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle nested properties
        let aValue, bValue;
        
        if (sortConfig.key === 'email') {
          aValue = a.email || '';
          bValue = b.email || '';
        } else {
          aValue = a.userid?.[sortConfig.key] || '';
          bValue = b.userid?.[sortConfig.key] || '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [stationview, sortConfig]);

  // Filter stations by search term
  const filteredStations = sortedItems.filter(station => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (station.userid?.stationname?.toLowerCase() || '').includes(searchLower) ||
      (station.userid?.location?.toLowerCase() || '').includes(searchLower) ||
      (station.email?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Helper function to render sort indicator
  const getSortIndicator = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  // Format boolean values for display
  const formatBoolean = (value) => {
    if (value === 'yes' || value === true || value === 'true') {
      return '✓';
    } else if (value === 'no' || value === false || value === 'false') {
      return '✗';
    }
    return value || 'N/A';
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-10">Loading stations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-10 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="px-4 py-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Registered Stations
        </h1>
        
        {/* Search and Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search stations by name, location or email..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredStations.length} of {stationview.length} stations
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow w-full">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/6"
                    onClick={() => requestSort('stationname')}
                  >
                    Station Name{getSortIndicator('stationname')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Phone
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/6"
                    onClick={() => requestSort('email')}
                  >
                    Email{getSortIndicator('email')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/6"
                    onClick={() => requestSort('location')}
                  >
                    Location{getSortIndicator('location')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/8"
                    onClick={() => requestSort('chargingtype')}
                  >
                    Type{getSortIndicator('chargingtype')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.length > 0 ? (
                  filteredStations.map((station, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap truncate">
                          <div className="font-medium text-gray-900">
                            {station.userid?.stationname || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 truncate">
                          {station.userid?.phone || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 truncate">
                          {station.email || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 truncate">
                          {station.userid?.location || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 truncate">
                          {station.userid?.chargingtype || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-xs"
                            onClick={() => {
                              const newExpandedRow = expandedRow === index ? null : index;
                              setExpandedRow(newExpandedRow);
                            }}
                          >
                            {expandedRow === index ? 'Hide' : 'Details'}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(station.userid?._id)}
                            className="text-red-600 hover:text-red-900 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="7" className="px-4 py-3 bg-gray-50">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                              <div>
                                <h4 className="font-semibold">Gender</h4>
                                <p>{station.userid?.restroom?.gender || 'N/A'}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Hours</h4>
                                <p>{station.userid?.restroom?.operatinghours || 'N/A'}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Toilet</h4>
                                <p>{station.userid?.restroom?.toilet || 'N/A'}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Water</h4>
                                <p>{formatBoolean(station.userid?.restroom?.water)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Toilet Paper</h4>
                                <p>{formatBoolean(station.userid?.restroom?.toiletpaper)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Changing Room</h4>
                                <p>{formatBoolean(station.userid?.restroom?.changingroom)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Feeding Room</h4>
                                <p>{formatBoolean(station.userid?.restroom?.feedingroom)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Hand Dryer</h4>
                                <p>{formatBoolean(station.userid?.restroom?.handryer)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Sanitary Bin</h4>
                                <p>{formatBoolean(station.userid?.restroom?.sanitarybin)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Wheelchair</h4>
                                <p>{formatBoolean(station.userid?.restroom?.wheelchair)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Emergency</h4>
                                <p>{formatBoolean(station.userid?.restroom?.emergency)}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6">
                                <h4 className="font-semibold">Notes</h4>
                                <p className="break-words">{station.userid?.restroom?.notes || 'No additional notes'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                      No stations found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationregView;