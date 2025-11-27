import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, checkRoomAvailability } from "../services/roomService";
import { getHotelById } from "../services/hotelService";
import { createBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaBed,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaShower,
  FaUtensils,
  FaCar,
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCreditCard,
  FaShieldAlt,
  FaExclamationTriangle
} from "react-icons/fa";

export default function Booking() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);

  const amenities = [
    { icon: FaWifi, label: "Free WiFi", available: room?.amenities?.includes('wifi') },
    { icon: FaTv, label: "Smart TV", available: room?.amenities?.includes('tv') },
    { icon: FaSnowflake, label: "Air Conditioning", available: room?.amenities?.includes('ac') },
    { icon: FaShower, label: "Hot Shower", available: room?.amenities?.includes('shower') },
    { icon: FaUtensils, label: "Mini Bar", available: room?.amenities?.includes('minibar') },
    { icon: FaCar, label: "Parking", available: room?.amenities?.includes('parking') },
    { icon: FaLock, label: "Safe", available: room?.amenities?.includes('safe') }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomData, hotelData] = await Promise.all([
          getRoomById(roomId),
          getHotelById(hotelId)
        ]);
        setRoom(roomData);
        setHotel(hotelData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId, hotelId]);

  // Check room availability when dates change
  useEffect(() => {
    const verifyAvailability = async () => {
      if (!checkIn || !checkOut) {
        setIsAvailable(true);
        setAvailabilityError(false);
        return;
      }

      const validation = validateDates();
      if (!validation.isValid) {
        setIsAvailable(false);
        setAvailabilityError(false);
        return;
      }

      setAvailabilityLoading(true);
      setAvailabilityError(false);
      
      try {
        const availability = await checkRoomAvailability(roomId, checkIn, checkOut);
        setIsAvailable(availability.available);

        if (!availability.available) {
          toast.error("Room not available for selected dates");
        }
      } catch (err) {
        console.error("Availability check failed:", err);
        
        if (err.response?.status === 500) {
          // Server error - show warning but allow booking to proceed
          setAvailabilityError(true);
          setIsAvailable(true); // Assume available if server error
          toast.error("Availability check temporarily unavailable", { duration: 3000 });
        } else if (err.response?.status === 404) {
          // Endpoint not found - proceed without availability check
          setAvailabilityError(false);
          setIsAvailable(true);
          console.warn("Availability endpoint not implemented");
        } else {
          // Other errors - assume available
          setAvailabilityError(false);
          setIsAvailable(true);
        }
      } finally {
        setAvailabilityLoading(false);
      }
    };

    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(verifyAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [checkIn, checkOut, roomId]);

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      return { isValid: false, error: "Please select check-in and check-out dates" };
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return { isValid: false, error: "Check-in date cannot be in the past" };
    }

    if (end <= start) {
      return { isValid: false, error: "Check-out date must be after check-in date" };
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights > 30) {
      return { isValid: false, error: "Maximum stay duration is 30 nights" };
    }

    return { isValid: true, nights };
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !room?.price) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    return nights > 0 ? nights * room.price : room.price;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book your stay");
      return navigate("/login", { state: { from: `/booking/${hotelId}/${roomId}` } });
    }

    const validation = validateDates();
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if (guests > (room?.capacity || 2)) {
      toast.error(`Maximum ${room?.capacity || 2} guests allowed for this room`);
      return;
    }

    if (!isAvailable && !availabilityError) {
      toast.error("This room is no longer available for the selected dates");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        hotelId,
        roomId,
        startDate: checkIn,
        endDate: checkOut,
        guests: parseInt(guests)
      };

      await createBooking(bookingData);

      toast.success(
        <div className="flex items-center space-x-2">
          <FaCheckCircle className="text-green-500 text-xl" />
          <div>
            <p className="font-semibold">Booking Confirmed!</p>
            <p className="text-sm">Your room has been successfully booked</p>
          </div>
        </div>,
        { duration: 5000 }
      );

      navigate("/bookings/my");
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage = err.response?.data?.message || "Booking failed. Please try again.";

      if (errorMessage.includes("not available")) {
        setIsAvailable(false);
        setAvailabilityError(false);
      }

      toast.error(errorMessage, { duration: 4000 });
    } finally {
      setBookingLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinCheckOut = () => {
    if (!checkIn) return getTomorrowDate();
    const minDate = new Date(checkIn);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Room not found</p>
          <button
            onClick={() => navigate("/hotels")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();
  const serviceFee = Math.round(total * 0.1);
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + serviceFee + taxes;

  const isBookButtonDisabled = bookingLoading || !checkIn || !checkOut || (!isAvailable && !availabilityError);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Secure your stay at {hotel?.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={room.images?.[0] || "/room-placeholder.jpg"}
                  alt={room.title}
                  className="w-full md:w-48 h-48 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.title}</h2>
                  <p className="text-gray-600 mb-4">{room.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FaBed className="text-blue-500" />
                      <span>{room.bedType || "King Bed"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-green-500" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaDollarSign className="text-yellow-500" />
                      <span className="font-semibold text-lg text-green-600">
                        ₹{room.price}/night
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Room Amenities</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {amenities.filter(a => a.available).slice(0, 4).map((amenity, index) => {
                        const IconComponent = amenity.icon;
                        return (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <IconComponent className="text-blue-500" size={14} />
                            <span>{amenity.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaCalendarAlt className="text-blue-500" />
                <span>Booking Details</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      min={getMinCheckOut()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
                    >
                      {Array.from({ length: room.capacity }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {!isAvailable && !availabilityError && checkIn && checkOut && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-2 text-red-700">
                    <FaExclamationTriangle />
                    <span className="font-semibold">Room Not Available</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    This room is not available for the selected dates. Please choose different dates.
                  </p>
                </div>
              )}

              {/* Availability Check Error */}
              {availabilityError && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <FaExclamationTriangle />
                    <span className="font-semibold">Availability Check Unavailable</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    Unable to verify room availability. You can still proceed with booking.
                  </p>
                </div>
              )}

              {/* Dates Summary */}
              {nights > 0 && (isAvailable || availabilityError) && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Stay Duration:</span>
                    <span className="font-semibold text-blue-700">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                  {availabilityLoading && (
                    <div className="flex items-center space-x-2 mt-2 text-blue-600 text-xs">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span>Checking availability...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaCreditCard className="text-green-500" />
                <span>Booking Summary</span>
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>₹{room.price} × {nights || 1} night{nights !== 1 ? 's' : ''}</span>
                  <span>₹{total}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>₹{serviceFee}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹{taxes}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* Final amount calculated by hotel</p>
                </div>
              </div>

              {/* Security Features */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 text-green-700 mb-2">
                  <FaShieldAlt />
                  <span className="font-semibold text-sm">Secure Booking</span>
                </div>
                <div className="text-xs text-green-600 space-y-1">
                  <p>✓ Free cancellation until 24 hours before check-in</p>
                  <p>✓ Best price guarantee</p>
                  <p>✓ 24/7 customer support</p>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isBookButtonDisabled}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : !isAvailable && !availabilityError ? (
                  <>
                    <FaExclamationTriangle />
                    <span>Not Available</span>
                  </>
                ) : availabilityError ? (
                  <>
                    <FaExclamationTriangle className="text-yellow-500" />
                    <span>Proceed Anyway</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    <span>Complete Booking</span>
                  </>
                )}
              </button>

              {/* User Info */}
              {user && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Booking as: <span className="font-semibold">{user.name}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}