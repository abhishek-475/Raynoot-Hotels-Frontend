import { useEffect, useState, useContext } from "react";
import { getAllBookings } from "../../services/bookingService";
import { getAllUsers } from "../../services/authService";
import { getAllHotels } from "../../services/hotelService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaHotel,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalHotels: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchStats = async () => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

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
      if (err.response?.status === 401) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      } else {
        toast.error("Failed to load dashboard stats");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: FaCalendarAlt,
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
    },
    {
      label: "Hotels Listed",
      value: stats.totalHotels,
      icon: FaHotel,
    },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
    },
  ];

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-gray-700 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {card.label}
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                          {card.value}
                        </h2>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Icon className="text-gray-700 text-lg" />
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">Updated just now</p>
                  </div>
                );
              })}
            </div>

            {/* INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Quick Insights */}
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Insights
                </h3>

                <div className="space-y-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Booking Value</span>
                    <span className="font-semibold text-gray-900">
                      ₹{stats.totalBookings > 0
                        ? Math.round(stats.totalRevenue / stats.totalBookings)
                        : 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Users per Hotel</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalHotels > 0
                        ? (stats.totalUsers / stats.totalHotels).toFixed(1)
                        : 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Bookings per Hotel</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalHotels > 0
                        ? (stats.totalBookings / stats.totalHotels).toFixed(1)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  System Status
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 font-medium">
                    All systems operational
                  </span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <p>Database connected</p>
                  <p>API running normally</p>
                  <p>Authentication active</p>
                  <p>Real-time sync enabled</p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-10 text-center text-sm text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}