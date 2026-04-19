import { useEffect, useState } from "react";
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";
import { FaSearch, FaSortAmountDown, FaHotel } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Hotels() {

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // FETCH
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const data = await getAllHotels({
          search: query,
          sort,
          page
        });

        setHotels(data?.hotels || []);
        setPages(data?.pages || 1);
        setPages(data.pages);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [query, sort, page]);

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
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setPage(1); // reset page
                setQuery(e.target.value);
              }}
              placeholder="Search hotels, cities, countries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white"
            >
              <option value="newest">Newest</option>
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
        {!loading && hotels.length === 0 && (
          <div className="text-center py-24">
            <FaHotel className="text-4xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">
              No hotels found
            </h2>
          </div>
        )}

        {/* GRID */}
        {!loading && hotels.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {hotels.length}
              </span>{" "}
              results
            </p>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } }
              }}
            >
              {hotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-10 gap-2">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg border ${page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}