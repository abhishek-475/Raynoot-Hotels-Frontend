import { useEffect, useState } from "react";
import {
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
} from "../../services/bookingService";
import toast from "react-hot-toast";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      toast.success("Bookings loaded successfully");
    } catch (err) {
      console.error("Bookings error:", err);
      toast.error("Failed to load bookings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status} booking`);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mobile card view for small screens
  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-lg shadow border p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 truncate">
            {booking.user?.name || "N/A"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            ID: {booking._id.substring(18)}
          </p>
        </div>
        <select
          value={booking.status}
          onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(booking.status)} outline-none`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Hotel:</span>
          <span className="font-medium truncate ml-2">{booking.hotel?.name || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Room:</span>
          <span className="font-medium truncate ml-2">{booking.room?.title || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Dates:</span>
          <span className="font-medium text-right">
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nights:</span>
          <span className="font-medium">{calculateNights(booking.startDate, booking.endDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests:</span>
          <span className="font-medium">{booking.guests}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-green-600">₹{booking.totalPrice}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t">
        <button
          onClick={() => handleViewDetails(booking)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          View
        </button>
        {booking.status !== "cancelled" && (
          <button
            onClick={() => handleCancel(booking._id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all hotel bookings
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Total: {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Bookings
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by user, hotel, room, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{bookings.length}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Total</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Pending</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Confirmed</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {bookings.filter(b => b.status === 'cancelled').length}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">Cancelled</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading bookings...</p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "All bookings will appear here"}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="block lg:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl border">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 font-semibold text-gray-700 border-b">Booking ID</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">User</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Hotel & Room</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Dates & Nights</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Guests</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Total</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Status</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="text-xs font-mono text-gray-500">
                        {booking._id.substring(18)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{booking.user?.name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{booking.user?.email || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{booking.hotel?.name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{booking.room?.title || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {calculateNights(booking.startDate, booking.endDate)} nights
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-green-600">₹{booking.totalPrice}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(booking.status)} outline-none transition-colors`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          title="View Details"
                        >
                          View
                        </button>
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Booking Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Booking Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Booking Information</h3>
                    <p className="text-sm text-gray-600">ID: {selectedBooking._id}</p>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(selectedBooking.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                {/* User Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">User Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedBooking.user?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedBooking.user?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Booking Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Hotel</p>
                      <p className="font-medium">{selectedBooking.hotel?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Room</p>
                      <p className="font-medium">{selectedBooking.room?.title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price per night</p>
                      <p className="font-medium">₹{selectedBooking.room?.price || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Stay Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Stay Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium">{formatDate(selectedBooking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium">{formatDate(selectedBooking.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{calculateNights(selectedBooking.startDate, selectedBooking.endDate)} nights</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-medium">{selectedBooking.guests}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Payment Information</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{selectedBooking.totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Close
                </button>
                {selectedBooking.status !== "cancelled" && (
                  <button
                    onClick={() => {
                      handleCancel(selectedBooking._id);
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors order-1 sm:order-2"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}