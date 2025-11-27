import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaHotel,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaSearch,
  FaUserPlus,
  FaSignInAlt,
  FaCalendarAlt,
  FaIdCard,
  FaInfoCircle,
  FaPhone,
  FaBookmark
} from "react-icons/fa";

function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMobileMenu}
          >
            <div className="bg-white rounded-lg p-2 group-hover:scale-110 transition-transform duration-200">
              <FaHotel className="text-blue-600 text-xl" />
            </div>
            <div>
              <span className="font-bold text-xl sm:text-2xl group-hover:text-blue-200 transition-colors block">
                Raynott Hotels
              </span>
              <span className="text-blue-200 text-xs hidden sm:block">Luxury Stays</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* Navigation Links */}
            <Link
              to="/hotels"
              className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
            >
              <FaSearch className="text-sm" />
              <span>Browse Hotels</span>
            </Link>

            <Link
              to="/about"
              className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
            >
              <FaInfoCircle className="text-sm" />
              <span>About</span>
            </Link>

            <Link
              to="/contact"
              className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
            >
              <FaPhone className="text-sm" />
              <span>Contact</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 xl:space-x-6">
                {/* User-specific links */}
                <Link
                  to="/bookings/my"
                  className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
                >
                  <FaCalendarAlt className="text-sm" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
                >
                  <FaIdCard className="text-sm" />
                  <span>Profile</span>
                </Link>

                {/* Dashboard link for admin users */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <FaTachometerAlt className="text-lg" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User info */}
                <div className="flex items-center space-x-3 bg-blue-500 rounded-lg px-4 py-2 border border-blue-400">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm sm:text-base flex items-center space-x-2">
                      <span>{user.name}</span>
                    </div>
                    <div className="text-blue-100 text-xs">
                      {user.role === "admin" ? "Administrator" : "Member"}
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow hover:shadow-md flex items-center space-x-2"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
                >
                  <FaSignInAlt className="text-sm" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow hover:shadow-md flex items-center space-x-2"
                >
                  <FaUserPlus className="text-lg" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-blue-500">
            {/* Common Navigation Links */}
            <Link
              to="/hotels"
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
              onClick={closeMobileMenu}
            >
              <FaSearch />
              <span>Browse Hotels</span>
            </Link>

            <Link
              to="/about"
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
              onClick={closeMobileMenu}
            >
              <FaInfoCircle />
              <span>About Us</span>
            </Link>

            <Link
              to="/contact"
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
              onClick={closeMobileMenu}
            >
              <FaPhone />
              <span>Contact</span>
            </Link>

            {user ? (
              <>
                {/* User-specific links */}
                <Link
                  to="/bookings/my"
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
                  onClick={closeMobileMenu}
                >
                  <FaCalendarAlt />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
                  onClick={closeMobileMenu}
                >
                  <FaIdCard />
                  <span>My Profile</span>
                </Link>

                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-3 py-3 px-4 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <FaTachometerAlt />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {/* User Info */}
                <div className="bg-blue-500 rounded-lg p-4 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-blue-100 text-sm">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    {user.role === "admin" && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-blue-200 text-xs text-center">
                    {user.role === "admin" ? "Administrator" : "Member"} Account
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 mt-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
                  onClick={closeMobileMenu}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <FaUserPlus />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;