import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewMech() {
  const [viewmech, setViewmech] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tailwindReady, setTailwindReady] = useState(false);

  const fetchMechanics = () => {
    setLoading(true);
    fetch("http://localhost:4000/ev/viewm")
      .then((res) => res.json())
      .then((result) => {
        setViewmech(result);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching mechanics:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMechanics();
    
    // Load Tailwind CSS dynamically
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
        }
    };
  }, []);

  const handleDelete = (mechanic) => {
    if (window.confirm(`Are you sure you want to delete ${mechanic.name}?`)) {
      let ids = { id: mechanic._id };
      fetch('http://localhost:4000/ev/delmech', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify(ids)
      })
        .then((Response) => Response.json())
        .then((result) => {
          console.log(result);
          // Refresh view after deletion by filtering out the deleted item
          setViewmech(viewmech.filter(item => item._id !== mechanic._id));
        })
        .catch(error => {
          console.error("Error deleting mechanic:", error);
          alert("Failed to delete mechanic. Please try again.");
        });
    }
  };

  if (!tailwindReady) {
    return <div>Loading styles...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6 sm:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center">
              <span className="text-emerald-500 mr-3">🔧</span>
              <h2 className="text-2xl font-bold text-gray-800">Mechanic Directory</h2>
            </div>
            <button 
              onClick={fetchMechanics} 
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all duration-200"
            >
              <span className="mr-2">🔄</span>
              Refresh
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center p-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : viewmech.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              No mechanics found. Add some mechanics to see them here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-emerald-500 text-white">
                    <th className="py-4 px-6 text-left font-semibold">Name</th>
                    <th className="py-4 px-6 text-left font-semibold">Contact</th>
                    <th className="py-4 px-6 text-left font-semibold">Experience</th>
                    <th className="py-4 px-6 text-left font-semibold">Address</th>
                    <th className="py-4 px-6 text-left font-semibold">Available Time</th>
                    <th className="py-4 px-6 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {viewmech.map((mechanic, index) => (
                    <tr 
                      key={mechanic._id || index} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">{mechanic.name}</td>
                      <td className="py-4 px-6">{mechanic.contact}</td>
                      <td className="py-4 px-6">{mechanic.experience} {mechanic.experience === "1" ? "year" : "years"}</td>
                      <td className="py-4 px-6">{mechanic.address}</td>
                      <td className="py-4 px-6">{mechanic.workingtime}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-3">
                          <Link 
                            to="/edit" 
                            state={{ id: mechanic._id }}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <span className="block text-center">✏️</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(mechanic)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <span className="block text-center">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500 text-center">
            Total Mechanics: {viewmech.length}
          </div>
        </div>

        {/* Add New Mechanic Button - if you have a route for this */}
        <div className="mt-6 flex justify-end">
          <Link 
            to="/addmechanic" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <span className="mr-2">+</span> Add New Mechanic
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ViewMech;