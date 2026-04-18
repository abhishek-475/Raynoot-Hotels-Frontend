import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHotelById } from "../services/hotelService";
import RoomCard from "../components/RoomCard";
import { motion } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaSpa,
  FaDumbbell,
  FaConciergeBell,
  FaShieldAlt,
  FaDoorOpen
} from "react-icons/fa";

const AMENITIES = [
  { icon: FaWifi, label: "Free WiFi" },
  { icon: FaSwimmingPool, label: "Pool" },
  { icon: FaUtensils, label: "Restaurant" },
  { icon: FaCar, label: "Parking" },
  { icon: FaSpa, label: "Spa" },
  { icon: FaDumbbell, label: "Gym" },
  { icon: FaConciergeBell, label: "24/7 Service" },
  { icon: FaShieldAlt, label: "Security" },
];

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero skeleton */}
        <div className="h-[55vh] bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-xl w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-xl w-1/5 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <FaDoorOpen className="text-red-400 text-2xl" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Hotel not found</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-xs">
          This property may have been removed or the link is incorrect.
        </p>
        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition"
        >
          <FaArrowLeft className="text-xs" />
          Back to Hotels
        </Link>
      </div>
    );
  }

  const stars = hotel.stars || 4;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ── */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={
            hotel.image ||
            `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80`
          }
          alt={hotel.name}
          className="w-full h-full object-cover scale-105"
          style={{ animation: "slowZoom 20s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Back button */}
        <Link
          to="/hotels"
          className="absolute top-24 left-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20 transition"
        >
          <FaArrowLeft className="text-xs" />
          All Hotels
        </Link>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${i < stars ? "text-yellow-400" : "text-white/20"}`}
                  />
                ))}
                <span className="text-white/60 text-xs ml-1">{stars}-star hotel</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <FaMapMarkerAlt className="text-orange-400 text-xs" />
                <span>{hotel.city}, {hotel.country}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes slowZoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.12); }
          }
        `}</style>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: description + amenities */}
          <div className="lg:col-span-1 space-y-8">

            {/* About */}
            {hotel.description && (
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3 py-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-orange-400 text-xs" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: rooms */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Available Rooms</h2>
                <p className="text-2xl font-black text-gray-900">
                  {hotel.rooms?.length || 0} {hotel.rooms?.length === 1 ? "Room" : "Rooms"}
                </p>
              </div>
            </div>

            {!hotel.rooms?.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <FaDoorOpen className="text-gray-400 text-lg" />
                </div>
                <p className="font-bold text-gray-700 mb-1">No rooms available</p>
                <p className="text-sm text-gray-400">Check back soon for availability.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } }
                }}
              >
                {hotel.rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
                    }}
                  >
                    <RoomCard room={room} hotelId={hotel._id} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}