import { useEffect, useState, useContext } from "react";
import { getAllBookings } from "../../services/bookingService";
import { getAllUsers } from "../../services/authService";
import { getAllHotels } from "../../services/hotelService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FaChartLine, 
  FaUsers, 
  FaHotel, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaLock
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
    // Only fetch admin data if user is admin
    if (!user || user.role !== "admin") {
      console.log("User is not admin, skipping admin data fetch");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching admin dashboard data...");
      
      // Use Promise.all to fetch data in parallel
      const [bookings, users, hotels] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllHotels()
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
      
      toast.success("Dashboard data loaded successfully");
    } catch (err) {
      console.error("Dashboard error:", err);
      
      if (err.response?.status === 401) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      } else {
        toast.error("Failed to fetch dashboard stats");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const cards = [
    { 
      label: "Total Bookings", 
      value: stats.totalBookings, 
      icon: FaCalendarAlt,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      icon: FaUsers,
      color: "green",
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    { 
      label: "Total Hotels", 
      value: stats.totalHotels, 
      icon: FaHotel,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    { 
      label: "Total Revenue", 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: FaMoneyBillWave,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600"
    },
  ];

  // Show access denied if not admin
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <FaLock className="text-red-600 text-4xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Administrator privileges are required to access the dashboard.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <FaUsers className="text-gray-400" />
              <span>Current Role: </span>
              <span className="font-semibold text-gray-700 capitalize">{user.role}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <FaChartLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of your hotel management system
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <FaSpinner className="text-6xl text-blue-600 animate-spin mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 rounded-full blur-sm"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4">Loading dashboard data...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {cards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 relative overflow-hidden group"
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                          {card.label}
                        </p>
                        <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                          {card.value}
                        </p>
                      </div>
                      <div className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl text-white`}>
                        <IconComponent className="text-xl" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div 
                        className={`bg-gradient-to-r ${card.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${Math.min((stats[Object.keys(stats)[index]] / Math.max(stats.totalBookings, stats.totalUsers, stats.totalHotels, stats.totalRevenue / 1000)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaChartLine className="text-blue-600" />
                <span>Quick Insights</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Average Booking Value</span>
                  <span className="font-semibold text-green-600">
                    ₹{stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Users per Hotel</span>
                  <span className="font-semibold text-purple-600">
                    {stats.totalHotels > 0 ? (stats.totalUsers / stats.totalHotels).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Bookings per Hotel</span>
                  <span className="font-semibold text-blue-600">
                    {stats.totalHotels > 0 ? (stats.totalBookings / stats.totalHotels).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaExclamationTriangle className="text-yellow-600" />
                <span>System Status</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium">All Systems Operational</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p> Database connection stable</p>
                  <p> API endpoints responsive</p>
                  <p> Authentication system active</p>
                  <p> Real-time updates enabled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}