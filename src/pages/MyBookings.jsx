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

  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getUserBookings();
    setBookings(data);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel booking?")) return;
    await cancelBooking(id);
    loadBookings();
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  // ✨ Skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 grid gap-6">
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Trips
        </h1>
        <p className="text-gray-500">
          Manage your upcoming and past stays
        </p>
      </div>

      {/* FILTER PILLS */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex gap-3 overflow-x-auto">
        {["all", "confirmed", "pending", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden border"
          >
            <div className="flex flex-col md:flex-row">

              {/* IMAGE */}
              <div className="md:w-80 h-56 md:h-auto overflow-hidden">
                <img
                  src={b.room?.images?.[0]}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  alt=""
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 p-6 flex flex-col justify-between">

                <div>
                  {/* TITLE */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {b.room?.title}
                  </h2>

                  {/* LOCATION */}
                  <p className="text-gray-500 flex items-center gap-2 text-sm mb-4">
                    <FaMapMarkerAlt />
                    {b.hotel?.name}
                  </p>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {new Date(b.startDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUser />
                      {b.guests} guests
                    </div>

                    <div className="font-semibold text-black">
                      ₹{b.totalPrice}
                    </div>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-6">

                  <Link
                    to={`/booking/details/${b._id}`}
                    className="text-sm font-medium text-black hover:underline flex items-center gap-1"
                  >
                    View details <FaArrowRight className="text-xs" />
                  </Link>

                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
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

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No bookings found.
          </div>
        )}

      </div>
    </div>
  );
}