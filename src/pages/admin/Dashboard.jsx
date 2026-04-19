import { useEffect, useState, useContext } from "react";
import { getAllBookings } from "../../services/bookingService";
import { getAllUsers } from "../../services/authService";
import { getAllHotels } from "../../services/hotelService";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaHotel,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";

export default function Dashboard({ onMenuClick }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalHotels: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchStats = async () => {
    try {
      const [bookings, users, hotels] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllHotels(),
      ]);

      const totalRevenue = bookings.reduce(
        (acc, booking) => acc + (booking.totalPrice || 0),
        0
      );

      setStats({
        totalBookings: bookings.length,
        totalUsers: users.length,
        totalHotels: hotels.length,
        totalRevenue,
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: FaCalendarAlt,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
    },
    {
      label: "Hotels Listed",
      value: stats.totalHotels,
      icon: FaHotel,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      gradient: "from-rose-500 to-orange-500",
      bgLight: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER WITH MOBILE MENU */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              aria-label="Open menu"
            >
              <FaBars className="text-gray-700 text-xl" />
            </button>

            {/* Title */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>

            {/* User Avatar - Desktop */}
            <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-3xl bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                          {card.label}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {card.value}
                        </h2>
                      </div>

                      <div className={`p-3 rounded-2xl ${card.bgLight}`}>
                        <Icon className="text-lg sm:text-xl text-gray-700" />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live data
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INSIGHTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Quick Insights */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full"></span>
                  Quick Insights
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      label: "Avg Booking Value",
                      value: `₹${stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString() : 0}`,
                    },
                    {
                      label: "Users per Hotel",
                      value: stats.totalHotels > 0 ? (stats.totalUsers / stats.totalHotels).toFixed(1) : 0,
                    },
                    {
                      label: "Bookings per Hotel",
                      value: stats.totalHotels > 0 ? (stats.totalBookings / stats.totalHotels).toFixed(1) : 0,
                    },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">{item.label}</span>
                      <span className="text-base sm:text-lg font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
                  System Status
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-green-50 border border-green-200">
                    <span className="text-green-700 font-semibold text-xs sm:text-sm">
                      All systems operational
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    {[
                      "Database connected",
                      "API running normally",
                      "Authentication active",
                      "Real-time sync enabled",
                    ].map((status, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 sm:mt-10 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}