import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaTrash,
  FaArrowRight
} from "react-icons/fa";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch {
      console.error("Failed to load bookings");
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    try {
      await cancelBooking(confirmId);
      loadBookings();
    } catch {
      console.error("Cancel failed");
    }
    setConfirmId(null);
  };

  const filtered = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 grid gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 pt-10 mb-8">
        <h1 className="text-4xl font-bold">Trips</h1>
        <p className="text-gray-500">Your stays and experiences</p>
      </div>

      {/* FILTER */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex gap-3 overflow-x-auto">
        {["all", "confirmed", "pending", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm ${
              filter === f
                ? "bg-black text-white"
                : "bg-white border text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      <div className="max-w-6xl mx-auto px-6 space-y-6">

        {filtered.map((b, i) => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border shadow-sm hover:shadow-lg transition overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">

              {/* IMAGE */}
              <div className="md:w-80 h-56">
                <img
                  src={b.room?.images?.[0] || "/placeholder.jpg"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 p-6 flex flex-col justify-between">

                <div>

                  {/* TITLE + STATUS */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">
                      {b.room?.title}
                    </h2>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* HOTEL */}
                  <p className="text-gray-500 flex items-center gap-2 text-sm mb-4">
                    <FaMapMarkerAlt />
                    {b.hotel?.name}
                  </p>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {new Date(b.startDate).toLocaleDateString()} →{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUser />
                      {b.guests} guests
                    </div>

                    <div className="font-semibold">
                      ₹{b.totalPrice}
                    </div>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-6">

                  <Link
                    to={`/booking/details/${b._id}`}
                    className="text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View details <FaArrowRight />
                  </Link>

                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => setConfirmId(b._id)}
                      className="text-sm text-red-500 flex items-center gap-1 hover:text-red-600"
                    >
                      <FaTrash />
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        ))}

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

      {/* ✅ CONFIRM MODAL */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="font-semibold mb-2">Cancel booking?</h2>
            <p className="text-sm text-gray-500 mb-4">
              This cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                No
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}