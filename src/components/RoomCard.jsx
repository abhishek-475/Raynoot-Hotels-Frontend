import { Link } from "react-router-dom";
import {
  FaBed,
  FaUser,
  FaWifi,
  FaSnowflake,
  FaCoffee,
  FaStar,
  FaHeart
} from "react-icons/fa";
import { useState } from "react";

export default function RoomCard({ room, hotelId }) {
  const [liked, setLiked] = useState(false);

  const amenities = [
    { icon: FaWifi, available: room.amenities?.includes("wifi") },
    { icon: FaSnowflake, available: room.amenities?.includes("ac") },
    { icon: FaCoffee, available: room.amenities?.includes("coffee") }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const originalPrice = room.originalPrice || room.price * 1.2;
  const discount =
    originalPrice > room.price
      ? Math.round(((originalPrice - room.price) / originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={room.images?.[0] || "/room-placeholder.jpg"}
          alt={room.title}
          className="w-full h-60 object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition" />

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white/20 text-white hover:bg-white/40"
          }`}
        >
          <FaHeart size={14} />
        </button>

        {/* Badge */}
        {discount && (
          <div className="absolute top-4 left-4 bg-white text-gray-900 text-xs px-3 py-1 rounded-full font-semibold shadow">
            {discount}% off
          </div>
        )}

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-lg leading-tight line-clamp-1">
            {room.title}
          </h3>
          <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
            <FaBed />
            {room.bedType || "King Bed"} • {room.capacity || 2} guests
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <FaStar className="text-yellow-400 text-xs" />
            {room.rating || 4.8}
            <span className="text-gray-400 font-normal">
              ({room.reviews || 80})
            </span>
          </div>
          <span className="text-xs text-green-600 font-semibold">
            Free cancellation
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {room.description ||
            "Modern room with premium comfort and luxury amenities."}
        </p>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {amenities.map((a, i) => {
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
                <Icon size={13} />
              </div>
            );
          })}
        </div>

        {/* PRICE */}
        <div className="mb-5">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(room.price)}
            </span>
            <span className="text-sm text-gray-500 mb-1">night</span>
          </div>

          {discount && (
            <div className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/booking/${hotelId}/${room._id}`}
          className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
        >
          Reserve
        </Link>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
          <span>Only 2 rooms left</span>
          <span className="text-green-600 font-semibold">Instant book</span>
        </div>
      </div>
    </div>
  );
}