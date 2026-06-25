import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import API from "../services/api";

export default function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">

        <Link
          to="/bookings/my"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <FaArrowLeft />
          Back to My Bookings
        </Link>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <img
            src={
              booking.room?.images?.[0] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945"
            }
            alt={booking.room?.title}
            className="w-full h-80 object-cover"
          />

          <div className="p-8">

            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {booking.room?.title}
                </h1>

                <p className="flex items-center gap-2 text-gray-500 mt-2">
                  <FaMapMarkerAlt />
                  {booking.hotel?.name}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Stay Details</h3>

                <div className="space-y-3 text-gray-600">

                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    Check-in:
                    {new Date(booking.startDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    Check-out:
                    {new Date(booking.endDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUser />
                    {booking.guests} Guest(s)
                  </div>

                </div>
              </div>

              <div className="border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Payment Summary</h3>

                <div className="space-y-3 text-gray-600">

                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span>{booking._id.slice(-8)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-bold text-lg">
                      ₹{booking.totalPrice}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="capitalize">
                      {booking.status}
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}