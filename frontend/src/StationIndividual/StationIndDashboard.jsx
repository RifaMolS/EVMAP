import { useState, useEffect, act } from 'react';
import {
  LayoutDashboard,
  Plug,
  Zap,
  Users,
  Package,
  LogOut,
  Layers,
  User,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AllSlots from './AllSlots';
import StationHome from './StationHome'; 

export default function StationIndDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [tailwindReady, setTailwindReady] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' }, 
    { id: 'all-slots', icon: <Package size={20} />, label: 'All Slots' },
    { id: 'sign-out', icon: <LogOut size={20} />, label: 'Sign Out', onClick: handleLogout },
  ];

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

  const renderContent = () => {
    console.log(activeMenu)
    switch (activeMenu) {
      case 'dashboard':
        return <StationHome />;
      case 'all-slots':
        return <AllSlots />; 
      default:
        return <StationHome />;
    }
  };

  const handleMenuClick = (menuId) => {
    const menuItem = menuItems.find(item => item.id === menuId);
    if (menuItem && menuItem.onClick) {
      menuItem.onClick();
    } else {
      setActiveMenu(menuId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full z-20`}>
        {/* Logo & Sidebar Toggle */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center">
              <Layers className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-800">Station</h1>
            </div>
          )}
          {!sidebarOpen && <Layers className="mx-auto h-8 w-8 text-indigo-600" />}
          <button
            onClick={toggleSidebar}
            className={`${sidebarOpen ? 'ml-auto' : 'mx-auto mt-6'} p-1 rounded-md hover:bg-gray-100 text-gray-500 focus:outline-none`}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full py-3 px-3 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <div className={sidebarOpen ? '' : 'mx-auto'}>
                    {item.icon}
                  </div>
                  {sidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex ${!sidebarOpen ? 'flex-col' : ''} items-center space-x-3`}>
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <User size={20} />
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">Station User</p>
                <p className="text-xs text-gray-500 truncate">station@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container with just the navbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
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
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
                <HelpCircle size={20} />
              </button>
              <div className="border-l border-gray-200 h-6 mx-2"></div>
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Station</span>
                <ChevronDown size={16} className="text-gray-500 group-hover:text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}