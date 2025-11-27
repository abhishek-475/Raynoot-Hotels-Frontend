import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotelById } from "../services/hotelService";
import RoomCard from "../components/RoomCard";

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

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading hotel details...</p>;
  }

  if (!hotel) {
    return <p className="text-center mt-20 text-red-500">Hotel not found.</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hotel Info */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{hotel.name}</h1>
        <p className="text-gray-600 mt-1">{hotel.city}, {hotel.country}</p>
        <p className="text-yellow-500 mt-2">⭐ {hotel.stars || 4}</p>
      </div>

      {/* Rooms Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Rooms</h2>
        {hotel.rooms.length === 0 ? (
          <p className="text-gray-500">No rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard key={room._id} room={room} hotelId={hotel._id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
