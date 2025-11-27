import { useEffect, useState } from "react";
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading hotels...</p>;
  }

  if (!hotels.length) {
    return <p className="text-center mt-20 text-gray-500">No hotels found.</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Hotels</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
