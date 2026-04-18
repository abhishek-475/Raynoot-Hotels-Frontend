import { Link, useLocation } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaHotel, 
  FaBed, 
  FaCalendarAlt, 
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";

export default function AdminSidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", to: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Hotels", to: "/admin/hotels", icon: FaHotel },
    { name: "Rooms", to: "/admin/rooms", icon: FaBed },
    { name: "Bookings", to: "/admin/bookings", icon: FaCalendarAlt },
    { name: "Users", to: "/admin/users", icon: FaUsers },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col justify-between shadow-sm">
      
      {/* LOGO */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-orange-400 p-2.5 rounded-xl shadow-md">
            <FaHotel className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Raynott
            </h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all ${
                  active
                    ? "bg-white/20"
                    : "bg-gray-100 group-hover:bg-white shadow-sm"
                }`}
              >
                <Icon
                  className={`text-sm ${
                    active ? "text-white" : "text-gray-500"
                  }`}
                />
              </div>

              <span className="text-sm font-medium tracking-tight">
                {item.name}
              </span>

              {/* Active indicator */}
              {active && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 space-y-4">
        
        {/* USER CARD */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-400">admin@raynott.com</p>
          </div>
        </div>

        {/* LOGOUT */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 transition-all duration-300 group">
          <FaSignOutAlt className="text-sm" />
          <span className="text-sm font-medium">Logout</span>
        </button>

      </div>
    </aside>
  );
}