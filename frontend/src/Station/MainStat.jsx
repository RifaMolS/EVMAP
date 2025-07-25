import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Plug, Zap, Package,
  MessageSquareWarning, CreditCard, LogOut,
  Layers, User, Bell, Search, ChevronDown,
  Menu, X, HelpCircle
} from 'lucide-react';
import {
  Link
} from 'react-router-dom';
import AllSlots from './AllSlots';
import StationHome from './StationHome';
import StationReg from './StationReg';
import StationView from './StationView';
import ComplaintViewReply from './ComplaintViewReply';
import PaymentView from './PaymentView';

export default function AdminSidebarNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [tailwindReady, setTailwindReady] = useState(false);
  const [auth, setAuth] = useState({ name: '', email: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('yourstorage'));
    if (user?.userid) {
      fetch("http://localhost:4000/ev/getstationownerbyid", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: user.userid })
      })

        .then(res => res.json())
        .then(data => {
          setAuth({ name: data.name, email: data.email });
        })
        .catch(err => console.log("Error fetching owner info:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'addstation', icon: <Plug size={20} />, label: 'Station' },
    { id: 'viewstation', icon: <Zap size={20} />, label: 'Station View' },
    { id: 'all-slots', icon: <Package size={20} />, label: 'All Slots' },
    { id: 'ViewComplaints', icon: <MessageSquareWarning size={20} />, label: 'View Complaints' },
    { id: 'viewpayment', icon: <CreditCard size={20} />, label: 'View Payment' },
    { id: 'sign-out', icon: <LogOut size={20} />, label: 'Sign Out', onClick: handleLogout },
  ];

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

  if (!tailwindReady) return <div>Loading form styles...</div>;

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <StationHome />;
      case 'addstation': return <StationReg />;
      case 'viewstation': return <StationView />;
      case 'all-slots': return <AllSlots />;
      case 'ViewComplaints': return <ComplaintViewReply />;
      case 'viewpayment': return <PaymentView />;
      default: return <StationHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full z-20`}>
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center">
              <Layers className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-800">Station</h1>
            </div>
          ) : (
            <Layers className="mx-auto h-8 w-8 text-indigo-600" />
          )}
          <button
            onClick={toggleSidebar}
            className={`${sidebarOpen ? 'ml-auto' : 'mx-auto mt-6'} p-1 rounded-md hover:bg-gray-100 text-gray-500 focus:outline-none`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full py-3 px-3 rounded-lg transition-colors ${activeMenu === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    else setActiveMenu(item.id);
                  }}
                >
                  <div className={sidebarOpen ? '' : 'mx-auto'}>{item.icon}</div>
                  {sidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex ${!sidebarOpen ? 'flex-col' : ''} items-center space-x-3`}>
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <User size={20} />
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{auth.name || "Station User"}</p>
                <p className="text-xs text-gray-500 truncate">{auth.email || "station@example.com"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center z-10">
          <div className="flex justify-between items-center w-full px-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{auth.name || 'Station'}</span>
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-800">{auth.name}</p>
                    <p className="text-xs text-gray-500">{auth.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-100 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

