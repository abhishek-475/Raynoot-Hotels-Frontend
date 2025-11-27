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
  FaSignInAlt
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="bg-white rounded-lg p-2">
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
            <Link
              to="/hotels"
              className="font-medium hover:text-blue-200 transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-blue-200 flex items-center space-x-2"
            >
              <FaSearch className="text-sm" />
              <span>Browse Hotels</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 xl:space-x-6">
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
                <div className="flex items-center space-x-3 bg-blue-500 rounded-lg px-4 py-2">
                  <div className="text-right">
                    <div className="font-medium text-sm sm:text-base flex items-center space-x-2">
                      <FaUser className="text-blue-200" />
                      <span>{user.name}</span>
                    </div>
                    <div className="text-blue-100 text-xs">
                      {user.role === "admin" ? "Administrator" : "Guest"}
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
                  onClick={logout}
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
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-3 border-t border-blue-500">
            {/* Navigation Links */}
            <Link
              to="/hotels"
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              <FaSearch />
              <span>Browse Hotels</span>
            </Link>

            {user ? (
              <>
                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-3 py-3 px-4 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaTachometerAlt />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link to="/bookings/my" className="text-gray-700 hover:text-blue-600">
                  My Bookings
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>

                {/* User Info */}
                <div className="bg-blue-500 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-blue-200 text-lg" />
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
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
                  onClick={() => setIsOpen(false)}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
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