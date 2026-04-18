import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoomById, checkRoomAvailability } from "../services/roomService";
import { getHotelById } from "../services/hotelService";
import { createBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUser,
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
  FaClock,
  FaDoorOpen
} from "react-icons/fa";

const AMENITY_MAP = [
  { icon: FaWifi,      label: "Free WiFi",        key: "wifi" },
  { icon: FaTv,        label: "Smart TV",          key: "tv" },
  { icon: FaSnowflake, label: "Air Conditioning",  key: "ac" },
  { icon: FaShower,    label: "Hot Shower",        key: "shower" },
  { icon: FaUtensils,  label: "Mini Bar",          key: "minibar" },
  { icon: FaCar,       label: "Parking",           key: "parking" },
  { icon: FaLock,      label: "Safe",              key: "safe" },
];

function fmt(n) { return Number(n).toLocaleString("en-IN"); }

export default function Booking() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [room, setRoom]                       = useState(null);
  const [hotel, setHotel]                     = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [bookingLoading, setBookingLoading]   = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [checkIn, setCheckIn]                 = useState("");
  const [checkOut, setCheckOut]               = useState("");
  const [guests, setGuests]                   = useState(1);
  const [isAvailable, setIsAvailable]         = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [focused, setFocused]                 = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomData, hotelData] = await Promise.all([
          getRoomById(roomId),
          getHotelById(hotelId),
        ]);
        if (!roomData || !hotelData) throw new Error("Not found");
        setRoom(roomData);
        setHotel(hotelData);
      } catch {
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    if (hotelId && roomId) fetchData();
  }, [roomId, hotelId]);

  useEffect(() => {
    const verify = async () => {
      if (!checkIn || !checkOut) { setIsAvailable(true); setAvailabilityError(false); return; }
      const v = validateDates();
      if (!v.isValid) { setIsAvailable(false); setAvailabilityError(false); return; }

      setAvailabilityLoading(true);
      setAvailabilityError(false);
      try {
        const res = await checkRoomAvailability(roomId, checkIn, checkOut);
        setIsAvailable(res.available);
        if (!res.available) toast.error("Room not available for selected dates");
      } catch (err) {
        if (err.response?.status === 500) { setAvailabilityError(true); setIsAvailable(true); }
        else { setAvailabilityError(false); setIsAvailable(true); }
      } finally {
        setAvailabilityLoading(false);
      }
    };
    const t = setTimeout(verify, 500);
    return () => clearTimeout(t);
  }, [checkIn, checkOut, roomId]);

  const validateDates = () => {
    if (!checkIn || !checkOut) return { isValid: false, error: "Please select dates" };
    const start = new Date(checkIn), end = new Date(checkOut);
    const today = new Date(); today.setHours(0,0,0,0);
    if (start < today) return { isValid: false, error: "Check-in cannot be in the past" };
    if (end <= start)  return { isValid: false, error: "Check-out must be after check-in" };
    const nights = Math.ceil((end - start) / 86400000);
    if (nights > 30)   return { isValid: false, error: "Maximum stay is 30 nights" };
    return { isValid: true, nights };
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  };

  const nights      = calculateNights();
  const base        = nights > 0 ? nights * (room?.price || 0) : 0;
  const serviceFee  = Math.round(base * 0.10);
  const taxes       = Math.round(base * 0.05);
  const grandTotal  = base + serviceFee + taxes;

  const getMinCheckOut = () => {
    if (!checkIn) { const t = new Date(); t.setDate(t.getDate()+1); return t.toISOString().split("T")[0]; }
    const d = new Date(checkIn); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0];
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      toast.error("Please log in to book your stay");
      navigate("/login", { state: { from: `/booking/${hotelId}/${roomId}` } });
      return;
    }
    const v = validateDates();
    if (!v.isValid) { toast.error(v.error); return; }
    if (guests > (room?.capacity || 2)) { toast.error(`Max ${room?.capacity || 2} guests`); return; }
    if (!isAvailable && !availabilityError) { toast.error("Room not available for selected dates"); return; }

    setBookingLoading(true);
    try {
      await createBooking({ hotelId, roomId, startDate: checkIn, endDate: checkOut, guests: parseInt(guests) });
      toast.success("Booking confirmed!");
      setTimeout(() => navigate("/bookings/my"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      if (err.response?.status === 401) { logout(); navigate("/login"); }
      else toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 outline-none border transition-all duration-200 bg-white ${
      focused === key ? "border-orange-400 ring-2 ring-orange-100" : "border-gray-200"
    }`;

  /* ── LOADING ── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-orange-400 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400 font-medium">Loading room details…</p>
      </div>
    </div>
  );

  /* ── NOT FOUND ── */
  if (!room || !hotel) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <FaDoorOpen className="text-red-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Room not found</h2>
        <p className="text-gray-400 text-sm mb-7">This room may no longer be available.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate("/hotels")}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3 rounded-xl hover:scale-[1.02] transition-all">
            Explore Hotels
          </button>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 transition-all">
            <FaArrowLeft className="text-xs" /> Go back
          </button>
        </div>
      </div>
    </div>
  );

  const amenities = AMENITY_MAP.filter((a) => room?.amenities?.includes(a.key));
  const isDisabled = bookingLoading || !checkIn || !checkOut || (!isAvailable && !availabilityError);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* PAGE HEADER */}
      <div className="bg-gray-950 text-white pt-28 pb-14 px-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group">
            <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            Back to room
          </button>
          <span className="block text-xs font-bold tracking-widest text-orange-400 uppercase mb-2">Booking</span>
          <h1 className="text-4xl font-black tracking-tight mb-2">Complete your stay</h1>
          <p className="text-gray-400 text-sm">
            Securing a room at <span className="text-white font-semibold">{hotel.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT: form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Room preview card */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative sm:w-56 h-44 flex-shrink-0">
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80"}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-gray-950/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {room.type || "Deluxe Room"}
                  </span>
                </div>

                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className="text-lg font-black text-gray-900 leading-tight">{room.title}</h2>
                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full flex-shrink-0">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs font-bold text-yellow-700">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <FaMapMarkerAlt className="text-orange-400 text-[10px]" />
                    {hotel.city}, {hotel.country}
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{room.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5"><FaBed className="text-gray-400" /> {room.bedType || "King Bed"}</span>
                    <span className="flex items-center gap-1.5"><FaUser className="text-gray-400" /> Up to {room.capacity} guests</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">₹{fmt(room.price)}<span className="font-normal text-gray-400">/night</span></span>
                  </div>

                  {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {amenities.slice(0, 5).map(({ icon: Icon, label }) => (
                        <span key={label} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-lg">
                          <Icon className="text-orange-400 text-[10px]" />{label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates & guests */}
            <div className="bg-white border border-gray-100 rounded-3xl p-7">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Booking details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Check-in */}
                <div>
                  <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">Check-in</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                    <input type="date" value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      onFocus={() => setFocused("checkin")}
                      onBlur={() => setFocused(null)}
                      className={inputClass("checkin")} required />
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">Check-out</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                    <input type="date" value={checkOut}
                      min={getMinCheckOut()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      onFocus={() => setFocused("checkout")}
                      onBlur={() => setFocused(null)}
                      className={inputClass("checkout")} required />
                  </div>
                </div>

                {/* Guests */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">Guests</label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                    <select value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      onFocus={() => setFocused("guests")}
                      onBlur={() => setFocused(null)}
                      className={inputClass("guests") + " cursor-pointer appearance-none"}>
                      {Array.from({ length: room.capacity || 4 }, (_, i) => (
                        <option key={i+1} value={i+1}>{i+1} Guest{i+1 > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status banners */}
              {!isAvailable && !availabilityError && checkIn && checkOut && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-400 text-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Not available</p>
                    <p className="text-xs text-red-500 mt-0.5">Room is taken for these dates. Please choose different dates.</p>
                  </div>
                </div>
              )}
              {availabilityError && (
                <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <FaExclamationTriangle className="text-amber-400 text-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Availability check unavailable</p>
                    <p className="text-xs text-amber-600 mt-0.5">You can still proceed with your booking.</p>
                  </div>
                </div>
              )}
              {nights > 0 && (isAvailable || availabilityError) && (
                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                    <FaClock className="text-xs" />
                    {availabilityLoading ? (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <div className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        Checking availability…
                      </span>
                    ) : "Room available"}
                  </div>
                  <span className="text-emerald-800 font-black text-sm">{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-7 sticky top-24">

              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Price summary</h3>

              {/* Price breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{fmt(room.price)} × {nights || 1} night{nights !== 1 ? "s" : ""}</span>
                  <span className="font-semibold text-gray-700">₹{fmt(base || room.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Service fee (10%)</span>
                  <span>₹{fmt(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes (5%)</span>
                  <span>₹{fmt(taxes)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="text-xl font-black text-emerald-600">₹{fmt(grandTotal || room.price)}</span>
                </div>
                <p className="text-xs text-gray-400">All taxes and fees included</p>
              </div>

              {/* Trust badges */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5 space-y-2">
                {[
                  "Free cancellation (24h before check-in)",
                  "Best price guarantee",
                  "24/7 customer support",
                  "SSL-encrypted payment"
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-xs text-gray-500">
                    <FaCheckCircle className="text-emerald-400 text-[10px] mt-0.5 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button onClick={handleBooking} disabled={isDisabled}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all duration-200">
                {bookingLoading ? (
                  <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Processing…</>
                ) : !isAvailable && !availabilityError ? (
                  <><FaExclamationTriangle className="text-xs" /> Not available</>
                ) : availabilityError ? (
                  <><FaExclamationTriangle className="text-xs" /> Proceed anyway</>
                ) : !user ? (
                  <><FaKey className="text-xs" /> Log in to book</>
                ) : (
                  <><FaCreditCard className="text-xs" /> Confirm booking</>
                )}
              </button>

              {/* Logged-in user pill */}
              {user && (
                <div className="mt-4 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{user.name}</p>
                    <p className="text-[11px] text-gray-400">Booking as registered user</p>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 mt-4">
                Need help?{" "}
                <Link to="/contact" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Contact support
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}