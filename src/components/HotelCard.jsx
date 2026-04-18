import { Link } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaWifi,
  FaSwimmingPool,
  FaCar,
  FaUtensils,
  FaSpa,
  FaDumbbell,
  FaHeart,
  FaShareAlt
} from "react-icons/fa";
import { useState, useMemo } from "react";

export default function HotelCard({ hotel }) {
  const [liked, setLiked] = useState(false);

  // ✅ Compute lowest room price dynamically
  const lowestPrice = useMemo(() => {
    if (!hotel.rooms || hotel.rooms.length === 0) return null;
    return Math.min(...hotel.rooms.map((r) => r.price || 0));
  }, [hotel.rooms]);

  const amenities = [
    { icon: FaWifi, available: hotel.amenities?.includes("wifi") },
    { icon: FaSwimmingPool, available: hotel.amenities?.includes("pool") },
    { icon: FaCar, available: hotel.amenities?.includes("parking") },
    { icon: FaUtensils, available: hotel.amenities?.includes("restaurant") },
    { icon: FaSpa, available: hotel.amenities?.includes("spa") },
    { icon: FaDumbbell, available: hotel.amenities?.includes("gym") }
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={hotel.images?.[0] || "/hotel-placeholder.jpg"}
          alt={hotel.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border border-white/30 transition ${
              liked
                ? "bg-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/40"
            }`}
          >
            <FaHeart size={14} />
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold shadow">
          {hotel.stars >= 4 ? "Luxury Stay" : "Popular"}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center text-xs opacity-90">
              <FaMapMarkerAlt className="mr-1" />
              {hotel.city}, {hotel.country}
            </div>
          </div>

          <div className="text-right">
            {lowestPrice ? (
              <>
                <div className="text-lg font-bold">
                  {formatPrice(lowestPrice)}
                </div>
                <div className="text-xs opacity-80">starting price</div>
              </>
            ) : (
              <div className="text-xs opacity-80">No rooms</div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* ⭐ Stars instead of fake rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`text-xs ${
                  i < hotel.stars ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-green-600 font-semibold">
            Free cancellation
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {hotel.description ||
            "Premium stay with top-tier amenities and excellent service."}
        </p>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {amenities.slice(0, 4).map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  a.available
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-50 text-gray-300"
                }`}
              >
                <Icon size={14} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to={`/hotels/${hotel._id}`}
          className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
        >
          View details
        </Link>
      </div>
    </div>
  );
}