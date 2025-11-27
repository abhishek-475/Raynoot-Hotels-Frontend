import { Link, useLocation } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaHotel, 
  FaBed, 
  FaCalendarAlt, 
  FaUsers,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

export default function AdminSidebar() {
  const location = useLocation();
  
  const menu = [
    { 
      name: "Dashboard", 
      to: "/admin/dashboard", 
      icon: FaTachometerAlt,
      description: "Overview and analytics"
    },
    { 
      name: "Manage Hotels", 
      to: "/admin/hotels", 
      icon: FaHotel,
      description: "Hotel properties"
    },
    { 
      name: "Manage Rooms", 
      to: "/admin/rooms", 
      icon: FaBed,
      description: "Room inventory"
    },
    { 
      name: "Manage Bookings", 
      to: "/admin/bookings", 
      icon: FaCalendarAlt,
      description: "Reservations"
    },
    { 
      name: "Manage Users", 
      to: "/admin/users", 
      icon: FaUsers,
      description: "User accounts"
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FaHotel className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Raynott Admin</h2>
            <p className="text-gray-400 text-sm">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center space-x-4 p-3 rounded-xl font-medium transition-all duration-200 ${
                isActive(item.to)
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive(item.to) 
                  ? "bg-blue-500" 
                  : "bg-gray-700 group-hover:bg-blue-500"
              }`}>
                <IconComponent className={`text-lg ${
                  isActive(item.to) ? "text-white" : "text-gray-400 group-hover:text-white"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className={`text-xs transition-all duration-200 ${
                  isActive(item.to) 
                    ? "text-blue-100" 
                    : "text-gray-500 group-hover:text-gray-300"
                }`}>
                  {item.description}
                </div>
              </div>
              {isActive(item.to) && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        
        {/* Logout */}
        <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 group">
          <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-red-500 transition-colors">
            <FaSignOutAlt className="text-lg text-gray-400 group-hover:text-white" />
          </div>
          <span className="font-medium text-sm">Logout</span>
        </button>

        {/* User Info */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">Admin User</div>
              <div className="text-gray-400 text-xs truncate">admin@raynott.com</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}