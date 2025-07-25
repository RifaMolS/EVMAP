import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProfileCard() {
  const [view, setView] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.userid) return;
    
    let ids = {
      id: auth.userid
    };
    
    setIsLoading(true);
    fetch('http://localhost:4000/ev/viewprofile', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(ids),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log("Response:", result);
      setView(result);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log("Error:", err);
      setIsLoading(false);
    });
  }, [auth]);

  const handleBackClick = () => {
    navigate('/');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getAvatarStyles = (name) => {
    if (!name) return { bg: 'bg-gradient-to-br from-gray-400 to-gray-500', text: 'text-white' };
    
    const colorOptions = [
      { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-amber-500 to-amber-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-rose-500 to-rose-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', text: 'text-white' },
      { bg: 'bg-gradient-to-br from-teal-500 to-teal-600', text: 'text-white' }
    ];
    
    const charCode = name.charCodeAt(0);
    const colorIndex = charCode % colorOptions.length;
    return colorOptions[colorIndex];
  };

  const [tailwindReady, setTailwindReady] = useState(false);

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

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const ProfileSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl animate-pulse border border-gray-100">
      <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-3xl"></div>
      <div className="p-8">
        <div className="flex items-center mt-[-60px]">
          <div className="w-28 h-28 rounded-full bg-gray-300 mr-6 border-4 border-white shadow-lg"></div>
          <div className="flex-1">
            <div className="h-7 bg-gray-300 rounded-lg mb-3 w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="h-5 bg-gray-200 rounded-lg"></div>
          <div className="h-5 bg-gray-200 rounded-lg"></div>
          <div className="h-5 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="h-12 w-24 bg-gray-200 rounded-xl animate-pulse mb-8"></div>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!view || view.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBackClick}
            className="group flex items-center text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl px-4 py-3 mb-8 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No Profile Found</h3>
            <p className="text-slate-600 mb-8 text-lg">Create your profile to get started</p>
            <Link to="/profileedit">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Create Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {view.map((item, index) => {
          const name = item.userid?.name || '';
          const initial = getInitial(name);
          const { bg, text } = getAvatarStyles(name);
          
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100">
              {/* Enhanced Banner with Back Button */}
              <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-4 left-4">
                    <button
                      onClick={handleBackClick}
                      className="group flex items-center text-white/90 hover:text-white font-medium transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl px-4 py-2 shadow-sm hover:shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-12"></div>
              </div>
                   
              {/* Enhanced Profile section */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start">
                  <div className={`${bg} w-28 h-28 rounded-full flex items-center justify-center ${text} text-4xl font-bold mt-[-60px] border-4 border-white shadow-xl relative`}>
                    {initial}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0 lg:ml-8 text-center lg:text-left flex-1">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{name}</h2>
                    <p className="text-blue-600 text-lg font-medium mb-4">{item.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Active</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Verified</span>
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <Link to="/profileedit" state={{id: item.userid._id || 'default-id'}}>
                      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Profile
                      </button>
                    </Link>
                  </div>
                </div>
                
                {/* Enhanced Tabs */}
                <div className="mt-10">
                  <div className="flex bg-gray-100/80 rounded-2xl p-1">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`flex-1 py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-300 ${
                        activeTab === 'info'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className={`flex-1 py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-300 ${
                        activeTab === 'contact'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Contact Details
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Tab Content */}
                <div className="mt-8">
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      <div className="group flex items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Full Name</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.userid?.name || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="group flex items-center p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 border border-emerald-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Email</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="group flex items-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Phone</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.userid?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'contact' && (
                    <div className="space-y-6">
                      <div className="group flex items-center p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Address</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.userid?.address || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="group flex items-center p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl hover:from-rose-100 hover:to-pink-100 transition-all duration-300 border border-rose-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Phone</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.userid?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="group flex items-center p-5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 border border-cyan-100">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Email</p>
                          <p className="text-slate-800 font-semibold text-lg">{item.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileCard;