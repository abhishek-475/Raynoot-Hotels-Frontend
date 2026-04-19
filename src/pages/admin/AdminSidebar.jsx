import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { 
  FaTachometerAlt, 
  FaHotel, 
  FaBed, 
  FaCalendarAlt, 
  FaUsers,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";

export default function AdminSidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const menu = [
    { name: "Dashboard", to: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Hotels", to: "/admin/hotels", icon: FaHotel },
    { name: "Rooms", to: "/admin/rooms", icon: FaBed },
    { name: "Bookings", to: "/admin/bookings", icon: FaCalendarAlt },
    { name: "Users", to: "/admin/users", icon: FaUsers },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <aside className="w-72 h-screen bg-white/90 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-lg overflow-y-auto">
      
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>

      {/* LOGO SECTION */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-orange-400 p-3 rounded-xl shadow-md">
            <FaHotel className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Raynott
            </h2>
            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose} // Close sidebar on mobile after clicking
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-500/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-white/20"
                    : "bg-gray-100 group-hover:bg-white shadow-sm"
                }`}
              >
                <Icon
                  className={`text-base ${
                    active ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                  }`}
                />
              </div>

              {/* Menu Text */}
              <span className="text-sm font-semibold tracking-tight">
                {item.name}
              </span>

              {/* Active Indicator Dot */}
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="p-4 space-y-3 border-t border-gray-200 bg-gray-50/50">
        
        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@raynott.com"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-gray-600 bg-white border border-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:border-transparent transition-all duration-300 group shadow-sm hover:shadow-md"
        >
          <FaSignOutAlt className="text-sm group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-semibold">Logout</span>
        </button>

      </div>
    </aside>
  );
}