import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHotel,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
  FaGift
} from "react-icons/fa";

const HIGHLIGHTS = [
  { icon: FaGift,      text: "Exclusive member-only rates" },
  { icon: FaShieldAlt, text: "Secure & encrypted account" },
  { icon: FaStar,      text: "500+ luxury properties" },
];

const REQUIREMENTS = [
  { label: "8+ characters",      test: (p) => p.length >= 8 },
  { label: "Uppercase letter",   test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter",   test: (p) => /[a-z]/.test(p) },
  { label: "Number",             test: (p) => /[0-9]/.test(p) },
  { label: "Special character",  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function strengthLabel(score) {
  if (score === 0) return { text: "", color: "" };
  if (score <= 2)  return { text: "Weak",   color: "bg-red-500",    textColor: "text-red-500" };
  if (score <= 3)  return { text: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500" };
  return              { text: "Strong",  color: "bg-emerald-500", textColor: "text-emerald-500" };
}

export default function Register() {
  const { setUserAfterLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [focused, setFocused]   = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const metReqs  = REQUIREMENTS.map((r) => r.test(formData.password));
  const score    = metReqs.filter(Boolean).length;
  const strength = strengthLabel(score);
  const pwMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields"); return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match"); return;
    }
    if (score < 3) {
      toast.error("Please choose a stronger password"); return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setUserAfterLogin(data.user);
      toast.success("Welcome to Raynott!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (key) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent border transition-all duration-200 ${
      focused === key
        ? "border-orange-400 ring-2 ring-orange-100"
        : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/10"
      >

        {/* ── LEFT PANEL ── */}
        <div className="relative md:w-5/12 bg-gray-950 text-white p-10 flex flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
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
              Join the<br />community.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Create a free account and unlock exclusive rates, priority booking, and personalised recommendations.
            </p>

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

          {/* Bottom quote */}
          <div className="relative z-10 mt-10 border-t border-white/8 pt-6">
            <p className="text-gray-500 text-xs leading-relaxed italic">
              "Raynott made finding the perfect hotel effortless. Booked a suite in Tokyo in under 2 minutes."
            </p>
            <p className="text-gray-600 text-xs mt-2">— Emma D., London</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="md:w-7/12 bg-white p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">

            <div className="mb-7">
              <h1 className="text-3xl font-black text-gray-900 mb-1">Create account</h1>
              <p className="text-gray-400 text-sm">Free forever — no credit card required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none" />
                  <input
                    id="name" name="name" type="text"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    className={fieldClass("name")}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none" />
                  <input
                    id="email" name="email" type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className={fieldClass("email")}
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
                    id="password" name="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                    required
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 text-gray-300 hover:text-gray-500 transition-colors">
                    {showPw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>

                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                      {strength.text && (
                        <span className={`text-xs font-semibold ${strength.textColor}`}>{strength.text}</span>
                      )}
                    </div>
                    {/* Requirements inline */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                      {REQUIREMENTS.map((r, i) => (
                        <div key={r.label} className="flex items-center gap-1.5">
                          <FaCheckCircle className={`text-[10px] flex-shrink-0 ${metReqs[i] ? "text-emerald-500" : "text-gray-200"}`} />
                          <span className={`text-[11px] ${metReqs[i] ? "text-emerald-600" : "text-gray-400"}`}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                  Confirm password
                </label>
                <div className={`relative flex items-center border rounded-xl transition-all duration-200 ${
                  pwMismatch
                    ? "border-red-300 ring-2 ring-red-100"
                    : focused === "confirm"
                    ? "border-orange-400 ring-2 ring-orange-100"
                    : "border-gray-200"
                }`}>
                  <FaLock className="absolute left-3.5 text-gray-300 text-sm pointer-events-none" />
                  <input
                    id="confirmPassword" name="confirmPassword"
                    type={showCpw ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                    required
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowCpw(!showCpw)}
                    className="absolute right-3 text-gray-300 hover:text-gray-500 transition-colors">
                    {showCpw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {pwMismatch && (
                  <p className="text-red-500 text-xs mt-1.5">Passwords do not match</p>
                )}
                {!pwMismatch && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-emerald-500 text-xs mt-1.5 flex items-center gap-1">
                    <FaCheckCircle className="text-[10px]" /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:scale-100 disabled:shadow-none transition-all duration-200 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">Already have an account?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Sign in instead
              <FaArrowRight className="text-xs text-gray-400" />
            </Link>

            <p className="text-center text-xs text-gray-300 mt-5">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-gray-500 transition-colors">Terms</a> &{" "}
              <a href="#" className="underline hover:text-gray-500 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}