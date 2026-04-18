import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHotel,
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaMapMarkerAlt
} from "react-icons/fa";

const HIGHLIGHTS = [
  { icon: FaShieldAlt, text: "Secure & encrypted login" },
  { icon: FaHotel,     text: "Access 500+ luxury hotels" },
  { icon: FaStar,      text: "Exclusive member-only rates" },
];

const DESTINATIONS = ["Paris", "Tokyo", "Dubai", "New York", "Sydney"];

export default function Login() {
  const { setUserAfterLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      if (data.token) localStorage.setItem("token", data.token);

      setUserAfterLogin(data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/10"
      >

        {/* ── LEFT PANEL ── */}
        <div className="relative md:w-5/12 bg-gray-950 text-white p-10 flex flex-col justify-between overflow-hidden">

          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950/90" />

          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-900/40 group-hover:scale-105 transition-transform">
                <FaHotel className="text-white text-sm" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-white text-lg tracking-tight">Raynott</span>
                <span className="block text-[10px] font-medium text-gray-500 tracking-widest uppercase -mt-0.5">Luxury Stays</span>
              </div>
            </Link>

            <h2 className="text-4xl font-black leading-tight mb-3 tracking-tight">
              Welcome<br />back.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Sign in to manage your bookings and unlock exclusive member rates across 500+ properties.
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-orange-400 text-xs" />
                  </div>
                  <span className="text-gray-400 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Destinations ticker */}
          <div className="relative z-10 mt-10">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-2">Popular destinations</p>
            <div className="flex flex-wrap gap-2">
              {DESTINATIONS.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full"
                >
                  <FaMapMarkerAlt className="text-orange-400 text-[9px]" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="md:w-7/12 bg-white p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-1">Sign in</h1>
              <p className="text-gray-400 text-sm">Enter your details to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                  Email address
                </label>
                <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                  focused === "email" ? "border-orange-400 ring-2 ring-orange-100" : "border-gray-200"
                }`}>
                  <FaEnvelope className="absolute left-3.5 text-gray-300 text-sm pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                  Password
                </label>
                <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                  focused === "password" ? "border-orange-400 ring-2 ring-orange-100" : "border-gray-200"
                }`}>
                  <FaLock className="absolute left-3.5 text-gray-300 text-sm pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-300 hover:text-gray-500 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:scale-100 disabled:shadow-none transition-all duration-200 mt-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">New to Raynott?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register CTA */}
            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Create an account
              <FaArrowRight className="text-xs text-gray-400" />
            </Link>

            <p className="text-center text-xs text-gray-300 mt-6">
              Protected by 256-bit SSL encryption
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}