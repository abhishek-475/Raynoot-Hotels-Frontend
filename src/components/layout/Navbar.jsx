import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext"
import {
  FaHotel,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaUserPlus,
  FaSignInAlt,
  FaCalendarAlt,
  FaIdCard,
  FaInfoCircle,
  FaPhone,
  FaTachometerAlt
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 24px 0 rgba(0,0,0,0.04)"
      }}
    >
      <div className="max-w-7xl mx-auto px-5">

        {/* TOP BAR */}
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-200 group-hover:scale-105 transition-transform duration-200">
              <FaHotel className="text-white text-sm" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-gray-900 text-lg tracking-tight">Raynott</span>
              <span className="block text-[10px] font-medium text-gray-400 tracking-widest uppercase -mt-0.5">Luxury Stays</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/hotels" icon={<FaSearch />} label="Hotels" active={isActive("/hotels")} />
            <NavLink to="/about" icon={<FaInfoCircle />} label="About" active={isActive("/about")} />
            <NavLink to="/contact" icon={<FaPhone />} label="Contact" active={isActive("/contact")} />
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <NavLink to="/bookings/my" icon={<FaCalendarAlt />} label="Bookings" active={isActive("/bookings/my")} />

                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <FaTachometerAlt className="text-xs" />
                    Dashboard
                  </Link>
                )}

                {/* USER PILL */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 pr-0.5">{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt className="text-sm" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm px-5 py-2 rounded-xl font-bold hover:scale-105 hover:shadow-md hover:shadow-orange-200 transition-all duration-200"
                >
                  <FaUserPlus className="text-xs" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden mb-3 rounded-2xl overflow-hidden border border-gray-100"
              style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <div className="p-3 space-y-0.5">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 pt-1 pb-2">Navigation</p>
                <MobileLink to="/hotels" icon={<FaSearch />} label="Hotels" onClick={() => setIsOpen(false)} />
                <MobileLink to="/about" icon={<FaInfoCircle />} label="About" onClick={() => setIsOpen(false)} />
                <MobileLink to="/contact" icon={<FaPhone />} label="Contact" onClick={() => setIsOpen(false)} />

                {user ? (
                  <>
                    <div className="h-px bg-gray-100 my-2 mx-3" />
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 pt-1 pb-2">Account</p>

                    {/* User info row */}
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role === "admin" ? "Administrator" : "Guest"}</p>
                      </div>
                    </div>

                    <MobileLink to="/bookings/my" icon={<FaCalendarAlt />} label="My Bookings" onClick={() => setIsOpen(false)} />
                    <MobileLink to="/profile" icon={<FaIdCard />} label="Profile" onClick={() => setIsOpen(false)} />

                    {user.role === "admin" && (
                      <MobileLink to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClick={() => setIsOpen(false)} />
                    )}

                    <div className="h-px bg-gray-100 my-2 mx-3" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
                    >
                      <FaSignOutAlt className="text-base" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-gray-100 my-2 mx-3" />
                    <MobileLink to="/login" icon={<FaSignInAlt />} label="Log in" onClick={() => setIsOpen(false)} />
                    <div className="px-3 pt-1 pb-2">
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        <FaUserPlus className="text-xs" />
                        Create Account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors ${
        active
          ? "text-orange-500 bg-orange-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <span className="text-xs opacity-70">{icon}</span>
      {label}
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400"
        />
      )}
    </Link>
  );
}

function MobileLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
    >
      <span className="text-gray-400 text-base w-5 flex-shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

export default Navbar;