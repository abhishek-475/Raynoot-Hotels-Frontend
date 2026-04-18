import { useEffect, useState } from "react";
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";
import { FaSearch, FaFilter, FaSortAmountDown, FaHotel } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

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

  const filtered = hotels
    .filter((h) =>
      query.trim() === "" ||
      h.name?.toLowerCase().includes(query.toLowerCase()) ||
      h.location?.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* PAGE HEADER */}
      <div className="bg-gray-950 text-white pt-28 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
            Explore
          </span>
          <h1 className="text-5xl font-black mb-3 tracking-tight">All Hotels</h1>
          <p className="text-gray-400 text-base">
            {loading ? "Fetching available hotels…" : `${hotels.length} properties worldwide`}
          </p>
        </div>
      </div>

      {/* SEARCH + SORT BAR */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white appearance-none cursor-pointer transition"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <FaHotel className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">
              {query ? "No results found" : "No hotels available"}
            </h2>
            <p className="text-gray-400 text-sm max-w-xs">
              {query
                ? `We couldn't find any hotels matching "${query}". Try a different search.`
                : "Check back soon — new properties are added regularly."}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mt-5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* GRID */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Showing <span className="font-semibold text-gray-700">{filtered.length}</span> {filtered.length === 1 ? "property" : "properties"}
              {query && <> for <span className="font-semibold text-gray-700">"{query}"</span></>}
            </p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } }
              }}
            >
              {filtered.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
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