import React, { useState, useEffect, useRef } from "react";
import Mechanic from "./Mechanic";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  Download,
  User,
  BookOpen,
  Home,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  ThumbsUp,
  ThumbsDown,
  Users,
  MapPin,
  Plug,
  PlugZap,
  Wrench,
  Star,
  Activity,
  LogOut,
  Calendar,
  Cog,
  Menu,
  X,
} from "lucide-react";
import ViewMech from "./ViewMech";
import UserView from "./UserView";
import StationregView from "./StationregView";
// import ViewSlot from '../Homepage/ViewSlot';
import AllSlots from "../Station/AllSlots";
import Logout from "../Homepage/Logout";
import Slot from "./Slot";
import ComplaintViewReply from "./ComplaintViewReply"
import ViewPayment from "./ViewPayment";

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tailwindReady, setTailwindReady] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const bellRef = useRef(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    // On mobile, close sidebar when item is clicked
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector(
      'script[src="https://cdn.tailwindcss.com"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Handle responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Set initial state based on window size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      const script = document.querySelector(
        'script[src="https://cdn.tailwindcss.com"]'
      );
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/ev/getNotifications")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        const notificationsFromAPI = result.notifications;

        const newNotificationsArr = notificationsFromAPI.filter((el) => {
          return el.admin_seen === 0;
        });

        setNewNotifications(newNotificationsArr);
        const formatTime = (isoString) => {
          const date = new Date(isoString);
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        const notificationsTimeFormatted = notificationsFromAPI.map((n) => ({
          ...n,
          time: formatTime(n.created_at),
        }));
        setNotifications(notificationsTimeFormatted);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the data.");
      });
  }, [refresh]);

  useEffect(() => {
    fetch("http://localhost:4000/ev/getdashboarddetails")
      .then((res) => res.json())
      .then((result) => {
        const originalData = result.dashboardDetails;

        // Send to Flask for predictions
        fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(originalData),
        })
          .then((res) => res.json())
          .then((predictedData) => {
            const predicted = predictedData.map((item) => ({
              ...item,
              predicted: true,
            }));
            const original = originalData.totalIncomeLast7Days.map((item) => ({
              ...item,
              predicted: false,
            }));

            const merged = [...original, ...predicted];
            setDashboardData({
              totalIncomeLast7Days: merged,
              totalIncome: originalData.totalIncome,           // <-- add this line
              customersCount: originalData.customersCount      // <-- add this if needed
            });
          })
          .catch((error) => {
            console.error("Prediction API error:", error);
          });
      })
      .catch((error) => {
        console.error("Dashboard fetch error:", error);
        alert("An error occurred while submitting the data.");
      });
  }, []);
  

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const renderContent = () => {
    switch (selectedItem) {
      case "View User":
        return (
          <div className="p-4">
            List of registered users
            <UserView />
          </div>
        );
      case "View Slot":
        return (
          <div className="p-4">
            List of Booked Slots <Slot />
          </div>
        );
      case "View Station":
        return (
          <div className="p-4">
            List of registered users
            <StationregView />
          </div>
        );
      case "Add Mechanic":
        return (
          <div className="p-4">
            Form Section <Mechanic />
          </div>
        );
      case "View Mechanic":
        return <ViewMech />;

      case "View Complaint":
        return <ComplaintViewReply />;
      case "View Payment":
        return <ViewPayment />;  
      case "Logout":
        return (
          <div className="p-4">
            Successfully Logged out
            <Logout />
          </div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 p-2 sm:p-4 md:grid-cols-2 lg:grid-cols-2"
          >
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-indigo-200 hover:scale-105 transition-transform p-4 sm:p-6 flex items-center space-x-4">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  New Customers
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  {dashboardData.customersCount}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-green-200 hover:scale-105 transition-transform p-4 sm:p-6 flex items-center space-x-4">
              <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Income</p>
                <p className="text-lg sm:text-xl font-bold">
                  {dashboardData?.totalIncome} ₹{" "}
                </p>
              </div>
            </div>

            {/* Chart Card */}
            <div className="col-span-full bg-white rounded-lg shadow-xl border-2 border-blue-200 mt-4 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Revenue Over Time
              </h3>
              <div className="h-40 sm:h-64 md:h-72 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.totalIncomeLast7Days}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                      data={dashboardData.totalIncomeLast7Days}
                      dot={(props) => {
                        const isPredicted =
                          dashboardData.totalIncomeLast7Days[props.index]
                            ?.predicted;
                        return (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={4}
                            stroke={isPredicted ? "#f59e0b" : "#6366f1"}
                            strokeWidth={2}
                            fill="#fff"
                          />
                        );
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  // Navigation items
  const navItems = [
    { icon: Home, name: "Home" },
    { icon: Users, name: "View User" },
    { icon: Calendar, name: "View Slot" },
    { icon: MapPin, name: "View Station" },
    { icon: Wrench, name: "Add Mechanic" },
    { icon: Cog, name: "View Mechanic" },
      { icon: LogIn, name: "View Complaint" },
    { icon: BookOpen, name: "View Payment" },
  ];

  const authItems = [{ icon: LogOut, name: "Logout" }];

  // Sidebar component (extracted for reuse)
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
        <button
          className="lg:hidden p-1 rounded-md hover:bg-green-500"
          onClick={toggleSidebar}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ icon: Icon, name }) => (
          <button
            key={name}
            onClick={() => handleItemClick(name)}
            className={`flex items-center w-full px-3 sm:px-4 py-2 rounded-lg text-left hover:bg-green-500 transition-colors ${
              selectedItem === name ? "bg-green-500" : ""
            }`}
          >
            <Icon className="w-5 h-5 mr-2 sm:mr-3" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {name}
            </span>
          </button>
        ))}
      </nav>

      <div className="pt-4 sm:pt-6 mt-4 border-t border-green-300">
        <h3 className="text-xs sm:text-sm text-green-100 mb-2">Auth</h3>
        {authItems.map(({ icon: Icon, name }) => (
          <button
            key={name}
            onClick={() => handleItemClick(name)}
            className={`flex items-center w-full px-3 sm:px-4 py-2 rounded-lg text-left hover:bg-green-500 transition-colors ${
              selectedItem === name ? "bg-green-500" : ""
            }`}
          >
            <Icon className="w-5 h-5 mr-2 sm:mr-3" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {name}
            </span>
          </button>
        ))}
      </div>
    </>
  );

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    fetch("http://localhost:4000/ev/updateNoficationStatus", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ admin_seen: 1 }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setRefresh((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the data.");
      });
  };

  return (
    <div
      className={`flex flex-col lg:flex-row h-screen transition-colors duration-300 ease-in-out ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#36C96C] text-white">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-3">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">{selectedItem}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full hover:bg-green-500"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="rounded-full w-8 h-8 border-2 border-green-300"
          />
        </div>
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        >
          <div
            className="w-64 h-full bg-[#36C96C] text-white p-4 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div
        className={`hidden lg:block w-64 bg-[#36C96C] text-white p-4 space-y-4 shadow-xl flex-shrink-0`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
          <h1 className="text-xl sm:text-2xl font-bold text-green-600">
            {selectedItem}
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
              ) : (
                <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </button>
            <div className="relative" ref={bellRef}>
              <button onClick={() => handleNotifications()}>
                <Bell className="w-5 sm:w-6 h-5 sm:h-6 " />
                {newNotifications.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <div className="p-4 text-sm text-gray-800 dark:text-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div key={note.id} className="mb-3 last:mb-0">
                          <p className="font-medium text-black">{note.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {note.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No new notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}