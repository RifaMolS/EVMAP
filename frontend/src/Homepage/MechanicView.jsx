import React, { useEffect, useState } from 'react';
import { Search, Wrench, Clock, MapPin, Phone, Award } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

function MechanicView() {
  const [viewmech, setViewmech] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/ev/viewmech")
      .then((res) => res.json())
      .then((result) => {
        setViewmech(result);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching mechanics:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const filteredMechanics = viewmech.filter(mech => 
    mech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mech.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample mechanic data for demo when empty
  const dummyData = loading ? [
    { id: 1, name: "Loading...", contact: "Loading...", experience: "Loading...", address: "Loading...", time: "Loading..." },
    { id: 2, name: "Loading...", contact: "Loading...", experience: "Loading...", address: "Loading...", time: "Loading..." }
  ] : [];

  const displayData = viewmech.length > 0 ? filteredMechanics : dummyData;

  // Function to determine experience badge color
  const getExperienceBadgeColor = (years) => {
    const exp = parseInt(years);
    if (exp >= 10) return "bg-green-500";
    if (exp >= 5) return "bg-green-400";
    return "bg-green-300";
  };

  // Choose theme: dark or light
  const useDarkTheme = false;

  if (useDarkTheme) {
    return (
      <>
      <Header/>
      <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/page-title.jpg')" }}>
            <div className="container">
                <div className="row" >
                    <div className="col-md-12">
                        <div className="position-relative text-center">
                            <h1>View Mechanic</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="#!">View Mechanic</a></li>
                </ul>
            </div>
        </section>

      <div className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-1">EV Mechanics Directory</h1>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-3"></div>
            <p className="text-gray-400">Find qualified electric vehicle specialists in your area</p>
          </div>
          
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-300">Loading mechanics information...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-700 rounded-full">
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No technicians found</h3>
              <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search criteria to find available EV mechanics</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-green-500 uppercase text-xs">
                      <th className="px-6 py-4 text-left font-medium tracking-wider">Technician</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider">Experience</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left font-medium tracking-wider">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {displayData.map((mech, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-gray-900 font-bold">
                              {mech.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-white">{mech.name}</div>
                              <div className="text-xs text-gray-400">EV Specialist</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-300">
                            <Phone size={16} className="text-green-500 mr-2" />
                            {mech.contact}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full text-gray-900 ${getExperienceBadgeColor(mech.experience)}`}>
                            {mech.experience} Years
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-300">
                            <MapPin size={16} className="text-green-500 mr-2" />
                            {mech.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-300">
                            <Clock size={16} className="text-green-500 mr-2" />
                            {mech.time}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
      </>
    );
  } else {
    // Light theme
    return (
      <>
      <Header/>
      <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/page-title.jpg')" }}>
            <div className="container">
                <div className="row" style={{marginTop:"100px"}}>
                    <div className="col-md-12" >
                        <div className="position-relative text-center">
                            <h1>View Mechanic</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="#!" style={{color:"black"}}>View Mechanic</a></li>
                </ul>
            </div>
        </section>
        
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-black mb-2">EV Mechanics Directory</h1>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-4"></div>
            <p className="text-black">Professional EV service specialists at your fingertips</p>
          </div>
          
          <div className="mb-6 max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 focus:border-blue-500 focus:outline-none rounded-lg shadow-sm"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-4 top-3.5">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-blue-600 font-medium">Loading mechanics information...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-blue-800 mb-2">No technicians found</h3>
              <p className="text-blue-600 max-w-md mx-auto">Try adjusting your search criteria to find available EV mechanics</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-500 text-white">
                      <th className="px-6 py-4 text-left text-sm font-medium">Technician</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((mech, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-blue-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-blue-50/50' : 'bg-white'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                              {mech.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-black">{mech.name}</div>
                              <div className="text-xs text-black">EV Specialist</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-black">
                            <Phone size={16} className="text-green-500 mr-2" />
                            {mech.contact}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full text-white ${getExperienceBadgeColor(mech.experience)}`}>
                            {mech.experience} Years
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-black">
                            <MapPin size={16} className="text-green-500 mr-2" />
                            {mech.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-black">
                            <Clock size={16} className="text-green-500 mr-2" />
                            {mech.workingtime}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
      </>
    );
  }
}

export default MechanicView;