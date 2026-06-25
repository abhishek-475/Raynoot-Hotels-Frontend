import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHotelById } from "../services/hotelService";
import RoomCard from "../components/hotel/RoomCard";
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

// Map backend amenities → icons
const AMENITY_MAP = {
  wifi: { icon: FaWifi, label: "Free WiFi" },
  pool: { icon: FaSwimmingPool, label: "Pool" },
  restaurant: { icon: FaUtensils, label: "Restaurant" },
  parking: { icon: FaCar, label: "Parking" },
  spa: { icon: FaSpa, label: "Spa" },
  gym: { icon: FaDumbbell, label: "Gym" },
  service: { icon: FaConciergeBell, label: "24/7 Service" },
  security: { icon: FaShieldAlt, label: "Security" }
};

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="h-[55vh] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  /* NOT FOUND */
  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Hotel not found</p>
      </div>
    );
  }

  const stars = hotel.stars || 3;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={
            hotel.images?.[0] ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945"
          }
          alt={hotel.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        {/* Back */}
        <Link
          to="/hotels"
          className="absolute top-24 left-6 text-white bg-black/40 px-4 py-2 rounded"
        >
          <FaArrowLeft /> Back
        </Link>

        {/* Title */}
        <div className="absolute bottom-10 left-6 text-white">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < stars ? "text-yellow-400" : "text-gray-400"}
              />
            ))}
          </div>

          <h1 className="text-4xl font-bold">{hotel.name}</h1>

          <p className="flex items-center gap-2 text-sm">
            <FaMapMarkerAlt />
            {hotel.city}, {hotel.country}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="space-y-6">

          {/* Description */}
          <div>
            <h2 className="font-bold text-lg mb-2">About</h2>
            <p className="text-gray-600">{hotel.description}</p>
          </div>

          {/* Amenities ( dynamic from backend) */}
          <div>
            <h2 className="font-bold text-lg mb-3">Amenities</h2>

            <div className="grid grid-cols-2 gap-3">
              {hotel.amenities?.map((a) => {
                const item = AMENITY_MAP[a];

                if (!item) return null;

                const Icon = item.icon;

                return (
                  <div
                    key={a}
                    className="flex items-center gap-2 bg-white border rounded-lg p-2"
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT (Rooms) */}
        <div className="lg:col-span-2">

          <h2 className="text-xl font-bold mb-4">
            {hotel.rooms?.length || 0} Rooms Available
          </h2>

          {!hotel.rooms?.length ? (
            <p>No rooms available</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {hotel.rooms.map((room) => (
                <RoomCard key={room._id} room={room} hotelId={hotel._id} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}