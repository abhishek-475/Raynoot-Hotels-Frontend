import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaStar,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaSpa,
  FaDumbbell,
  FaConciergeBell,
  FaShieldAlt,
  FaSearch,
  FaArrowRight,
  FaQuoteLeft
} from "react-icons/fa";

export default function Home() {
  const popularDestinations = [
    { name: "Paris", country: "France", hotels: 124, image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52" },
    { name: "New York", country: "USA", hotels: 98, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9" },
    { name: "Tokyo", country: "Japan", hotels: 87, image: "https://images.unsplash.com/photo-1540959733332-0b10d1e4b288" },
    { name: "London", country: "UK", hotels: 112, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad" },
    { name: "Dubai", country: "UAE", hotels: 76, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
    { name: "Sydney", country: "Australia", hotels: 65, image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9" }
  ];

  const features = [
    { icon: FaWifi, title: "Free WiFi", description: "High-speed internet access", color: "from-blue-500 to-cyan-400" },
    { icon: FaSwimmingPool, title: "Swimming Pool", description: "Luxury pools & relaxation", color: "from-cyan-500 to-teal-400" },
    { icon: FaUtensils, title: "Fine Dining", description: "Premium culinary experience", color: "from-orange-500 to-amber-400" },
    { icon: FaCar, title: "Free Parking", description: "Secure parking included", color: "from-slate-500 to-gray-400" },
    { icon: FaSpa, title: "Spa & Wellness", description: "Relax & rejuvenate", color: "from-pink-500 to-rose-400" },
    { icon: FaDumbbell, title: "Fitness Center", description: "Modern gym facilities", color: "from-violet-500 to-purple-400" },
    { icon: FaConciergeBell, title: "24/7 Service", description: "Always at your service", color: "from-yellow-500 to-amber-400" },
    { icon: FaShieldAlt, title: "Safe & Secure", description: "Top-notch security", color: "from-green-500 to-emerald-400" }
  ];

  const testimonials = [
    { name: "Sarah Johnson", location: "New York", rating: 5, comment: "Amazing stay, everything was perfect!", initials: "SJ", accent: "bg-violet-100 text-violet-700" },
    { name: "Mike Chen", location: "Tokyo", rating: 5, comment: "Excellent service and location.", initials: "MC", accent: "bg-blue-100 text-blue-700" },
    { name: "Emma Davis", location: "London", rating: 4, comment: "Loved the ambiance and spa!", initials: "ED", accent: "bg-rose-100 text-rose-700" }
  ];

  const stats = [
    { value: "500+", label: "Hotels Worldwide" },
    { value: "120K+", label: "Happy Guests" },
    { value: "60+", label: "Destinations" },
    { value: "4.9★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ animation: "slowZoom 20s ease-in-out infinite alternate" }}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-8"
          >
            <FaStar className="text-yellow-400 text-xs" />
            <span>Trusted by 120,000+ travellers worldwide</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
            Stay Beyond
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Ordinary
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-white/70 max-w-xl mx-auto leading-relaxed">
            Hand-picked luxury hotels across the globe — curated for comfort, excellence, and unforgettable moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hotels"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold text-base hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300"
            >
              <FaSearch className="text-sm" />
              Explore Hotels
            </Link>
            <Link
              to="/hotels"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/20 transition-all duration-300"
            >
              View Destinations
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>

        <style>{`
          @keyframes slowZoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.12); }
          }
        `}</style>
      </section>

      {/* STATS BAR */}
      <section className="bg-gray-950 text-white py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-black text-yellow-400 mb-1">{s.value}</div>
              <div className="text-sm text-gray-400 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest text-orange-500 uppercase mb-3">Where to Next</span>
            <h2 className="text-5xl font-black text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-gray-500 max-w-md mx-auto">From iconic cities to hidden gems — explore our most-loved locations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((d, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              >
                <img
                  src={`${d.image}?auto=format&fit=crop&w=600&q=80`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={d.name}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hotel count badge */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                  {d.hotels} hotels
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-0.5">{d.name}</h3>
                      <div className="flex items-center gap-1.5 text-white/70 text-sm">
                        <FaMapMarkerAlt className="text-red-400 text-xs" />
                        <span>{d.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest text-orange-500 uppercase mb-3">Amenities</span>
            <h2 className="text-5xl font-black text-gray-900 mb-4">Why Choose Raynott</h2>
            <p className="text-gray-500 max-w-md mx-auto">Every stay is crafted to delight — from the moment you arrive to the moment you leave</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white text-lg" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest text-yellow-400 uppercase mb-3">Reviews</span>
            <h2 className="text-5xl font-black mb-4">What Guests Say</h2>
            <p className="text-gray-400 max-w-md mx-auto">Real stories from real travellers who chose Raynott</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-gray-700 transition-all duration-300"
              >
                <FaQuoteLeft className="text-2xl text-gray-700 mb-5" />
                <p className="text-gray-300 text-base leading-relaxed mb-8">{t.comment}</p>

                <div className="flex items-center justify-between pt-5 border-t border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.accent}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xs" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-5" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-200">
            <FaHotel className="text-white text-2xl" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Your dream stay
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              awaits you.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of travellers who discovered the perfect hotel with Raynott.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hotels"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-orange-300/40 transition-all duration-300"
            >
              Book Now
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">No hidden fees · Free cancellation · Best rate guaranteed</p>
        </div>
      </section>

    </div>
  );
}