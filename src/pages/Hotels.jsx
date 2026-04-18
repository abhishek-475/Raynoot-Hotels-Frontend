import { useEffect, useState } from "react";
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";
import { FaSearch, FaSortAmountDown, FaHotel } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  // 🔥 Fetch hotels
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

  // ✅ FIXED FILTER + SORT
  const filtered = hotels
    .filter((h) => {
      if (!query.trim()) return true;

      const search = query.toLowerCase();

      return (
        h.name?.toLowerCase().includes(search) ||
        h.city?.toLowerCase().includes(search) ||
        h.country?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (sort === "stars") return b.stars - a.stars;
      if (sort === "stars-low") return a.stars - b.stars;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-gray-950 text-white pt-28 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Explore
          </span>

          <h1 className="text-5xl font-black mt-2">All Hotels</h1>

          <p className="text-gray-400 mt-2">
            {loading
              ? "Fetching hotels..."
              : `${hotels.length} premium properties`}
          </p>
        </div>
      </div>

      {/* SEARCH + SORT */}
      <div className="sticky top-16 bg-white border-b shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-3 flex-col sm:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hotels, cities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border"
            >
              <option value="default">Sort: Default</option>
              <option value="stars">Top Rated</option>
              <option value="stars-low">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* LOADING */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white h-64 rounded-2xl" />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <FaHotel className="text-4xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold">No hotels found</h2>
          </div>
        )}

        {/* GRID */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Showing {filtered.length} results
            </p>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } }
              }}
            >
              {filtered.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}