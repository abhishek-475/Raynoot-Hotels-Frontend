import { useEffect, useState } from "react";
import {
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
} from "../../services/bookingService";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmBookingId, setConfirmBookingId] = useState(null);

  // ✅ Premium notification state
  const [notification, setNotification] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      setNotification({ type: "success", message: "Bookings loaded successfully" });
    } catch {
      setNotification({ type: "error", message: "Failed to load bookings" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // ✅ Cancel booking
  const confirmCancelBooking = async () => {
    try {
      await cancelBooking(confirmBookingId);
      setNotification({ type: "success", message: "Booking cancelled successfully" });
      fetchBookings();
    } catch {
      setNotification({ type: "error", message: "Cancellation failed" });
    }
    setConfirmBookingId(null);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setNotification({ type: "success", message: `Booking ${status}` });
      fetchBookings();
    } catch {
      setNotification({ type: "error", message: "Update failed" });
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">

      {/* 🔔 Premium Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 text-sm font-medium transition-all
            ${
              notification.type === "success"
                ? "bg-black text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span>{notification.type === "success" ? "✓" : "⚠"}</span>
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
        <p className="text-gray-500">{filteredBookings.length} bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search bookings..."
          className="flex-1 border px-4 py-2 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Hotel</th>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="p-4">{booking.user?.name}</td>
                  <td className="p-4">{booking.hotel?.name}</td>
                  <td className="p-4">{booking.room?.title}</td>
                  <td className="p-4 font-bold text-green-600">
                    ₹{booking.totalPrice}
                  </td>

                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusUpdate(booking._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => setConfirmBookingId(booking._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ❗ Cancel Confirmation Modal */}
      {confirmBookingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Cancel Booking?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmBookingId(null)}
                className="px-4 py-2 rounded-full border hover:bg-gray-100"
              >
                No
              </button>

              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 rounded-full bg-black text-white"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📄 Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>User:</strong> {selectedBooking.user?.name}</p>
              <p><strong>Hotel:</strong> {selectedBooking.hotel?.name}</p>
              <p><strong>Room:</strong> {selectedBooking.room?.title}</p>
              <p><strong>Total:</strong> ₹{selectedBooking.totalPrice}</p>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="mt-5 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}