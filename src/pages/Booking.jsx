import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  FaExclamationTriangle,
  FaKey,
  FaStar,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

export default function Booking() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

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
  const [authChecked, setAuthChecked] = useState(false);

  const amenities = [
    { icon: FaWifi, label: "Free WiFi", available: room?.amenities?.includes('wifi') },
    { icon: FaTv, label: "Smart TV", available: room?.amenities?.includes('tv') },
    { icon: FaSnowflake, label: "Air Conditioning", available: room?.amenities?.includes('ac') },
    { icon: FaShower, label: "Hot Shower", available: room?.amenities?.includes('shower') },
    { icon: FaUtensils, label: "Mini Bar", available: room?.amenities?.includes('minibar') },
    { icon: FaCar, label: "Parking", available: room?.amenities?.includes('parking') },
    { icon: FaLock, label: "Safe", available: room?.amenities?.includes('safe') }
  ];

  // Check authentication status on component mount
  useEffect(() => {
    const verifyAuthentication = () => {
      const token = localStorage.getItem('token');
      console.log('🔐 Booking page - Authentication check:');
      console.log('🔐 Token:', token ? 'PRESENT' : 'MISSING');
      console.log('🔐 User context:', user);
      console.log('🔐 isAuthenticated:', isAuthenticated);
      
      if (!token || !user) {
        console.warn('⚠️ Authentication required for booking');
      }
      setAuthChecked(true);
    };

    verifyAuthentication();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('📡 Fetching room and hotel data...');
        const [roomData, hotelData] = await Promise.all([
          getRoomById(roomId),
          getHotelById(hotelId)
        ]);
        
        if (!roomData) {
          throw new Error('Room not found');
        }
        if (!hotelData) {
          throw new Error('Hotel not found');
        }
        
        setRoom(roomData);
        setHotel(hotelData);
        console.log('✅ Room and hotel data loaded successfully');
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    
    if (hotelId && roomId) {
      fetchData();
    }
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
        console.log('🔍 Checking room availability...');
        const availability = await checkRoomAvailability(roomId, checkIn, checkOut);
        setIsAvailable(availability.available);

        if (!availability.available) {
          console.log('❌ Room not available for selected dates');
          toast.error("Room not available for selected dates");
        } else {
          console.log('✅ Room is available');
        }
      } catch (err) {
        console.error("❌ Availability check failed:", err);
        
        if (err.response?.status === 500) {
          setAvailabilityError(true);
          setIsAvailable(true);
          toast.error("Availability check temporarily unavailable", { duration: 3000 });
        } else if (err.response?.status === 404) {
          setAvailabilityError(false);
          setIsAvailable(true);
          console.warn("ℹ️ Availability endpoint not implemented, proceeding...");
        } else {
          setAvailabilityError(false);
          setIsAvailable(true);
        }
      } finally {
        setAvailabilityLoading(false);
      }
    };

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
    if (nights < 1) {
      return { isValid: false, error: "Minimum stay is 1 night" };
    }
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
    // Enhanced authentication check
    const token = localStorage.getItem('token');
    console.log('🔐 Pre-booking authentication check:');
    console.log('🔐 Token:', token ? 'PRESENT' : 'MISSING');
    console.log('🔐 User context:', user);
    console.log('🔐 isAuthenticated:', isAuthenticated);

    if (!user || !token) {
      console.error('❌ Authentication missing, redirecting to login');
      toast.error(
        <div className="flex items-center space-x-2">
          <FaKey className="text-yellow-500" />
          <span>Please login to book your stay</span>
        </div>
      );
      navigate("/login", { 
        state: { 
          from: `/booking/${hotelId}/${roomId}`,
          message: "Please login to complete your booking"
        } 
      });
      return;
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

      console.log('📤 Sending booking request with data:', bookingData);
      console.log('🔐 Token being sent:', token ? 'PRESENT' : 'MISSING');

      const result = await createBooking(bookingData);
      console.log('✅ Booking successful:', result);

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

      // Navigate to bookings page
      setTimeout(() => {
        navigate("/bookings/my");
      }, 1500);

    } catch (err) {
      console.error("❌ Booking error:", err);
      const errorMessage = err.response?.data?.message || "Booking failed. Please try again.";

      if (errorMessage.includes("not available")) {
        setIsAvailable(false);
        setAvailabilityError(false);
        toast.error("Room is no longer available for selected dates");
      } else if (err.response?.status === 401) {
        toast.error(
          <div className="flex items-center space-x-2">
            <FaKey className="text-red-500" />
            <span>Session expired. Please login again.</span>
          </div>
        );
        // Clear invalid token and redirect to login
        logout();
        navigate("/login", { 
          state: { 
            from: `/booking/${hotelId}/${roomId}`,
            message: "Session expired. Please login again."
          } 
        });
      } else {
        toast.error(errorMessage, { duration: 4000 });
      }
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

  const handleLoginRedirect = () => {
    navigate("/login", { 
      state: { 
        from: `/booking/${hotelId}/${roomId}`,
        message: "Please login to complete your booking"
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Room Details</h3>
          <p className="text-gray-600">Preparing your booking experience...</p>
        </div>
      </div>
    );
  }

  if (!room || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">The room you're looking for is not available or may have been removed.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/hotels")}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Explore Other Hotels
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Room</span>
            </button>
            
            {!user && (
              <button
                onClick={handleLoginRedirect}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <FaKey />
                <span>Login to Book</span>
              </button>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Secure your stay at <span className="font-semibold text-blue-600">{hotel?.name}</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel & Room Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <img
                    src={room.images?.[0] || "/api/placeholder/300/200"}
                    alt={room.title}
                    className="w-full md:w-64 h-48 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                    {room.type || "Deluxe Room"}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-800">{room.title}</h2>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400" />
                      <span className="font-semibold text-yellow-700">4.8</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <FaMapMarkerAlt className="text-red-400" />
                    <span>{hotel?.location || "City Center"}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{room.description}</p>

                  {/* Room Features */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaBed className="text-blue-500" />
                      <span>{room.bedType || "King Bed"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaUser className="text-green-500" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaDollarSign className="text-yellow-500" />
                      <span className="font-semibold text-lg text-green-600">
                        ₹{room.price}/night
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <FaShieldAlt className="text-blue-500" />
                      <span>Room Amenities</span>
                    </h4>
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                    >
                      {Array.from({ length: room.capacity || 4 }, (_, i) => (
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
                <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-2 text-red-700 mb-2">
                    <FaExclamationTriangle />
                    <span className="font-semibold">Room Not Available</span>
                  </div>
                  <p className="text-sm text-red-600">
                    This room is not available for the selected dates. Please choose different dates.
                  </p>
                </div>
              )}

              {/* Availability Check Error */}
              {availabilityError && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center space-x-2 text-yellow-700 mb-2">
                    <FaExclamationTriangle />
                    <span className="font-semibold">Availability Check Unavailable</span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Unable to verify room availability. You can still proceed with booking.
                  </p>
                </div>
              )}

              {/* Dates Summary */}
              {nights > 0 && (isAvailable || availabilityError) && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <FaClock />
                      <span className="font-semibold">Stay Duration</span>
                    </div>
                    <span className="font-bold text-blue-800">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                  {availabilityLoading && (
                    <div className="flex items-center space-x-2 mt-2 text-blue-600 text-sm">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span>Checking availability...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaCreditCard className="text-green-500" />
                <span>Booking Summary</span>
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>₹{room.price} × {nights || 1} night{nights !== 1 ? 's' : ''}</span>
                  <span className="font-semibold">₹{total}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>₹{serviceFee}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Charges</span>
                  <span>₹{taxes}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{grandTotal}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* Includes all taxes and service charges</p>
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
                  <p>✓ SSL encrypted payment</p>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isBookButtonDisabled}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-3 group"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Booking...</span>
                  </>
                ) : !isAvailable && !availabilityError ? (
                  <>
                    <FaExclamationTriangle />
                    <span>Not Available</span>
                  </>
                ) : availabilityError ? (
                  <>
                    <FaExclamationTriangle className="text-yellow-300" />
                    <span>Proceed Anyway</span>
                  </>
                ) : !user ? (
                  <>
                    <FaKey />
                    <span>Login to Book</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="group-hover:scale-110 transition-transform" />
                    <span>Complete Booking</span>
                  </>
                )}
              </button>

              {/* User Info */}
              {user && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-600">Booking as registered user</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Need Help */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Need help?{" "}
                  <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}