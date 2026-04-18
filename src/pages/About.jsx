import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaUsers,
  FaGlobeAmericas,
  FaAward,
  FaHeart,
  FaShieldAlt,
  FaStar,
  FaCrown,
  FaArrowRight,
  FaQuoteLeft
} from "react-icons/fa";

export default function About() {

  const stats = [
    { value: "500+", label: "Hotels" },
    { value: "1M+", label: "Guests" },
    { value: "50+", label: "Countries" },
    { value: "25+", label: "Awards" }
  ];

  const values = [
    { icon: FaHeart, title: "Passion", desc: "We deliver heartfelt hospitality in every stay." },
    { icon: FaShieldAlt, title: "Trust", desc: "Your safety and privacy are our priority." },
    { icon: FaStar, title: "Excellence", desc: "We obsess over every detail." },
    { icon: FaCrown, title: "Luxury", desc: "We redefine comfort and elegance." }
  ];

  const team = [
    { name: "Sarah Mitchell", role: "CEO" },
    { name: "James Chen", role: "COO" },
    { name: "Maria Rodriguez", role: "Guest Experience" },
    { name: "David Kim", role: "Tech Director" }
  ];

  const testimonials = [
    { name: "Michael", text: "Absolutely world-class service." },
    { name: "Jennifer", text: "Perfect family experience." },
    { name: "Alexandra", text: "Best luxury stay ever." }
  ];

  return (
    <div className="min-h-screen font-sans">

      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center px-6"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            About <span className="text-yellow-400">Raynott</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Crafting unforgettable luxury experiences worldwide since 2010.
          </p>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-5xl font-black mb-6 text-gray-900">
              Our Story
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Raynott started as a boutique luxury hotel and grew into a global brand.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today we serve millions while maintaining a personal touch.
            </p>

            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-xl font-bold"
            >
              Explore Hotels
              <FaArrowRight />
            </Link>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-black text-yellow-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h2 className="text-5xl font-black mb-4">Our Values</h2>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl text-center"
              >
                <Icon className="text-3xl text-blue-600 mb-4 mx-auto" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TEAM */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h2 className="text-5xl font-black">Leadership</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          {team.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-gray-50 p-6 rounded-2xl text-center shadow"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                {m.name[0]}
              </div>
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-gray-400 text-sm">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h2 className="text-5xl font-black">What Guests Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-gray-900 p-6 rounded-2xl"
            >
              <FaQuoteLeft className="text-gray-600 mb-4" />
              <p className="text-gray-300 mb-6">{t.text}</p>
              <div className="font-semibold">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 text-center bg-white">
        <h2 className="text-5xl font-black mb-6">
          Experience Luxury Today
        </h2>

        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition"
        >
          Book Now
          <FaArrowRight />
        </Link>
      </section>

    </div>
  );
}