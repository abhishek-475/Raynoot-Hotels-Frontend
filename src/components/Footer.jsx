import { Link } from "react-router-dom";
import {
  FaHotel,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaShieldAlt,
  FaCreditCard,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const supportLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" }
  ];

  const amenities = [
    { icon: FaWifi, name: "Free WiFi" },
    { icon: FaSwimmingPool, name: "Pool" },
    { icon: FaUtensils, name: "Restaurant" },
    { icon: FaCar, name: "Parking" },
    { icon: FaShieldAlt, name: "Security" },
    { icon: FaCreditCard, name: "Easy Payment" }
  ];

  const socialLinks = [
    { icon: FaFacebook, name: "Facebook", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaLinkedin, name: "LinkedIn", url: "#" }
  ];

  return (
    <footer className="bg-gray-950 text-white">

      {/* NEWSLETTER BAND */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-black mb-1">Get exclusive deals in your inbox</h4>
              <p className="text-gray-500 text-sm">Join 50,000+ travellers who save up to 40% on every booking.</p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <FaCheckCircle />
                <span>You're subscribed — check your inbox!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 w-full lg:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 lg:w-72 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-400/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200 whitespace-nowrap"
                >
                  Subscribe
                  <FaArrowRight className="text-xs" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-900/30 group-hover:scale-105 transition-transform">
                <FaHotel className="text-white text-sm" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-white text-lg tracking-tight">Raynott</span>
                <span className="block text-[10px] font-medium text-gray-500 tracking-widest uppercase -mt-0.5">Luxury Stays</span>
              </div>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              Hand-picked luxury hotels across the globe, curated for comfort, excellence, and unforgettable moments.
            </p>

            {/* Amenities */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-7">
              {amenities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                    <Icon className="text-orange-400/70 flex-shrink-0" />
                    <span>{a.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.url}
                    aria-label={s.name}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-5">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="w-3 h-px bg-gray-700 group-hover:bg-orange-400 group-hover:w-4 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-5">Support</h3>
            <ul className="space-y-1">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="w-3 h-px bg-gray-700 group-hover:bg-orange-400 group-hover:w-4 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-5">Contact</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-orange-400 text-xs" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">123 Luxury Avenue</p>
                  <p className="text-xs text-gray-600 mt-0.5">Premium District, City 10001</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-emerald-400 text-xs" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-600 mt-0.5">24/7 Support</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-yellow-400 text-xs" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">info@raynotthotels.com</p>
                  <p className="text-xs text-gray-600 mt-0.5">reservations@raynotthotels.com</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Raynott Hotels. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-gray-600 hover:text-gray-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <FaShieldAlt className="text-emerald-500 text-xs" />
            <span>Secure Booking</span>
          </div>

        </div>
      </div>

    </footer>
  );
}