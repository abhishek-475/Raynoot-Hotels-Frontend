import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaMapMarkerAlt,
  FaBed,
  FaTrash,
  FaExclamationTriangle,
  FaHotel,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaFilter
} from "react-icons/fa";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadBookings = async () => {
      console.log('🔐 MyBookings - Authentication check started');
      
      const token = localStorage.getItem('token');
      console.log('🔐 Token available:', token ? 'YES' : 'NO');
      console.log('🔐 User context:', user);
      console.log('🔐 isAuthenticated:', isAuthenticated);

      if (!token || !user) {
        console.warn('❌ Authentication missing, redirecting to login');
        toast.error("Please login to view your bookings");
        navigate("/login", { 
          state: { 
            from: "/bookings/my",
            message: "Please login to view your bookings"
          } 
        });
        return;
      }

      await loadBookings();
    };

    checkAuthAndLoadBookings();
  }, [user, isAuthenticated, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading bookings...');
      
      const bookingsData = await getUserBookings();
      console.log('✅ Bookings loaded:', bookingsData.length, 'bookings');
      
      // Sort bookings by check-in date (newest first)
      const sortedBookings = bookingsData.sort((a, b) => 
        new Date(b.startDate) - new Date(a.startDate)
      );
      
      setBookings(sortedBookings);
    } catch (error) {
      console.error('❌ Failed to load bookings:', error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        navigate("/login");
      } else {
        toast.error("Failed to load your bookings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      console.log('🗑️ Cancelling booking:', bookingId);
      
      await cancelBooking(bookingId);
      
      toast.success(
        <div className="flex items-center space-x-2">
          <FaCheckCircle className="text-green-500" />
          <span>Booking cancelled successfully</span>
        </div>
      );
      
      // Refresh the bookings list
      await loadBookings();
    } catch (error) {
      console.error('❌ Failed to cancel booking:', error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        navigate("/login");
      } else {
        const errorMessage = error.response?.data?.message || "Failed to cancel booking. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const isUpcomingBooking = (booking) => {
    return new Date(booking.startDate) > new Date() && booking.status !== 'cancelled';
  };

  const isPastBooking = (booking) => {
    return new Date(booking.endDate) < new Date() && booking.status !== 'cancelled';
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filter === "upcoming" && !isUpcomingBooking(booking)) return false;
    if (filter === "past" && !isPastBooking(booking)) return false;
    if (filter === "cancelled" && booking.status !== "cancelled") return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        booking.hotel?.name?.toLowerCase().includes(term) ||
        booking.room?.title?.toLowerCase().includes(term) ||
        booking.hotel?.location?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(isUpcomingBooking).length,
    past: bookings.filter(isPastBooking).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Bookings</h3>
          <p className="text-gray-600">Please wait while we fetch your reservation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            {user && (
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage your hotel reservations, view upcoming stays, and access booking details
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">{stats.past}</div>
            <div className="text-sm text-gray-600">Past Stays</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === "all" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === "upcoming" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === "past" 
                    ? "bg-gray-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Past Stays
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === "cancelled" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelled
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotels or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaHotel className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {searchTerm || filter !== "all" ? "No Matching Bookings" : "No Bookings Yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || filter !== "all" 
                ? "No bookings match your current filters. Try adjusting your search or filters."
                : "You haven't made any bookings yet. Start exploring our luxury hotels and plan your next stay."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/hotels"
                className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <FaEye />
                <span>Explore Hotels</span>
              </Link>
              {(searchTerm || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Hotel Image */}
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={booking.room?.images?.[0] || "/api/placeholder/400/250"}
                        alt={booking.room?.title}
                        className="w-full h-48 lg:h-56 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        {booking.room?.type || "Deluxe Room"}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                          {booking.room?.title || "Deluxe Room"}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-3">
                          <FaHotel className="text-blue-500 flex-shrink-0" />
                          <span className="font-semibold truncate">{booking.hotel?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
                          <span className="truncate">{booking.hotel?.location || "City Center"}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                        {getStatusIcon(booking.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Booking Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <FaCalendarAlt className="text-blue-500 text-lg flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Check-in</div>
                          <div className="font-semibold text-gray-800">{formatDate(booking.startDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <FaCalendarAlt className="text-green-500 text-lg flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Check-out</div>
                          <div className="font-semibold text-gray-800">{formatDate(booking.endDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <FaUser className="text-purple-500 text-lg flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Guests</div>
                          <div className="font-semibold text-gray-800">{booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                        <FaDollarSign className="text-orange-500 text-lg flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Total Amount</div>
                          <div className="font-bold text-green-600">₹{booking.totalPrice}</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Duration: </span>
                        {calculateNights(booking.startDate, booking.endDate)} nights
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Booking Date: </span>
                        {formatDateTime(booking.createdAt)}
                      </div>
                    </div>

                    {/* Room Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                        <FaBed className="text-blue-500" />
                        <span>{booking.room?.bedType || "King Bed"}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                        <FaUser className="text-green-500" />
                        <span>Capacity: {booking.room?.capacity || 2}</span>
                      </div>
                      {booking.room?.rating && (
                        <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full text-xs text-yellow-700">
                          <FaStar className="text-yellow-500" />
                          <span>{booking.room.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">Booking ID: </span>
                        {booking._id}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {booking.status !== 'cancelled' && isUpcomingBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex items-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === booking._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                            <span>Cancel Booking</span>
                          </button>
                        )}
                        
                        <Link
                          to={`/booking/details/${booking._id}`}
                          className="flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                        >
                          <FaEye />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Your Booking?</h4>
            <p className="text-gray-600 mb-6 text-lg">
              Our dedicated customer support team is available 24/7 to assist you with any questions or concerns about your reservations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <FaPhone className="text-blue-600 text-xl" />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Call Us</div>
                  <div className="text-gray-600">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                <FaEnvelope className="text-green-600 text-xl" />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Email Us</div>
                  <div className="text-gray-600">support@raynotthotels.com</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
              >
                <FaPhone />
                <span>Contact Support</span>
              </Link>
              <Link
                to="/hotels"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
              >
                <FaHotel />
                <span>Book Another Stay</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}